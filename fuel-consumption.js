function FuelConsumption() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Global fossil fuel consumption: Type (New)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'fuel-consumption';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/global-fossil-fuel-consumption.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
    };


  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
    // Fill the options with all year numbers.
    var years = this.data.columns;
      
    //create a slider
    this.slider = createSlider(1800, 2019, 1900);
    this.slider.position(width / 1.65, height - 10);  
    this.slider.size(400);   
  };

  this.destroy = function() {
    this.slider.remove();
  };

  // Create a new radial bar chart object.
  this.bar = new RadialBarChart(width / 2, height / 2, 450);
    
  this.prevCol = [];
  this.prevYear = 0;

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    //slider for the timeline
    push();
    textSize(16);
    textAlign('right', 'top');
    fill(0, 0, 0);
    stroke(2);
    text('Slide to move across the timeline', width / 1.65, height - 30);
    pop();
      
    var yearNum = this.slider.value();
      
    // Get the column of raw data for yearNum.
    var col = this.data.getColumn(yearNum.toString());
      
    
    /*
        This condition to check for undefined is to make for gaps in the data. 
    */    
    if(typeof(col[0]) != 'undefined') {  
        
        this.prevCol = col;
        this.prevYear = yearNum;
      
        //sum of energy produced by all types of fuel
        var s = sum(col);  
        // Convert all data strings to numbers.
        //col = stringsToNumbers(col);

        // Copy the row labels from the table (the first item of each row).
        var labels = this.data.getColumn(0);
        for(var i = 0; i < labels.length; i++) {
            var percentage = (col[i]/s)*100;
            percentage = percentage.toFixed(2);
            labels[i] = labels[i].concat(": " + col[i] + " TWh " + '(' + percentage + '%)');
        }

        // Colour to use for each category.
        var colours = ['blue', 'red', 'green'];

        // Make a title.
        var title = 'Fossil fuel diversity in ' + yearNum;
        
        //print year number in the middle of the chart
        push();
        textSize(60);
        textAlign('center', 'top');
        fill(0, 0, 0);
        stroke(2);
        text(yearNum.toString(), width / 2, height / 2.2);
        pop();
      
        // Draw the radial bar chart!
        this.bar.draw(col, labels, colours, title);
    }
    else if(this.prevCol != null && this.prevYear != 0) {
        var s = sum(this.prevCol);
        var labels = this.data.getColumn(0);
        for(var i = 0; i < labels.length; i++) {
            var percentage = (this.prevCol[i]/s)*100;
            percentage = percentage.toFixed(2);
            labels[i] = labels[i].concat(": " + this.prevCol[i] + " TWh " + '(' + percentage + '%)');
        }

        // Colour to use for each category.
        var colours = ['blue', 'red', 'green'];

        // Make a title.
        var title = 'Fossil fuel diversity in ' + this.prevYear;
        
        //print year number in the middle of the chart
        push();
        textSize(60);
        textAlign('center', 'top');
        fill(0, 0, 0);
        stroke(2);
        text(this.prevYear.toString(), width / 2, height / 2.2);
        pop();
      
        // Draw the radial chart!
        this.bar.draw(this.prevCol, labels, colours, title);
    }
  };
}
