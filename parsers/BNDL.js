//type 'BNDL' {
//		literal longint;										/* Signature			*/
//		integer;												/* Version ID			*/
//		integer = $$CountOf(TypeArray) - 1;
//		array TypeArray {
//				literal longint;								/* Type 				*/
//				integer = $$CountOf(IDArray) - 1;
//				wide array IDArray {
//						integer;								/* Local ID 			*/
//						integer;								/* Actual ID			*/
//				};
//		};
//};

class BNDL {
  constructor(data, type = 'raw') {
    // sort type
    //  ...
    
    var index = 0;
    
    const $ = (type) => {
      switch (type) {
        case "byte":
        case "op1":
          return parseInt(data[index++]);
          
        case "op2":
          if ( this.#index % 2 ) index++;
          // fallthough as word
        case "word":
        case "integer":
        case "int":
        case "mode":
        case "rowbytes":
          return ($("byte") << 8) + $("byte"); // realign if PC is odd

        case "long":
          return ($("word") << 16) + $("word");
          
        case "point":
          return {
            x: $('word'),
            y: $('word')
          };
          
        case "rect":
          return {
            top: $("integer"),
            left: $("integer"),
            bottom: $("integer"),
            right: $("integer")
          };
          
        case "fixed":
          return {
            integer: $("integer"),
            fraction: $("integer")
          };
        
        case "pattern":
          return [
            $("integer"),
            $("integer"),
            $("integer"),
            $("integer")
          ];
          
        case "pixMap":
          return {
            // baseAddr: $("long"),
            ...$('bitMap'),
            ...$('pixMap-bitMap')
          };
        
        case "pixMap-bitMap": // rest of a pixMap
          return {
            version: $("int"),
            packType: $("int"),
            packSize: $("long"),
            hRes: $("fixed"),
            vRes: $("fixed"),
            pixelType: $("int"),
            pixelSize: $("int"),
            cmpCount: $("int"),
            cmpSize: $("int"),
            planeBytes: $("long"),
            pmTable: $("long"),
            pmReserved: $("long")
          }
          
        case "bitMap":
          return {
            rowBytes: $("int"),
            Bounds: $("rect")
          }
          
        case "colorTable":
          {
            var table = {
              ctSeed: $('long'),
              ctFlags: $('int'),
              ctSize: $('int') + 1,
              ctTable: []
            };
            
            for ( var i = 0; i < table.ctSize; i += 1 )
              table.ctTable.push($('colorSpec'));
            
            return table;
          }
        
        case "colorSpec":
          return {
            value: $('int'),
            rgb: $('RGBColor')
          };
          
        case "RGBColor":
          // colours are read as words, but are bytes
          return {
            red: $('integer') >> 8,
            green: $('integer') >> 8,
            blue: $('integer') >> 8
          };
        
        default:
          throw `unknown type "${type}"`;
      }
    }
    
    this.signature = $('long');
    this.versionId = $('int');
    const typeArrayLength = $('int');   // count of array
    const typeArray = [];
    for ( var i = 0; i < typeArrayLength; i += 1 ) {
      const type = $('long');
      const IDArrayLength = $('int');
      const IDArray = [];
      for ( var j = 0; j < IDArrayLength; j += 1) {
        IDArray.push({
          localId: $('int'), // local ID
          actualId: $('int') // actual ID
        });
      }
      typeArray.push({
        type: type,
        ID: IDArray
      });
    }
    this.type = typeArray;
    
  }
}
