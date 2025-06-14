function EnergyPerCapita() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Energy consumed per capita: Country (New)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'energy-per-capita';
    
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
    numXTickLabels: 12,
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
      './data/energy_consumption_per_capita.csv', 'csv', 'header',
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
        'name': this.data.getString(i, 'Gigajoule per capita'),
        'carbon': this.data.getNum(i, year.toString())
      };
      this.countries[i] = country;
    }
  }.bind(this)
  
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
    
  var getColor = function(emissions) {
    var d = emissions;
    if(d > 1100)
        return '#800026';
    else if(d > 1000)
        return '#BD0026';
    else if(d > 800)
        return '#E31A1C';
    else if(d > 600)
        return '#FC4E2A';
    else if(d > 400)
        return '#FD8D3C';
    else if(d > 200)
        return '#FEB24C';
    else if(d > 100)
        return '#FED976';
    else if(d > 0)
        return '#FFEDA0'
    else if(d < 0)      //data unavailable
        return 'black';
  }.bind(this)  

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
    this.drawCategoryLabels();

    var lineHeight = (height - this.layout.topMargin) /
        this.data.getColumnCount();
      
    // Draw all y-axis labels.
    drawXAxisTickLabels(0,
                        1200,
                        this.layout,
                        this.mapEmissionsToWidth.bind(this),
                        0);

    drawAxis(this.layout);
      
    //draw slider for interaction
    this.yearSlider.position(350, 20);  
    this.yearSlider.size(120);
    push();
    stroke(1);
    textSize(12);
    textAlign('left', 'top');
    text('(slide to move across the timeline)', 180, 15);
    
    //get sliders value
    var yearNum = this.yearSlider.value();

    parseData(yearNum); 

    textAlign('right', 'top');
    this.slider.position(270, (height-50)/2);
    this.slider.style("transform", "rotate(90deg)");
    text('(slide to\nexplore more\ncountries)', 120, (height-50)/2);
    pop();  
    
    push();
    textSize(20);
    text('Year: ' + yearNum, this.layout.leftMargin + 300, this.layout.topMargin - 35);
    pop();
      
    function compareEmissions(a, b) {
        return b.carbon - a.carbon;
    }  
    this.countries.sort(compareEmissions);  
    
    //get sliders value
    var val = this.slider.value();
    console.log(val);
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
      fill(getColor(country.carbon));
      rect(this.layout.leftMargin,
           lineY,
           this.mapEmissionsToWidth(country.carbon),
           lineHeight - this.layout.pad);   
      pop();
    }
  };

  this.drawCategoryLabels = function() {
    push();
    fill(0);
    noStroke();
    textAlign('center', 'top');
    text('Gigajoule per capita',
         this.midX,
         this.layout.pad);
    pop();
  };

  this.mapEmissionsToWidth = function(emissions) {
    return map(emissions,
               0,
               1200,
               0,
               this.layout.plotWidth());
  };
}
