function RadialBarChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * (0.999) * TWO_PI);
    }
      
    return radians;
  };

  this.draw = function(data, labels, colours, title) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
      Labels (length: ${labels.length})
      Colours (length: ${colours.length})
      Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    var angles = get_radians(data);
    var lastAngle = 3*PI/2;
    var colour;

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      push();
        
      noFill();
      stroke(colour);
      strokeWeight(18);

      arc(this.x, this.y,
          this.diameter - (i)*(0.13 * this.diameter), this.diameter - (i)*(0.13 * this.diameter),
          3*PI/2, lastAngle + angles[i] + 0.001); // Hack for 0!
       
      if(labels) {
          this.makeLegendItem(labels[i], i, colours[i]);
      }
      
      pop();
    
        
      //lastAngle += angles[i];
    }

    if (title) {
      push();
      fill('black');
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
      pop();
    }
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x - 350
    var y = this.y + (this.labelSpace * i) - 210;
    var boxWidth = this.labelSpace / 3;
    var boxHeight = this.labelSpace / 3;
    
    push();
    fill(colour);
    rect(x, y, boxWidth, boxHeight);
    pop();

    push();
    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 3);
    pop();
  };
}
