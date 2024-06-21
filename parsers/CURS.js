/**
 * Example class
**/
//type 'CURS' {
//		hex string [32];										/* Data 				*/
//		hex string [32];										/* Mask 				*/
//		point;													/* Hot spot 			*/
//};

class CURS extends ResourceScanner {
  constructor(data, type = 'raw') {
    // type = raw
    
    super(data);
    
    this.data = [];
    for ( var i = 0; i < 32; i += 1 ) 
      this.data.push(this.read('byte'));
      
    this.mask = [];
    for ( var i = 0; i < 32; i += 1 ) 
      this.mask.push(this.read('byte'));
      
    this.hotSpot = this.read('point');
  }
}