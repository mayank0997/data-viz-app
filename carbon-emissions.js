function CarbonEmissionsCountry() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Nominal CO2 Emissions: Country (New)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'carbon-emissions-country';
    
  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 250,
    rightMargin: width,
    topMargin: 50,
    bottomMargin: height,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
  };

  // Middle of the plot: for 50% line.
  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/carbon-data-country.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.countries = [];
  var parseData = function(year) {
      for (var i = 0; i < this.data.getRowCount(); i++) {
      // Create an object that stores data from the current row.
      var country = {
        // Convert strings to numbers.
        'name': this.data.getString(i, 'country'),
        'carbon': this.data.getNum(i, year.toString()),
      };
      this.countries[i] = country;
    }
  }.bind(this)
    
  var summation = function(data) {
    var total = 0;
    for (let i = 0; i < data.length; i++) {
        total = total + data[i];
    }
    return total;
}
  
  var pareto = function(data) {  
      var cumulative = [];
      var total = summation(data);
      var run = 0;
      for(var i = 0; i < data.length; i++) {
          var percent = (data[i]/total) * 100;
          parseFloat(percent).toFixed(6);
          run += percent;
          parseFloat(run).toFixed(3);
          cumulative[i] = run;
      }
      return cumulative;
  }
  
  this.setup = function() {      
    // Font defaults.
    textSize(16);    
    parseData(1990);
    this.slider = createSlider(0, this.countries.length - 30, 0);
    this.yearSlider = createSlider(1990, 2020);
  };

  this.destroy = function() {
      this.slider.remove();
      this.yearSlider.remove();
  };
    
  

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw category labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight = (height - this.layout.topMargin) /
        (this.data.getColumnCount());
      
    // Draw all x-axis labels.
    drawXAxisTickLabels(0,
                        10000,
                        this.layout,
                        this.mapEmissionsToWidth.bind(this),
                        0);
      
    drawBottomXAxisTickLabels(0, 100, this.layout, this.mapPercentToWidth.bind(this), 0);

      
    this.yearSlider.position(350, 20);  
    this.yearSlider.size(120);
      
    var yearNum = this.yearSlider.value();
      
    push();
    stroke(1);
    textSize(12);
    textAlign('left', 'top');
    text('(slide to move \nacross the timeline)', 30, 35);
      
    // Get the column of raw data for yearNum.
    //var col = this.data.getColumn(yearNum.toString());
    parseData(yearNum);
      
    drawAxis(this.layout);
      
    textAlign('right', 'top');
    this.slider.position(270, (height-50)/2);
    this.slider.style("transform", "rotate(90deg)");
    text('(slide to\nexplore more\ncountries)', 120, (height-50)/2);
    pop();  
      
    push();
    textSize(20);
    stroke(1);
    text('Year: ' + yearNum, this.layout.leftMargin + 70, this.layout.topMargin - 35);
    pop();
      
    function compareEmissions(a, b) {
        return b.carbon - a.carbon;
    }  
    this.countries.sort(compareEmissions);  
    
    var emissions = [];
    for(var i = 0; i < this.countries.length; i++) {
        emissions[i] = this.countries[i].carbon;
    }
      
    var cumulative = pareto(emissions);
    
    var val = this.slider.value();
            
    //console.log(val);
    for(var i = 0; i < this.countries.length; i++) {
      // Calculate the y position for each country
      var lineY = (lineHeight * i) + this.layout.topMargin;
      if(val + i >= this.countries.length)
          break;
      var country = this.countries[val + i];
      // Draw the country name in the left margin.
      push();
      fill(0);
      noStroke();
      textAlign('right', 'top');
      textSize(13);
      text(country.name,
           this.layout.leftMargin - this.layout.pad,
           lineY);
      pop();
        
      // Draw emissions rectangle.
      push();
      noStroke();
      fill(112, 128, 144);
      rect(this.layout.leftMargin,
           lineY,
           this.mapEmissionsToWidth(country.carbon),
           lineHeight - this.layout.pad);   
      pop();
        
      //draw cumulative percentage point    
      push();
      fill(0, 0, 0);
      ellipse(this.layout.leftMargin + this.mapPercentToWidth(cumulative[val + i]), (lineY + (lineHeight + this.layout.pad)/3), 5);
      pop();
    
      //draw pareto line
      if(cumulative[val + i - 1] != undefined) {
        //draw cumulative percentage point    
        push();
        stroke(2);
        strokeWeight(3);
        fill(0, 0, 0);  
        line(this.layout.leftMargin + this.mapPercentToWidth(cumulative[val + i - 1]),
             lineY - lineHeight + (lineHeight + this.layout.pad)/3,
             this.layout.leftMargin + this.mapPercentToWidth(cumulative[val + i]),
             lineY + (lineHeight + this.layout.pad)/3);
        pop();
          
        push();
        var display = cumulative[val + i - 1].toFixed(2);
        fill(0, 0, 0);
        stroke(2);
        textSize(12);
        text(display + '%', this.layout.leftMargin + this.mapPercentToWidth(cumulative[val + i - 1]), (lineY - lineHeight + (lineHeight + this.layout.pad)/2));
        pop();
      }
    
    }
  };

  this.drawCategoryLabels = function() {
    push();
    fill(0);
    noStroke();
    textAlign('center', 'top');
    text('Millions of tons of Carbon Dioxide',
         this.midX,
         this.layout.pad);
    text('Cumulative Percentage',
         this.midX,
         this.layout.bottomMargin - 6 * this.layout.pad);
    pop();
  };

  this.mapEmissionsToWidth = function(emissions) {
    return map(emissions,
               0,
               10000,
               0,
               this.layout.plotWidth());
  };
    
  this.mapPercentToWidth = function(percent) {
    return map(percent,
               0.00,
               100.00,
               0,
               this.layout.plotWidth());
  };
}
