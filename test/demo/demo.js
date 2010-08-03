(function() {
  
  function pad(str, length) {
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
   };
  
  var getRandomInt = fabric.util.getRandomInt;
  function getRandomColor() {
    return (
      pad(getRandomInt(0, 255).toString(16), 2) + 
      pad(getRandomInt(0, 255).toString(16), 2) + 
      pad(getRandomInt(0, 255).toString(16), 2)
    );
  }
  function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
  }
  function loadSVGFromURL(url, callback) {
    var req = new fabric.util.request(url, {
      method: 'get',
      onComplete: function(r) {
        var xml = r.responseXML;
        if (!xml) return;
        var doc = xml.documentElement;
        if (!doc) return;
        fabric.parseSVGDocument(doc, callback);
      }
    })
  }
  
  var canvas = this.canvas = new fabric.Element('canvas');
  
  var fpsEl = document.getElementById('fps').firstChild;
  
  canvas.onFpsUpdate = function(fps) {
    fpsEl.nodeValue = 'FPS: ' + fps;
  };
  
  document.getElementById('commands').onclick = function(ev) {
    ev.preventDefault();
    
    var element = ev.target || ev.srcElement,
        className = element.className,
        offset = 50,
        left = fabric.util.getRandomInt(0 + offset, 700 - offset),
        top = fabric.util.getRandomInt(0 + offset, 500 - offset),
        angle = fabric.util.getRandomInt(-20, 40),
        width = fabric.util.getRandomInt(30, 50),
        opacity = (function(min, max){ return Math.random() * (max - min) + min; })(0.5, 1);
    
    switch (className) {
      case 'rect':
        canvas.add(new fabric.Rect({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          width: 50, 
          height: 50, 
          opacity: 0.8 
        }));
        break;
        
      case 'circle':
        canvas.add(new fabric.Circle({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          radius: 50, 
          opacity: 0.8 
        }));
        break;
      
      case 'triangle':
        canvas.add(new fabric.Triangle({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          width: 50, 
          height: 50, 
          opacity: 0.8 
        }));
        break;
      
      case 'image1':
        fabric.Image.fromURL('assets/pug.jpg', function(image) {
          image.set('left', left).set('top', top).set('angle', angle).scale(getRandomNum(0.1, 0.25)).setCoords();
          canvas.add(image);
        });
        break;
      
      case 'image2':
        fabric.Image.fromURL('assets/logo.png', function(image) {
          image.set('left', left).set('top', top).set('angle', angle).scale(getRandomNum(0.1, 1)).setCoords();
          canvas.add(image);
        });
        break;
      
      case 'shape':
        var id = element.id, match;
        if (match = /\d+$/.exec(id)) {
          loadSVGFromURL('assets/' + match[0] + '.svg', function(objects, options) {
            var pathGroup = new fabric.PathGroup(objects, options);
            pathGroup
              .set('left', left)
              .set('top', top)
              .set('angle', angle)
              .set('fill', '#' + getRandomColor())
              .scale(getRandomNum(0.75, 1.25))
              .setCoords();
              
            canvas.add(pathGroup);
          });
        }
        break;
      
      case 'clear':
        if (confirm('Are you sure?')) {
          canvas.clear();
        }
    }
    setTimeout(function(){
      document.getElementById('complexity').childNodes[1].innerHTML = ' ' + canvas.complexity();
    }, 100);
  };
  
  document.getElementById('execute').onclick = function() {
    var code = document.getElementById('canvas-console').value;
    if (!(/^\s+$/).test(code)) {
      eval(code);
    }
  };
  
  document.getElementById('rasterize').onclick = function() {
    window.open(canvas.toDataURL('png'));
  };
  
  document.getElementById('remove-selected').onclick = function() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
      canvas.remove(activeObject);
    }
    else if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.removeActiveGroup();
      objectsInGroup.forEach(function(object) {
        canvas.remove(object);
      });
    }
  };
  
  var supportsSlider = (function(){
    var el = document.createElement('input');
    el.type = 'range';
    return el.type === 'range';
  })();
  
  if (supportsSlider) {
    var controls = document.getElementById('controls');
    
    var sliderLabel = document.createElement('label');
    sliderLabel.htmlFor = 'opacity';
    sliderLabel.innerHTML = 'Opacity: ';
    
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'opacity';
    slider.value = 100;
    
    controls.appendChild(sliderLabel);
    controls.appendChild(slider);
    
    canvas.calcOffset();
    
    slider.onchange = function() {
      var activeObject = canvas.getActiveObject(),
          activeGroup = canvas.getActiveGroup();
          
      if (activeObject || activeGroup) {
        (activeObject || activeGroup).set('opacity', parseInt(this.value, 10) / 100);
        canvas.renderAll();
      }
    };
  }
  
})();