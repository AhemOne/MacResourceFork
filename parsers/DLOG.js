// By Jesse Falzon, 2024
class DLOG extends ResourceScanner {
  constructor(data, type = 'raw') {
    // type = raw
    super(data);
    
    this.Bounds = this.read('rect');
    this.procID = this.read('int');
    this.visible = this.read('byte') ? true : false;
    this.read('byte'); // filler
    this.goAway = this.read('byte') ? true : false;
    this.read('byte');
    this.refCon = this.read('long');
    this['DITL ID'] = this.read('int');
    const titleLength = this.read('byte');
    this.title = '';
    for ( var i = 0; i < titleLength; i += 1 )
      this.title += String.fromCharCode(this.read('byte'));
    try {
      this.align('word');
      
      this.position = 'unknown';
      switch(this.read('int')) {
        case 0x0000: this.position = 'noAutoCenter'; break;
        case 0x280a: this.position = 'centerMainScreen'; break;
        case 0x300a: this.position = 'alertPositionMainScreen'; break;
        case 0x380a: this.position = 'staggerMainScreen'; break;
        case 0xa80a: this.position = 'centerParentWindow'; break;
        case 0xb00a: this.position = 'alertPositionParentWindow'; break;
        case 0xb80a: this.position = 'staggerParentWindow'; break;
        case 0x680a: this.position = 'centerParentWindowScreen'; break;
        case 0x700a: this.position = 'alertPositionParentWindowScreen'; break;
        case 0x780a: this.position = 'staggerParentWindowScreen'; break;
        default: throw "unknown position";
      }
    } catch (error) {
      // before system 7
      return;
    }
  }
}

function DLOG2Div(dlog) {
  var div = document.createElement('div');
  
  div.style.position = 'absolute';
  
  div.style.background = 'white';
  div.style.padding = '3px';
  div.style.border = '3px lightgrey outset'
  
  div.style.transform = "translate(-50%, -50%)";
  div.style.left = '50%';
  div.style.top = '50%';
  
  div.style.width = (dlog.Bounds.right - dlog.Bounds.left) + 'px';
  div.style.height = (dlog.Bounds.bottom - dlog.Bounds.top) + 'px';
    
  div.append(...DITL2Divs(new DITL(game.forks.application.DITL[dlog['DITL ID']].raw)));
  
  console.log(div);
  return div;
}
