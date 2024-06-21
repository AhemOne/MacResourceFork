/**
 * Example class
**/

class DITL extends ResourceScanner {
  constructor(data, type = 'raw') {
    // type = resource.raw
    
    super(data);
    
    const DITLArrayLength = 0xFFFF & (this.read('int') + 1);
    this.DITLArray = [];
    
    console.log(`this DITL has ${DITLArrayLength} items`);
    
    for ( var i = 0; i < DITLArrayLength; i += 1 ) {
      const ditl = {
        type: null,
        enabled: false,
        Bounds: null
      };
    
      this.read('long'); // unused
      
      ditl.Bounds = this.read('rect');
      
      const val = this.read('byte');
      ditl.enabled = val & 0x80 ? true : false;
      ditl.typeNum = val & 0x7F
    
      switch ( ditl.typeNum ) {
  			case 1:		
  			  // HelpItem
  			  this.read('byte'); // supposed to give size, but ignored
  			  switch ( this.read('int') ) {
  			    case 1:
  			      ditl.type = "HMScanhdlg";
  			      ditl.ResourceID = this.read('int');
			      break;
			      case 2:
			        ditl.type = "HMScanhrct";
			        ditl.ResourceID = this.read('int');
		        break;
			      case 8:
			        ditl.type = "HMScanAppendhdlg";
			        ditl.ResourceId = this.read('int');
			        ditl.offset = this.read('int');
		        break;
		        default:
		          throw "unknown HelpItem type " + ditl.typeNum;
  			  }
        break;
        case 4: {
  			  ditl.type = 'Button';
  			  ditl.string = '';
  			  const len = this.read('byte');
  			  for ( var j = 0; j < len; j += 1 ) {
  			    ditl.string += String.fromCharCode(this.read('byte'));
  			  }							/* Title				*/
        } break;
        case 5: {
  			  ditl.type = 'CheckBox';
          ditl.string = '';
  			  const len = this.read('byte');
  			  for ( var j = 0; j < len; j += 1 ) {
  			    ditl.string += String.fromCharCode(this.read('byte'));
  			  }
        } break;
        case 6: {
  			  ditl.type = 'RadioButton';
  			  ditl.string = '';
  			  const len = this.read('byte');
  			  for ( var j = 0; j < len; j += 1 ) {
  			    ditl.string += String.fromCharCode(this.read('byte'));
  			  }
        } break;
        case 7:
  			  ditl.type = 'Control';
  			  this.read('byte');
  			  ditl['CTRL ID']= this.read('int');
        break;
        case 8: {
  			  ditl.type = 'StaticText';
  			  ditl.string = '';
  			  const len = this.read('byte');
  			  for ( var j = 0; j < len; j += 1 ) {
  			    ditl.string += String.fromCharCode(this.read('byte'));
  			  }
        } break;
        case 16: {
  			  ditl.type = 'EditText';
  			  ditl.string = '';
  			  const len = this.read('byte');
  			  for ( var j = 0; j < len; j += 1 ) {
  			    ditl.string += String.fromCharCode(this.read('byte'));
  			  }
        } break;
        case 32:
  			  ditl.type = 'Icon';
  			  this.read('byte');
  			  ditl['ICON ID']= this.read('int');
        break;
        case 64:
  			  ditl.type = 'Picture';
  			  this.read('byte');
  			  ditl['PICT ID']= this.read('int');
        break;
        case 0:
  			  ditl.type = 'UserItem';
  			  this.read('byte');
  			  
  			  // need word alignment...
        break;
        default: 
        // unknown type
          throw "Unknown type " + ditl.typeNum;
        break;
  		}
  		this.align('word');
  		
  		console.log('added ', ditl.type);
    		
  		this.DITLArray.push(ditl);
    }
    
    console.log(this)
  }
}

function DITL2Divs(ditl) {
  var children = [];
  for ( var DITLItem of ditl.DITLArray ) {
    var element;
    switch ( DITLItem.type ) {
      case "Button": {
        element = document.createElement('input');
        element.type = 'button';
        element.style.position = 'inherit';
        element.style.left = DITLItem.Bounds.left + 'px';
        element.style.top = DITLItem.Bounds.top + 'px';
        element.style.height = (DITLItem.Bounds.bottom - DITLItem.Bounds.top) + 'px';
        element.style.width = (DITLItem.Bounds.right - DITLItem.Bounds.left) + 'px';
        element.value = DITLItem.string;
      }
      break;
        
      case 'CheckBox': {
        element = document.createElement('span');
        element.style.position = 'inherit';
        element.style.left = DITLItem.Bounds.left + 'px';
        element.style.top = DITLItem.Bounds.top + 'px';
        element.style.height = (DITLItem.Bounds.bottom - DITLItem.Bounds.top) + 'px';
        element.style.width = (DITLItem.Bounds.right - DITLItem.Bounds.left) + 'px';
        
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        element.append(checkbox);
        
        element.append(DITLItem.string);
        element.checked = () => checkbox.checked;
      }
      break;
      
      case 'StaticText': {
        element = document.createElement('span');
        element.style.position = 'inherit';
        element.style.left = DITLItem.Bounds.left + 'px';
        element.style.top = DITLItem.Bounds.top + 'px';
        element.style.height = (DITLItem.Bounds.bottom - DITLItem.Bounds.top) + 'px';
        element.style.width = (DITLItem.Bounds.right - DITLItem.Bounds.left) + 'px';
        
        element.append(DITLItem.string);
      }
      break;
      
      case 'EditText': {
        element = document.createElement('input');
        element.style.position = 'inherit';
        element.style.left = DITLItem.Bounds.left + 'px';
        element.style.top = DITLItem.Bounds.top + 'px';
        element.style.height = (DITLItem.Bounds.bottom - DITLItem.Bounds.top) + 'px';
        element.style.width = (DITLItem.Bounds.right - DITLItem.Bounds.left) + 'px';
        
        element.type = 'text';
        element.value  = DITLItem.string;
      }
      break;
      
      case 'Picture': {
        element = document.createElement('img');
        element.style.position = 'inherit';
        element.style.left = DITLItem.Bounds.left + 'px';
        element.style.top = DITLItem.Bounds.top + 'px';
        element.style.height = (DITLItem.Bounds.bottom - DITLItem.Bounds.top) + 'px';
        element.style.width = (DITLItem.Bounds.right - DITLItem.Bounds.left) + 'px';
        
        element.src = (new PICT(game.forks.application.PICT[DITLItem['PICT ID']].content)).canvas.toDataURL();
      }
      break;
    }
    
    children.push(element);
  }
  
  return children;
}