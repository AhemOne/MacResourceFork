/**
 * Example class
**/

class ALRT extends ResourceScanner {
  constructor(data, type = 'raw') {
    // sort type
    //  ...
    
    super(data);
    
    var index = 0;
    
    const $ = this.read;
    
    this.Bounds = $('rect');    // bounds
    this['DITL ID'] = $('int');     // DITL ID
    
    for ( var i = 0; i < 4; i += 1 ) {
      const object = { };
      var val = this.read('byte');
      
      object.bold = (val & 0x80) ? 'OK' : 'Cancel';
      object.visible = (val & 0x40) ? true : false;
      object.beeps = val & 0x3f;
      
    }
    
    switch( $('int') ) {
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
    }
  }
}