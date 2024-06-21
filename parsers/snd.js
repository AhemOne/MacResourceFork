/**
 * By Jesse Falzon, 2024
**/
class snd extends ResourceScanner {
  constructor(data, type = "raw") {
    // type = raw
    
    super(data);
    
    switch ( this.read('int') ) {
      case 0x0001:
        this.format = 1;
        const nSynths = this.read('int');
        this.synthesisers = [];
        for ( var i = 0; i < nSynths; i += 1) {
          const synth = {};
          switch ( this.read('int') ) {
            case 0x0001: synth.type = 'square'; break;
            case 0x0001: synth.type = 'wave'; break;
            case 0x0001: synth.type = 'sampled'; break;
            default: symth.type = 'unknown'; break;
          }
          synth.init = this.read('long');
          this.synthesizers.push(synth);
        }
        break;
        
      case 0x0002:
        this.format = 2;
        switch ( this.read('int') ) {
          case 0x0000: this.memory = 'free'; break;
          case 0x0101: this.memory = 'keep'; break;
          default: this.memory = 'unknown'; break;
        }
        break;
      
      default:
        this.format = 'unknown';
        break;
    }
    
    const nSoundCmnds = this.read('int');
    this.soundCmnds = [];
    
    for ( var i = 0; i < nSoundCmnds; i += 1 ) {
      const soundCmnd = {};
      var cmd = this.read('int');
      soundCmnd.hasData = (cmd >> 15) ? true : false;
      switch ( cmd & 0x7FFF ) {
        case 0:
          soundCmnd.type = 'null';
          this.read('word');
          this.read('long');
          break;
          
        case 3:
          soundCmnd.type = 'quiet';
          this.read('word');
          this.read('long');
          break;
          
        case 4:
          soundCmnd.type = 'flush';
          this.read('word');
          this.read('long');
          break;
          
        case 10:
          soundCmnd.type = 'wait';
          this.seconds = this.read('word') / 2000;
          this.read('long');
          break;
          
        case 11:
          soundCmnd.type = 'pause';
          this.read('word');
          this.read('long');
          break;
          
        case 12:
          soundCmnd.type = 'resume';
          this.read('word');
          this.read('long');
          break;
          
        case 13:
          soundCmnd.type = 'callback';
          soundCmnd.user1 = this.read('word');
          soundCmnd.user2 = this.read('long');
          break;
          
        case 14:
          soundCmnd.type = 'sync';
          soundCmnd.count = this.read('word');
          soundCmnd.identifier = this.read('long');
          break;
          
        case 15:
          soundCmnd.type = 'empty';
          this.read('word');
          this.read('long');
          break;
        
        case 40:
          soundCmnd.type = 'freqDuration';
          soundCmnd.seconds = this.read('word') / 2000;
          soundCmnd.frequency = this.read('long');
          break;
        
        case 41:
          soundCmnd.type = 'rest';
          soundCmnd.seconds = this.read('word') / 2000;
          this.read('long');
          break;
        
        case 42:
          soundCmnd.type = 'freq';
          this.read('word');
          soundCmnd.frequency = this.read('long');
          break;
        
        case 43:
          soundCmnd.type = 'amp';
          soundCmnd.amplitude = this.read('word');
          this.read('long');
          break;
        
        case 44:
          soundCmnd.type = 'timbre';
          soundCmnd.wave = this.read('word');
          this.read('long');
          break;
        
        case 60:
          soundCmnd.type = 'waveTable';
          soundCmnd.length = this.read('word');
          soundCmnd.pTable = this.read('long');
          break;
        
        case 61:
          soundCmnd.type = 'phase';
          soundCmnd.shift = this.read('word');
          soundCmnd.pChan = this.read('long');
          break;
        
        case 80:
          soundCmnd.type = 'sound';
          this.read('word');
          soundCmnd.pSound = this.read('long');
          break;
        
        case 81:
          soundCmnd.type = 'buffer';
          this.read('word');
          soundCmnd.pBuffer = this.read('long');
          break;
        
        case 82:
          soundCmnd.type = 'rate';
          this.read('word');
          soundCmnd.rate = this.read('long');
          break;
          
        default:
          soundCmnd.type = 'unknown';
          soundCmnd.param1 = this.read('word');
          soundCmnd.param2 = this.read('long');
      }
    }
    this.DataTables = {
      pTable: this.read('long'),
      nSamples: this.read('long'),
      rate: this.read('long'),
      start: this.read('long'),
      end: this.read('long'),
      encodeHeader: this.read('byte'),
      baseFrequency: this.read('byte')
    };
//		array DataTables {
//	DataTable:
//			fill long;											/* Pointer to data		*/
//	SampleCnt:
//			unsigned longint;									/* # of sound samples	*/
//			unsigned hex longint
//					Rate22K = $56EE8BA3;						/* Sampling rate		*/
//			unsigned longint;									/* Start of loop		*/
//			unsigned longint;									/* End of loop			*/
//			hex byte;											/* encode (header type)	*/
//			hex byte;											/* baseFrequency		*/
//			hex string [$$Long(SampleCnt[$$ArrayIndex(DataTables)])];
//		};
//};
    
  }
}
