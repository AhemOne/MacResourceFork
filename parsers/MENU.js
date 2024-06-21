
class MENU extends ResourceScanner {
  constructor(data, type = 'raw') {
    // type = raw
    
    super(data);
    this['Menu ID'] = this.read('int');
    this.read('int'); 
    this.flags = this.read('long');
    this.enabled = (this.flags & 0x01) ? true : false;
    this.flags >>= 1;
    const menuNameLength = this.read('byte');
    this.menuName = "";
    for ( var i = 0; i < menuNameLength; i += 1 ) 
      this.menuName += String.fromCharCode(this.read('byte'));
    
    this.menuItem = [];
    
    var nameLength;
    while (nameLength = this.read('byte') ) {
      const menu = {};

      for ( var i = 0; i < nameLength; i += 1 )
        menu.name += this.read('char');
      
      menu.noIcon = this.read('byte');
      
      switch ( this.key = this.read('byte') ) {
        case 0x00: this.key = "noKey"; break;
        case 0x1B: this.key = "hierarchicalMenu"; break;
      }
      
      switch ( this.mark = this.read('byte') ) {
        case 0x00: this.mark = "noMark"; break;
        case 0x12: this.mark = "check"; break;
      }
      
      this.style = this.read('byte') & 0x7F;

      this.menuItem.push(menu);
    }
  }
}