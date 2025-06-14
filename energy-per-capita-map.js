function Leaflet() {
    // Name for the visualisation to appear in the menu bar.
  this.name = 'Energy consumed per capita: Country (Map view) (New)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'leaflet';

  // Property to represent whether data has been loaded.
  this.loaded = false;
 
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

  this.parseData = function(year) {
      for (var i = 0; i < this.data.getRowCount(); i++) {
      // Create an object that stores data from the current row.
      var country = {
        // Convert strings to numbers.
        'name': this.data.getString(i, 'Gigajoule per capita'),
        'carbon': this.data.getNum(i, year.toString())
      };
      this.countries[i] = country;
    }
  }
   
  //different colours assigned to countries based on their power consumption
  var getColor = function(name) {
    let obj = this.countries.find(o => o.name === name);
    if(obj != undefined)  
        var d = obj.carbon;
    else
        var d = -10;
      
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
    
  var style = function(feature) {
    if(feature.properties.name != undefined) {
    return {
        fillColor: getColor(feature.properties.name),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
    }
      else {
          return {
        fillColor: getColor(-1),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
      }
  }
  
  this.makeLegendItem = function(label, i, colour) {
    var x = width/1.15;
    var y = height/12 + (this.labelSpace * i);
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    push();
    noStroke();
    fill(colour);
    rect(x, y, boxWidth, boxHeight);
    pop();

    fill('black');
    push();
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
    pop();
  };
    
  var highlightFeature = function(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    if(layer.feature.properties.name != undefined) {
        var c = layer.feature.properties.name;
        let obj = this.countries.find(o => o.name === c);
        if(obj != undefined)  
            var d = obj.carbon;
        if(d != undefined) {
            var e = d.toString();
            e = e.concat(' GJ');
        }
        else 
            var e = 'Data unavailable';
        layer.bindPopup(c + ': ' + e);     
        //text(c + ' ' + d, width/1.15, height/1.8);
    }
  }.bind(this);

    
  var resetHighlight = function(e) {
    L.geoJson(countriesData, {style: style, onEachFeature: onEachFeature}).resetStyle(e.target);
  }.bind(this);
    
  var onEachFeature = function(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight    
    });
  }
    
  this.setup = function() {
    this.parseData(1990);  
    this.div = createDiv();
    this.div.id('map');
    this.div.style('font-size', '16px');
    this.div.position(width/2.5, height/12);
    this.div.size(700, 500);

    this.labelSpace = 30;
    
    this.labels = ['> 1100','> 1000','> 800', '> 600','> 300','> 200','> 100', '> 0', 'no data'];
      
    this.colours = ['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FFEDA0', 'black'];
      
     for(var i = 0; i < this.colours.length; i++) {
        if(i != this.colours.length - 1)
            this.labels[i] = this.labels[i].concat(" GJ");
    }
      
      
    //variable to keep track of the movement of the slider  
    this.prevYear = 0;
      
    this.yearSlider = createSlider(1990, 2020);
    this.yearSlider.position(width/1.65, height/1.025);  
    this.yearSlider.size(300);
      
    push();
    textAlign('center', 'bottom');
    textSize(30);
    text('Slide to move across the timeline', width/1.65, height/1.025);
    pop();
    
    
    this.map = L.map('map').setView([0, 0], 1.25);
      
    this.map.options.minZoom = 1.2;
    this.map.options.maxZoom = 8;
      
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    
    var geojson = L.geoJson(countriesData).addTo(this.map); 
      
    this.info = L.control();
      
    this.group = L.layerGroup().addTo(this.map);     
 }
 
    this.destroy = function() {
        this.map.remove();
        this.div.remove();
        this.yearSlider.remove();
    }
 
  this.draw = function() {  
      var yearNum = this.yearSlider.value();
      push();
      textAlign('center', 'bottom');
      textSize(30);
      text('Year: ' + yearNum, width/2.7, height/16);
      pop();
      
      push();
      stroke(1);
      textAlign('right', 'bottom');
      textSize(15);
      text('Slide to move across the timeline', width/1.80, height/1.025);
      textAlign('left', 'top');
      text('(Click a country \n on the map for \n specific data)', width/1.25, height/1.5);
      pop();
      
      for(var i = 0; i < this.colours.length; i++) {
        this.makeLegendItem(this.labels[i], i, this.colours[i]);
      }
    
      //only do the following if the slider has been moved
      if(this.prevYear != yearNum) {
        this.parseData(yearNum);
        this.map.removeLayer(this.group);
        this.group = L.layerGroup().addTo(this.map); 
        L.geoJson(countriesData, {style: style, onEachFeature: onEachFeature}).addTo(this.group);
      }  
      this.prevYear = yearNum;
  }
}