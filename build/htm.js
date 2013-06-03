var HTM = (function() {// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
try {
  this['Module'] = Module;
} catch(e) {
  this['Module'] = Module = {};
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  if (!Module['arguments']) {
    Module['arguments'] = process['argv'].slice(2);
  }
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  Module['read'] = read;
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (!Module['arguments']) {
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  if (!Module['print']) {
    Module['print'] = function(x) {
      console.log(x);
    };
  }
  if (!Module['printErr']) {
    Module['printErr'] = function(x) {
      console.log(x);
    };
  }
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (!Module['arguments']) {
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  if (!Module['print']) {
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
if (!Module['preRun']) Module['preRun'] = [];
if (!Module['postRun']) Module['postRun'] = [];
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (/^\[\d+\ x\ (.*)\]/.test(type)) return true; // [15 x ?] blocks. Like structs
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function abort(text) {
  Module.print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = globalScope['Module']['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,Math.min(Math.floor((value)/(+(4294967296))), (+(4294967295)))>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    HEAPU8.set(new Uint8Array(slab), ret);
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 33554432;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
var runtimeInitialized = false;
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math.imul) Math.imul = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 6000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function addPreRun(func) {
  if (!Module['preRun']) Module['preRun'] = [];
  else if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
  Module['preRun'].push(func);
}
var awaitingMemoryInitializer = false;
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
    runPostSets();
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
  awaitingMemoryInitializer = false;
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 856;
/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,99,111,110,80,101,114,109,44,112,101,114,109,73,110,99,32,61,32,37,105,32,37,105,10,0,0,0,0,0,0,0,10,109,105,110,79,118,101,114,108,97,112,32,61,32,37,103,0,0,0,0,0,0,0,0,10,115,121,110,97,112,115,101,115,80,101,114,80,114,111,120,105,109,97,108,83,101,103,109,101,110,116,32,61,32,37,100,0,0,0,0,0,0,0,0,10,100,101,115,105,114,101,100,76,111,99,97,108,65,99,116,105,118,105,116,121,32,61,32,37,100,0,0,0,0,0,0,10,105,110,105,116,105,97,108,32,105,110,104,105,98,105,116,105,111,110,82,97,100,105,117,115,32,61,32,37,102,0,0,10,105,110,112,117,116,82,97,100,105,117,115,32,61,32,37,100,0,0,0,0,0,0,0,10,120,83,112,97,99,101,44,32,121,83,112,97,99,101,32,61,32,37,102,32,37,102,0,40,112,41,109,105,115,109,97,116,99,104,32,110,97,115,32,118,115,32,115,58,32,40,37,105,32,37,105,41,0,0,0,109,105,115,109,97,116,99,104,32,110,97,115,32,118,115,32,115,58,32,40,37,105,32,37,105,41,0,0,0,0,0,0,10,99,111,108,117,109,110,71,114,105,100,32,61,32,40,37,100,44,32,37,100,41,0,0,10,82,101,103,105,111,110,32,67,114,101,97,116,101,100,32,40,65,78,83,73,32,67,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,215,163,59,0,0,0,0,1,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
function runPostSets() {
}
if (!awaitingMemoryInitializer) runPostSets();
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  var _sqrt=Math.sqrt;
  function _fmax(x, y) {
      return isNaN(x) ? y : isNaN(y) ? x : Math.max(x, y);
    }var _fmaxf=_fmax;
  function _round(x) {
      return (x < 0) ? -Math.round(-x) : Math.round(x);
    }var _roundf=_round;
  var ERRNO_CODES={E2BIG:7,EACCES:13,EADDRINUSE:98,EADDRNOTAVAIL:99,EAFNOSUPPORT:97,EAGAIN:11,EALREADY:114,EBADF:9,EBADMSG:74,EBUSY:16,ECANCELED:125,ECHILD:10,ECONNABORTED:103,ECONNREFUSED:111,ECONNRESET:104,EDEADLK:35,EDESTADDRREQ:89,EDOM:33,EDQUOT:122,EEXIST:17,EFAULT:14,EFBIG:27,EHOSTUNREACH:113,EIDRM:43,EILSEQ:84,EINPROGRESS:115,EINTR:4,EINVAL:22,EIO:5,EISCONN:106,EISDIR:21,ELOOP:40,EMFILE:24,EMLINK:31,EMSGSIZE:90,EMULTIHOP:72,ENAMETOOLONG:36,ENETDOWN:100,ENETRESET:102,ENETUNREACH:101,ENFILE:23,ENOBUFS:105,ENODATA:61,ENODEV:19,ENOENT:2,ENOEXEC:8,ENOLCK:37,ENOLINK:67,ENOMEM:12,ENOMSG:42,ENOPROTOOPT:92,ENOSPC:28,ENOSR:63,ENOSTR:60,ENOSYS:38,ENOTCONN:107,ENOTDIR:20,ENOTEMPTY:39,ENOTRECOVERABLE:131,ENOTSOCK:88,ENOTSUP:95,ENOTTY:25,ENXIO:6,EOPNOTSUPP:45,EOVERFLOW:75,EOWNERDEAD:130,EPERM:1,EPIPE:32,EPROTO:71,EPROTONOSUPPORT:93,EPROTOTYPE:91,ERANGE:34,EROFS:30,ESPIPE:29,ESRCH:3,ESTALE:116,ETIME:62,ETIMEDOUT:110,ETXTBSY:26,EWOULDBLOCK:11,EXDEV:18};
  function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      if (!___setErrNo.ret) ___setErrNo.ret = allocate([0], 'i32', ALLOC_NORMAL);
      HEAP32[((___setErrNo.ret)>>2)]=value
      return value;
    }
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  var __impure_ptr=allocate(1, "i32*", ALLOC_STATIC);var FS={currentPath:"/",nextInode:2,streams:[null],ignorePermissions:true,joinPath:function (parts, forceRelative) {
        var ret = parts[0];
        for (var i = 1; i < parts.length; i++) {
          if (ret[ret.length-1] != '/') ret += '/';
          ret += parts[i];
        }
        if (forceRelative && ret[0] == '/') ret = ret.substr(1);
        return ret;
      },absolutePath:function (relative, base) {
        if (typeof relative !== 'string') return null;
        if (base === undefined) base = FS.currentPath;
        if (relative && relative[0] == '/') base = '';
        var full = base + '/' + relative;
        var parts = full.split('/').reverse();
        var absolute = [''];
        while (parts.length) {
          var part = parts.pop();
          if (part == '' || part == '.') {
            // Nothing.
          } else if (part == '..') {
            if (absolute.length > 1) absolute.pop();
          } else {
            absolute.push(part);
          }
        }
        return absolute.length == 1 ? '/' : absolute.join('/');
      },analyzePath:function (path, dontResolveLastLink, linksVisited) {
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        path = FS.absolutePath(path);
        if (path == '/') {
          ret.isRoot = true;
          ret.exists = ret.parentExists = true;
          ret.name = '/';
          ret.path = ret.parentPath = '/';
          ret.object = ret.parentObject = FS.root;
        } else if (path !== null) {
          linksVisited = linksVisited || 0;
          path = path.slice(1).split('/');
          var current = FS.root;
          var traversed = [''];
          while (path.length) {
            if (path.length == 1 && current.isFolder) {
              ret.parentExists = true;
              ret.parentPath = traversed.length == 1 ? '/' : traversed.join('/');
              ret.parentObject = current;
              ret.name = path[0];
            }
            var target = path.shift();
            if (!current.isFolder) {
              ret.error = ERRNO_CODES.ENOTDIR;
              break;
            } else if (!current.read) {
              ret.error = ERRNO_CODES.EACCES;
              break;
            } else if (!current.contents.hasOwnProperty(target)) {
              ret.error = ERRNO_CODES.ENOENT;
              break;
            }
            current = current.contents[target];
            if (current.link && !(dontResolveLastLink && path.length == 0)) {
              if (linksVisited > 40) { // Usual Linux SYMLOOP_MAX.
                ret.error = ERRNO_CODES.ELOOP;
                break;
              }
              var link = FS.absolutePath(current.link, traversed.join('/'));
              ret = FS.analyzePath([link].concat(path).join('/'),
                                   dontResolveLastLink, linksVisited + 1);
              return ret;
            }
            traversed.push(target);
            if (path.length == 0) {
              ret.exists = true;
              ret.path = traversed.join('/');
              ret.object = current;
            }
          }
        }
        return ret;
      },findObject:function (path, dontResolveLastLink) {
        FS.ensureRoot();
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },createObject:function (parent, name, properties, canRead, canWrite) {
        if (!parent) parent = '/';
        if (typeof parent === 'string') parent = FS.findObject(parent);
        if (!parent) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent path must exist.');
        }
        if (!parent.isFolder) {
          ___setErrNo(ERRNO_CODES.ENOTDIR);
          throw new Error('Parent must be a folder.');
        }
        if (!parent.write && !FS.ignorePermissions) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent folder must be writeable.');
        }
        if (!name || name == '.' || name == '..') {
          ___setErrNo(ERRNO_CODES.ENOENT);
          throw new Error('Name must not be empty.');
        }
        if (parent.contents.hasOwnProperty(name)) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          throw new Error("Can't overwrite object.");
        }
        parent.contents[name] = {
          read: canRead === undefined ? true : canRead,
          write: canWrite === undefined ? false : canWrite,
          timestamp: Date.now(),
          inodeNumber: FS.nextInode++
        };
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            parent.contents[name][key] = properties[key];
          }
        }
        return parent.contents[name];
      },createFolder:function (parent, name, canRead, canWrite) {
        var properties = {isFolder: true, isDevice: false, contents: {}};
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createPath:function (parent, path, canRead, canWrite) {
        var current = FS.findObject(parent);
        if (current === null) throw new Error('Invalid parent.');
        path = path.split('/').reverse();
        while (path.length) {
          var part = path.pop();
          if (!part) continue;
          if (!current.contents.hasOwnProperty(part)) {
            FS.createFolder(current, part, canRead, canWrite);
          }
          current = current.contents[part];
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        properties.isFolder = false;
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        if (typeof data === 'string') {
          var dataArray = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i) dataArray[i] = data.charCodeAt(i);
          data = dataArray;
        }
        var properties = {
          isDevice: false,
          contents: data.subarray ? data.subarray(0) : data // as an optimization, create a new array wrapper (not buffer) here, to help JS engines understand this object
        };
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile) {
        Browser.init();
        var fullname = FS.joinPath([parent, name], true);
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },createLink:function (parent, name, target, canRead, canWrite) {
        var properties = {isDevice: false, link: target};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createDevice:function (parent, name, input, output) {
        if (!(input || output)) {
          throw new Error('A device must have at least one callback defined.');
        }
        var ops = {isDevice: true, input: input, output: output};
        return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },ensureRoot:function () {
        if (FS.root) return;
        // The main file system tree. All the contents are inside this.
        FS.root = {
          read: true,
          write: true,
          isFolder: true,
          isDevice: false,
          timestamp: Date.now(),
          inodeNumber: 1,
          contents: {}
        };
      },init:function (input, output, error) {
        // Make sure we initialize only once.
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureRoot();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input = input || Module['stdin'];
        output = output || Module['stdout'];
        error = error || Module['stderr'];
        // Default handlers.
        var stdinOverridden = true, stdoutOverridden = true, stderrOverridden = true;
        if (!input) {
          stdinOverridden = false;
          input = function() {
            if (!input.cache || !input.cache.length) {
              var result;
              if (typeof window != 'undefined' &&
                  typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');
                if (result === null) result = String.fromCharCode(0); // cancel ==> EOF
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
              }
              if (!result) result = '';
              input.cache = intArrayFromString(result + '\n', true);
            }
            return input.cache.shift();
          };
        }
        var utf8 = new Runtime.UTF8Processor();
        function simpleOutput(val) {
          if (val === null || val === 10) {
            output.printer(output.buffer.join(''));
            output.buffer = [];
          } else {
            output.buffer.push(utf8.processCChar(val));
          }
        }
        if (!output) {
          stdoutOverridden = false;
          output = simpleOutput;
        }
        if (!output.printer) output.printer = Module['print'];
        if (!output.buffer) output.buffer = [];
        if (!error) {
          stderrOverridden = false;
          error = simpleOutput;
        }
        if (!error.printer) error.printer = Module['print'];
        if (!error.buffer) error.buffer = [];
        // Create the temporary folder, if not already created
        try {
          FS.createFolder('/', 'tmp', true, true);
        } catch(e) {}
        // Create the I/O devices.
        var devFolder = FS.createFolder('/', 'dev', true, true);
        var stdin = FS.createDevice(devFolder, 'stdin', input);
        var stdout = FS.createDevice(devFolder, 'stdout', null, output);
        var stderr = FS.createDevice(devFolder, 'stderr', null, error);
        FS.createDevice(devFolder, 'tty', input, output);
        // Create default streams.
        FS.streams[1] = {
          path: '/dev/stdin',
          object: stdin,
          position: 0,
          isRead: true,
          isWrite: false,
          isAppend: false,
          isTerminal: !stdinOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[2] = {
          path: '/dev/stdout',
          object: stdout,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stdoutOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[3] = {
          path: '/dev/stderr',
          object: stderr,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stderrOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        // TODO: put these low in memory like we used to assert on: assert(Math.max(_stdin, _stdout, _stderr) < 15000); // make sure these are low, we flatten arrays with these
        HEAP32[((_stdin)>>2)]=1;
        HEAP32[((_stdout)>>2)]=2;
        HEAP32[((_stderr)>>2)]=3;
        // Other system paths
        FS.createPath('/', 'dev/shm/tmp', true, true); // temp files
        // Newlib initialization
        for (var i = FS.streams.length; i < Math.max(_stdin, _stdout, _stderr) + 4; i++) {
          FS.streams[i] = null; // Make sure to keep FS.streams dense
        }
        FS.streams[_stdin] = FS.streams[1];
        FS.streams[_stdout] = FS.streams[2];
        FS.streams[_stderr] = FS.streams[3];
        allocate([ allocate(
          [0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0],
          'void*', ALLOC_DYNAMIC) ], 'void*', ALLOC_NONE, __impure_ptr);
      },quit:function () {
        if (!FS.init.initialized) return;
        // Flush any partially-printed lines in stdout and stderr. Careful, they may have been closed
        if (FS.streams[2] && FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output(10);
        if (FS.streams[3] && FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output(10);
      },standardizePath:function (path) {
        if (path.substr(0, 2) == './') path = path.substr(2);
        return path;
      },deleteFile:function (path) {
        path = FS.analyzePath(path);
        if (!path.parentExists || !path.exists) {
          throw 'Invalid path ' + path;
        }
        delete path.parentObject.contents[path.name];
      }};
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var contents = stream.object.contents;
        while (contents.length < offset) contents.push(0);
        for (var i = 0; i < nbyte; i++) {
          contents[offset + i] = HEAPU8[(((buf)+(i))|0)];
        }
        stream.object.timestamp = Date.now();
        return i;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        if (stream.object.isDevice) {
          if (stream.object.output) {
            for (var i = 0; i < nbyte; i++) {
              try {
                stream.object.output(HEAP8[(((buf)+(i))|0)]);
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
            }
            stream.object.timestamp = Date.now();
            return i;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
          if (bytesWritten != -1) stream.position += bytesWritten;
          return bytesWritten;
        }
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }
  function _rand() {
      return Math.floor(Math.random()*0x80000000);
    }
  function _abort() {
      ABORT = true;
      throw 'abort() at ' + (new Error().stack);
    }
  function ___errno_location() {
      if (!___setErrNo.ret) {
        ___setErrNo.ret = allocate([0], 'i32', ALLOC_NORMAL);
        HEAP32[((___setErrNo.ret)>>2)]=0
      }
      return ___setErrNo.ret;
    }var ___errno=___errno_location;
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (Browser.initted) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        function getMimetype(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(name.lastIndexOf('.')+1)];
        }
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/.exec(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            setTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'];
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        this.lockPointer = lockPointer;
        this.resizeCanvas = resizeCanvas;
        if (typeof this.lockPointer === 'undefined') this.lockPointer = true;
        if (typeof this.resizeCanvas === 'undefined') this.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!this.fullScreenHandlersInstalled) {
          this.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen(); 
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x = event.pageX - (window.scrollX + rect.left);
          var y = event.pageY - (window.scrollY + rect.top);
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        Browser.updateResizeListeners();
      }};
__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var Math_min = Math.min;
function invoke_ii(index,a1) {
  try {
    return Module.dynCall_ii(index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm.setThrew(1, 0);
  }
}
function invoke_v(index) {
  try {
    Module.dynCall_v(index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm.setThrew(1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module.dynCall_iii(index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm.setThrew(1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module.dynCall_vi(index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm.setThrew(1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var NaN=+env.NaN;
  var Infinity=+env.Infinity;
  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;
  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var asmPrintInt=env.asmPrintInt;
  var asmPrintFloat=env.asmPrintFloat;
  var copyTempDouble=env.copyTempDouble;
  var copyTempFloat=env.copyTempFloat;
  var Math_min=env.min;
  var invoke_ii=env.invoke_ii;
  var invoke_v=env.invoke_v;
  var invoke_iii=env.invoke_iii;
  var invoke_vi=env.invoke_vi;
  var _rand=env._rand;
  var _pwrite=env._pwrite;
  var _sbrk=env._sbrk;
  var _sysconf=env._sysconf;
  var _fmax=env._fmax;
  var _fwrite=env._fwrite;
  var __reallyNegative=env.__reallyNegative;
  var _time=env._time;
  var __formatString=env.__formatString;
  var _sqrt=env._sqrt;
  var _write=env._write;
  var ___setErrNo=env.___setErrNo;
  var _abort=env._abort;
  var _fprintf=env._fprintf;
  var _printf=env._printf;
  var ___errno_location=env.___errno_location;
  var _round=env._round;
// EMSCRIPTEN_START_FUNCS
function stackAlloc(size) {
  size = size | 0;
  var ret = 0;
  ret = STACKTOP;
  STACKTOP = STACKTOP + size | 0;
  STACKTOP = STACKTOP + 7 >> 3 << 3;
  return ret | 0;
}
function stackSave() {
  return STACKTOP | 0;
}
function stackRestore(top) {
  top = top | 0;
  STACKTOP = top;
}
function setThrew(threw, value) {
  threw = threw | 0;
  value = value | 0;
  if ((__THREW__ | 0) == 0) {
    __THREW__ = threw;
    threwValue = value;
  }
}
function setTempRet0(value) {
  value = value | 0;
  tempRet0 = value;
}
function setTempRet1(value) {
  value = value | 0;
  tempRet1 = value;
}
function setTempRet2(value) {
  value = value | 0;
  tempRet2 = value;
}
function setTempRet3(value) {
  value = value | 0;
  tempRet3 = value;
}
function setTempRet4(value) {
  value = value | 0;
  tempRet4 = value;
}
function setTempRet5(value) {
  value = value | 0;
  tempRet5 = value;
}
function setTempRet6(value) {
  value = value | 0;
  tempRet6 = value;
}
function setTempRet7(value) {
  value = value | 0;
  tempRet7 = value;
}
function setTempRet8(value) {
  value = value | 0;
  tempRet8 = value;
}
function setTempRet9(value) {
  value = value | 0;
  tempRet9 = value;
}
function _jsIsSynapseConnected($syn) {
  $syn = $syn | 0;
  return (HEAP32[$syn + 4 >> 2] | 0) > 1999 | 0;
}
function _jsUpdateSynapseConnected($syn) {
  $syn = $syn | 0;
  HEAP8[$syn + 8 | 0] = (HEAP32[$syn + 4 >> 2] | 0) > 1999 & 1;
  return;
}
function _jsGetSegNumActiveConnectedSyns($seg) {
  $seg = $seg | 0;
  return HEAP32[$seg + 28 >> 2] | 0;
}
function _jsGetSegNumActiveAllSyns($seg) {
  $seg = $seg | 0;
  return HEAP32[$seg + 36 >> 2] | 0;
}
function _jsGetSegNumSyns($seg) {
  $seg = $seg | 0;
  return HEAP32[$seg + 4 >> 2] | 0;
}
function _jsGetSegIsActive($seg) {
  $seg = $seg | 0;
  return (HEAP8[$seg + 24 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsGetSegNumPrevActiveConnectedSyns($seg) {
  $seg = $seg | 0;
  return HEAP32[$seg + 32 >> 2] | 0;
}
function _jsGetSegWasActive($seg) {
  $seg = $seg | 0;
  return (HEAP8[$seg + 25 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsSetCellWasActive($cell, $wasActive) {
  $cell = $cell | 0;
  $wasActive = $wasActive | 0;
  HEAP8[$cell + 21 | 0] = $wasActive & 1;
  return;
}
function _jsSetCellWasLearning($cell, $wasLearning) {
  $cell = $cell | 0;
  $wasLearning = $wasLearning | 0;
  HEAP8[$cell + 25 | 0] = $wasLearning & 1;
  return;
}
function _jsGetCellWasActive($cell) {
  $cell = $cell | 0;
  return (HEAP8[$cell + 21 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsGetCellWasLearning($cell) {
  $cell = $cell | 0;
  return (HEAP8[$cell + 25 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsGetCellIsActive($cell) {
  $cell = $cell | 0;
  return (HEAP8[$cell + 20 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsGetCellIsLearning($cell) {
  $cell = $cell | 0;
  return (HEAP8[$cell + 24 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsGetColumnFromRegion($region, $columnNr) {
  $region = $region | 0;
  $columnNr = $columnNr | 0;
  return (HEAP32[$region + 56 >> 2] | 0) + ($columnNr * 52 & -1) | 0;
}
function _jsGetCellFromColumn($column, $cellNr) {
  $column = $column | 0;
  $cellNr = $cellNr | 0;
  return (HEAP32[$column + 4 >> 2] | 0) + ($cellNr * 52 & -1) | 0;
}
function _jsGetSegmentFromCell($cell, $segNr) {
  $cell = $cell | 0;
  $segNr = $segNr | 0;
  return (HEAP32[$cell + 28 >> 2] | 0) + ($segNr * 44 & -1) | 0;
}
function _jsGetSynapseFromSegment($seg, $synNr) {
  $seg = $seg | 0;
  $synNr = $synNr | 0;
  return (HEAP32[$seg >> 2] | 0) + ($synNr * 12 & -1) | 0;
}
function _jsGetColumnIsActive($column) {
  $column = $column | 0;
  return (HEAP8[$column + 12 | 0] & 1) << 24 >> 24 != 0 | 0;
}
function _jsGetCellNumSegments($cell) {
  $cell = $cell | 0;
  return HEAP32[$cell + 32 >> 2] | 0;
}
function _jsGetSynapseInputSource($syn) {
  $syn = $syn | 0;
  return HEAP32[$syn >> 2] | 0;
}
function _jsGetFloatItemFromArray($arr, $itemNr) {
  $arr = $arr | 0;
  $itemNr = $itemNr | 0;
  return +(+HEAPF32[$arr + ($itemNr << 2) >> 2]);
}
function _jsSetRegionTemporalLearning($region, $value) {
  $region = $region | 0;
  $value = $value | 0;
  HEAP8[$region + 38 | 0] = $value & 1;
  return;
}
function _jsGetRegionNumColumns($region) {
  $region = $region | 0;
  return HEAP32[$region + 60 >> 2] | 0;
}
function _jsSetDataArr($ptr, $item, $value) {
  $ptr = $ptr | 0;
  $item = $item | 0;
  $value = $value | 0;
  HEAP8[$ptr + $item | 0] = $value & 255;
  return;
}
function _jsGetRegionInhibitionRadius($region) {
  $region = $region | 0;
  return +(+HEAPF32[$region + 68 >> 2]);
}
function _setCellPredicting($cell, $predicting) {
  $cell = $cell | 0;
  $predicting = $predicting | 0;
  var $isPredicting = 0, $frombool1 = 0, $predictionSteps = 0, $numSegments = 0, $0 = 0, $cmp11 = 0, $segments = 0, $i_012 = 0, $1 = 0, $isActive = 0, $2 = 0, $3 = 0, $tobool4 = 0, $predictionSteps5 = 0, $4 = 0, $5 = 0, $cmp7 = 0, $inc = 0, $6 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $isPredicting = $cell + 22 | 0;
    $frombool1 = $predicting & 1;
    HEAP8[$isPredicting] = $frombool1;
    if ($predicting) {
      label = 3;
      break;
    } else {
      label = 9;
      break;
    }
   case 3:
    $predictionSteps = $cell + 16 | 0;
    HEAP32[$predictionSteps >> 2] = 10;
    $numSegments = $cell + 32 | 0;
    $0 = HEAP32[$numSegments >> 2] | 0;
    $cmp11 = ($0 | 0) > 0;
    if ($cmp11) {
      label = 4;
      break;
    } else {
      label = 9;
      break;
    }
   case 4:
    $segments = $cell + 28 | 0;
    $i_012 = 0;
    label = 5;
    break;
   case 5:
    $1 = HEAP32[$segments >> 2] | 0;
    $isActive = $1 + ($i_012 * 44 & -1) + 24 | 0;
    $2 = HEAP8[$isActive] | 0;
    $3 = $2 & 1;
    $tobool4 = $3 << 24 >> 24 == 0;
    if ($tobool4) {
      label = 8;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $predictionSteps5 = $1 + ($i_012 * 44 & -1) + 16 | 0;
    $4 = HEAP32[$predictionSteps5 >> 2] | 0;
    $5 = HEAP32[$predictionSteps >> 2] | 0;
    $cmp7 = ($4 | 0) < ($5 | 0);
    if ($cmp7) {
      label = 7;
      break;
    } else {
      label = 8;
      break;
    }
   case 7:
    HEAP32[$predictionSteps >> 2] = $4;
    label = 8;
    break;
   case 8:
    $inc = $i_012 + 1 | 0;
    $6 = HEAP32[$numSegments >> 2] | 0;
    $cmp = ($inc | 0) < ($6 | 0);
    if ($cmp) {
      $i_012 = $inc;
      label = 5;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    return;
  }
}
function _numCellSegments($cell, $predictionSteps) {
  $cell = $cell | 0;
  $predictionSteps = $predictionSteps | 0;
  var $numSegments = 0, $0 = 0, $cmp6 = 0, $segments = 0, $1 = 0, $cmp3 = 0, $2 = 0, $c_08 = 0, $i_07 = 0, $predictionSteps1 = 0, $3 = 0, $cmp2 = 0, $or_cond = 0, $inc = 0, $inc_c_0 = 0, $inc4 = 0, $cmp = 0, $c_0_lcssa = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegments = $cell + 32 | 0;
    $0 = HEAP32[$numSegments >> 2] | 0;
    $cmp6 = ($0 | 0) > 0;
    if ($cmp6) {
      label = 3;
      break;
    } else {
      $c_0_lcssa = 0;
      label = 5;
      break;
    }
   case 3:
    $segments = $cell + 28 | 0;
    $1 = HEAP32[$segments >> 2] | 0;
    $cmp3 = ($predictionSteps | 0) == 0;
    $2 = HEAP32[$numSegments >> 2] | 0;
    $i_07 = 0;
    $c_08 = 0;
    label = 4;
    break;
   case 4:
    $predictionSteps1 = $1 + ($i_07 * 44 & -1) + 16 | 0;
    $3 = HEAP32[$predictionSteps1 >> 2] | 0;
    $cmp2 = ($3 | 0) == ($predictionSteps | 0);
    $or_cond = $cmp2 | $cmp3;
    $inc = $or_cond & 1;
    $inc_c_0 = $inc + $c_08 | 0;
    $inc4 = $i_07 + 1 | 0;
    $cmp = ($inc4 | 0) < ($2 | 0);
    if ($cmp) {
      $i_07 = $inc4;
      $c_08 = $inc_c_0;
      label = 4;
      break;
    } else {
      $c_0_lcssa = $inc_c_0;
      label = 5;
      break;
    }
   case 5:
    return $c_0_lcssa | 0;
  }
  return 0;
}
function _getPreviousActiveSegment($cell) {
  $cell = $cell | 0;
  var $numSegments = 0, $0 = 0, $cmp19 = 0, $segments = 0, $1 = 0, $2 = 0, $foundSequence_0_off023 = 0, $mostSyns_022 = 0, $bestSegment_021 = 0, $i_020 = 0, $arrayidx = 0, $numPrevActiveConnectedSyns = 0, $3 = 0, $segActiveThreshold = 0, $4 = 0, $cmp1 = 0, $isSequence = 0, $5 = 0, $6 = 0, $tobool = 0, $cmp3 = 0, $arrayidx_bestSegment_0 = 0, $_mostSyns_0 = 0, $foundSequence_0_off0_not = 0, $cmp7 = 0, $or_cond = 0, $arrayidx_bestSegment_017 = 0, $_mostSyns_018 = 0, $bestSegment_1 = 0, $mostSyns_1 = 0, $foundSequence_1_off0 = 0, $inc = 0, $cmp = 0, $bestSegment_0_lcssa = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegments = $cell + 32 | 0;
    $0 = HEAP32[$numSegments >> 2] | 0;
    $cmp19 = ($0 | 0) > 0;
    if ($cmp19) {
      label = 3;
      break;
    } else {
      $bestSegment_0_lcssa = 0;
      label = 9;
      break;
    }
   case 3:
    $segments = $cell + 28 | 0;
    $1 = HEAP32[$segments >> 2] | 0;
    $2 = HEAP32[$numSegments >> 2] | 0;
    $i_020 = 0;
    $bestSegment_021 = 0;
    $mostSyns_022 = 0;
    $foundSequence_0_off023 = 0;
    label = 4;
    break;
   case 4:
    $arrayidx = $1 + ($i_020 * 44 & -1) | 0;
    $numPrevActiveConnectedSyns = $1 + ($i_020 * 44 & -1) + 32 | 0;
    $3 = HEAP32[$numPrevActiveConnectedSyns >> 2] | 0;
    $segActiveThreshold = $1 + ($i_020 * 44 & -1) + 20 | 0;
    $4 = HEAP32[$segActiveThreshold >> 2] | 0;
    $cmp1 = ($3 | 0) > ($4 | 0);
    if ($cmp1) {
      label = 5;
      break;
    } else {
      $foundSequence_1_off0 = $foundSequence_0_off023;
      $mostSyns_1 = $mostSyns_022;
      $bestSegment_1 = $bestSegment_021;
      label = 8;
      break;
    }
   case 5:
    $isSequence = $1 + ($i_020 * 44 & -1) + 12 | 0;
    $5 = HEAP8[$isSequence] | 0;
    $6 = $5 & 1;
    $tobool = $6 << 24 >> 24 == 0;
    if ($tobool) {
      label = 7;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $cmp3 = ($3 | 0) > ($mostSyns_022 | 0);
    $arrayidx_bestSegment_0 = $cmp3 ? $arrayidx : $bestSegment_021;
    $_mostSyns_0 = $cmp3 ? $3 : $mostSyns_022;
    $foundSequence_1_off0 = 1;
    $mostSyns_1 = $_mostSyns_0;
    $bestSegment_1 = $arrayidx_bestSegment_0;
    label = 8;
    break;
   case 7:
    $foundSequence_0_off0_not = $foundSequence_0_off023 ^ 1;
    $cmp7 = ($3 | 0) > ($mostSyns_022 | 0);
    $or_cond = $cmp7 & $foundSequence_0_off0_not;
    $arrayidx_bestSegment_017 = $or_cond ? $arrayidx : $bestSegment_021;
    $_mostSyns_018 = $or_cond ? $3 : $mostSyns_022;
    $foundSequence_1_off0 = $foundSequence_0_off023;
    $mostSyns_1 = $_mostSyns_018;
    $bestSegment_1 = $arrayidx_bestSegment_017;
    label = 8;
    break;
   case 8:
    $inc = $i_020 + 1 | 0;
    $cmp = ($inc | 0) < ($2 | 0);
    if ($cmp) {
      $i_020 = $inc;
      $bestSegment_021 = $bestSegment_1;
      $mostSyns_022 = $mostSyns_1;
      $foundSequence_0_off023 = $foundSequence_1_off0;
      label = 4;
      break;
    } else {
      $bestSegment_0_lcssa = $bestSegment_1;
      label = 9;
      break;
    }
   case 9:
    return $bestSegment_0_lcssa | 0;
  }
  return 0;
}
function _getBestMatchingSegment($cell, $numPredictionSteps, $previous, $segmentID) {
  $cell = $cell | 0;
  $numPredictionSteps = $numPredictionSteps | 0;
  $previous = $previous | 0;
  $segmentID = $segmentID | 0;
  var $numSegments = 0, $0 = 0, $cmp8 = 0, $1 = 0, $segments = 0, $bestSegment_011 = 0, $i_010 = 0, $bestSynapseCount_09 = 0, $2 = 0, $arrayidx = 0, $predictionSteps = 0, $3 = 0, $cmp1 = 0, $numPrevActiveAllSyns = 0, $numActiveAllSyns = 0, $synCount_0_in = 0, $synCount_0 = 0, $cmp3 = 0, $bestSynapseCount_1 = 0, $bestSegment_1 = 0, $inc = 0, $4 = 0, $cmp = 0, $bestSegment_0_lcssa = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegments = $cell + 32 | 0;
    $0 = HEAP32[$numSegments >> 2] | 0;
    $cmp8 = ($0 | 0) > 0;
    if ($cmp8) {
      label = 3;
      break;
    } else {
      $bestSegment_0_lcssa = 0;
      label = 11;
      break;
    }
   case 3:
    $1 = HEAP32[208] | 0;
    $segments = $cell + 28 | 0;
    $bestSynapseCount_09 = $1;
    $i_010 = 0;
    $bestSegment_011 = 0;
    label = 4;
    break;
   case 4:
    $2 = HEAP32[$segments >> 2] | 0;
    $arrayidx = $2 + ($i_010 * 44 & -1) | 0;
    $predictionSteps = $2 + ($i_010 * 44 & -1) + 16 | 0;
    $3 = HEAP32[$predictionSteps >> 2] | 0;
    $cmp1 = ($3 | 0) == ($numPredictionSteps | 0);
    if ($cmp1) {
      label = 5;
      break;
    } else {
      $bestSegment_1 = $bestSegment_011;
      $bestSynapseCount_1 = $bestSynapseCount_09;
      label = 10;
      break;
    }
   case 5:
    if ($previous) {
      label = 6;
      break;
    } else {
      label = 7;
      break;
    }
   case 6:
    $numPrevActiveAllSyns = $2 + ($i_010 * 44 & -1) + 40 | 0;
    $synCount_0_in = $numPrevActiveAllSyns;
    label = 8;
    break;
   case 7:
    $numActiveAllSyns = $2 + ($i_010 * 44 & -1) + 36 | 0;
    $synCount_0_in = $numActiveAllSyns;
    label = 8;
    break;
   case 8:
    $synCount_0 = HEAP32[$synCount_0_in >> 2] | 0;
    $cmp3 = ($synCount_0 | 0) > ($bestSynapseCount_09 | 0);
    if ($cmp3) {
      label = 9;
      break;
    } else {
      $bestSegment_1 = $bestSegment_011;
      $bestSynapseCount_1 = $bestSynapseCount_09;
      label = 10;
      break;
    }
   case 9:
    HEAP32[$segmentID >> 2] = $i_010;
    $bestSegment_1 = $arrayidx;
    $bestSynapseCount_1 = $synCount_0;
    label = 10;
    break;
   case 10:
    $inc = $i_010 + 1 | 0;
    $4 = HEAP32[$numSegments >> 2] | 0;
    $cmp = ($inc | 0) < ($4 | 0);
    if ($cmp) {
      $bestSynapseCount_09 = $bestSynapseCount_1;
      $i_010 = $inc;
      $bestSegment_011 = $bestSegment_1;
      label = 4;
      break;
    } else {
      $bestSegment_0_lcssa = $bestSegment_1;
      label = 11;
      break;
    }
   case 11:
    return $bestSegment_0_lcssa | 0;
  }
  return 0;
}
function _updateActiveDutyCycle($col) {
  $col = $col | 0;
  var $0 = 0.0, $conv = 0.0, $sub = 0.0, $activeDutyCycle = 0, $1 = 0.0, $conv1 = 0.0, $mul = 0.0, $conv2 = 0.0, $isActive = 0, $2 = 0, $3 = 0, $tobool = 0, $add = 0.0, $newCycle_0 = 0.0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = +HEAPF32[212];
    $conv = $0;
    $sub = 1.0 - $conv;
    $activeDutyCycle = $col + 24 | 0;
    $1 = +HEAPF32[$activeDutyCycle >> 2];
    $conv1 = $1;
    $mul = $sub * $conv1;
    $conv2 = $mul;
    $isActive = $col + 12 | 0;
    $2 = HEAP8[$isActive] | 0;
    $3 = $2 & 1;
    $tobool = $3 << 24 >> 24 == 0;
    if ($tobool) {
      $newCycle_0 = $conv2;
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $add = $0 + $conv2;
    $newCycle_0 = $add;
    label = 4;
    break;
   case 4:
    HEAPF32[$activeDutyCycle >> 2] = $newCycle_0;
    return;
  }
}
function _jsGetNewCell($isActive, $wasActive, $isLearning, $wasLearning) {
  $isActive = $isActive | 0;
  $wasActive = $wasActive | 0;
  $isLearning = $isLearning | 0;
  $wasLearning = $wasLearning | 0;
  var $call = 0;
  $call = _malloc(52) | 0;
  HEAP8[$call + 20 | 0] = ($isActive | 0) != 0 & 1;
  HEAP8[$call + 21 | 0] = ($wasActive | 0) != 0 & 1;
  HEAP8[$call + 24 | 0] = ($isLearning | 0) != 0 & 1;
  HEAP8[$call + 25 | 0] = ($wasLearning | 0) != 0 & 1;
  return $call | 0;
}
function _jsGetNewSynapse() {
  return _malloc(12) | 0;
}
function _jsGetNewSegment() {
  return _malloc(44) | 0;
}
function _initCell($cell, $column, $index) {
  $cell = $cell | 0;
  $column = $column | 0;
  $index = $index | 0;
  var $3 = 0, $4 = 0, $5 = 0;
  HEAP32[$cell + 4 >> 2] = $column;
  HEAP32[$cell + 8 >> 2] = $index;
  HEAP32[$cell + 32 >> 2] = 0;
  _memset($cell + 16 | 0, 0, 10);
  HEAP32[$cell + 36 >> 2] = 10;
  HEAP32[$cell + 28 >> 2] = _malloc(440) | 0;
  HEAP32[$cell + 44 >> 2] = 0;
  HEAP32[$cell + 48 >> 2] = 5;
  HEAP32[$cell + 40 >> 2] = _malloc(160) | 0;
  $3 = HEAP32[$column >> 2] | 0;
  HEAP32[$cell >> 2] = $3;
  $4 = HEAP32[$3 + 12 >> 2] | 0;
  $5 = HEAP32[$column + 44 >> 2] | 0;
  HEAP32[$cell + 12 >> 2] = Math_imul(Math_imul(HEAP32[$3 + 40 >> 2] | 0, HEAP32[$column + 48 >> 2] | 0) + $5 | 0, $4) + $index | 0;
  return;
}
function _initInputCell($cell, $region, $index) {
  $cell = $cell | 0;
  $region = $region | 0;
  $index = $index | 0;
  HEAP32[$cell >> 2] = $region;
  HEAP32[$cell + 4 >> 2] = 0;
  HEAP32[$cell + 8 >> 2] = $index;
  _memset($cell + 12 | 0, 0, 14);
  _memset($cell + 28 | 0, 0, 24);
  return;
}
function _deleteCell($cell) {
  $cell = $cell | 0;
  var $numSegments = 0, $0 = 0, $cmp22 = 0, $segments = 0, $1 = 0, $2 = 0, $i_023 = 0, $arrayidx = 0, $inc = 0, $3 = 0, $cmp = 0, $4 = 0, $_lcssa21 = 0, $5 = 0, $allocatedSegments = 0, $numSegUpdates = 0, $6 = 0, $cmp517 = 0, $segmentUpdates = 0, $7 = 0, $8 = 0, $i_118 = 0, $arrayidx7 = 0, $inc9 = 0, $9 = 0, $cmp5 = 0, $10 = 0, $_lcssa = 0, $11 = 0, $allocatedSegUpdates = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegments = $cell + 32 | 0;
    $0 = HEAP32[$numSegments >> 2] | 0;
    $cmp22 = ($0 | 0) > 0;
    $segments = $cell + 28 | 0;
    $1 = HEAP32[$segments >> 2] | 0;
    if ($cmp22) {
      $i_023 = 0;
      $2 = $1;
      label = 3;
      break;
    } else {
      $_lcssa21 = $1;
      label = 4;
      break;
    }
   case 3:
    $arrayidx = $2 + ($i_023 * 44 & -1) | 0;
    _deleteSegment($arrayidx);
    $inc = $i_023 + 1 | 0;
    $3 = HEAP32[$numSegments >> 2] | 0;
    $cmp = ($inc | 0) < ($3 | 0);
    $4 = HEAP32[$segments >> 2] | 0;
    if ($cmp) {
      $i_023 = $inc;
      $2 = $4;
      label = 3;
      break;
    } else {
      $_lcssa21 = $4;
      label = 4;
      break;
    }
   case 4:
    $5 = $_lcssa21;
    _free($5);
    HEAP32[$segments >> 2] = 0;
    HEAP32[$numSegments >> 2] = 0;
    $allocatedSegments = $cell + 36 | 0;
    HEAP32[$allocatedSegments >> 2] = 0;
    $numSegUpdates = $cell + 44 | 0;
    $6 = HEAP32[$numSegUpdates >> 2] | 0;
    $cmp517 = ($6 | 0) > 0;
    $segmentUpdates = $cell + 40 | 0;
    $7 = HEAP32[$segmentUpdates >> 2] | 0;
    if ($cmp517) {
      $i_118 = 0;
      $8 = $7;
      label = 5;
      break;
    } else {
      $_lcssa = $7;
      label = 6;
      break;
    }
   case 5:
    $arrayidx7 = $8 + ($i_118 << 5) | 0;
    _deleteSegmentUpdateInfo($arrayidx7);
    $inc9 = $i_118 + 1 | 0;
    $9 = HEAP32[$numSegUpdates >> 2] | 0;
    $cmp5 = ($inc9 | 0) < ($9 | 0);
    $10 = HEAP32[$segmentUpdates >> 2] | 0;
    if ($cmp5) {
      $i_118 = $inc9;
      $8 = $10;
      label = 5;
      break;
    } else {
      $_lcssa = $10;
      label = 6;
      break;
    }
   case 6:
    $11 = $_lcssa;
    _free($11);
    HEAP32[$segmentUpdates >> 2] = 0;
    HEAP32[$numSegUpdates >> 2] = 0;
    $allocatedSegUpdates = $cell + 48 | 0;
    HEAP32[$allocatedSegUpdates >> 2] = 0;
    return;
  }
}
function _nextCellTimeStep($cell) {
  $cell = $cell | 0;
  var $isActive = 0, $0 = 0, $1 = 0, $wasActive = 0, $isPredicting = 0, $2 = 0, $3 = 0, $wasPredicted = 0, $isLearning = 0, $4 = 0, $5 = 0, $wasLearning = 0, $numSegments = 0, $6 = 0, $cmp13 = 0, $segments = 0, $i_014 = 0, $7 = 0, $arrayidx = 0, $inc = 0, $8 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $isActive = $cell + 20 | 0;
    $0 = HEAP8[$isActive] | 0;
    $1 = $0 & 1;
    $wasActive = $cell + 21 | 0;
    HEAP8[$wasActive] = $1;
    $isPredicting = $cell + 22 | 0;
    $2 = HEAP8[$isPredicting] | 0;
    $3 = $2 & 1;
    $wasPredicted = $cell + 23 | 0;
    HEAP8[$wasPredicted] = $3;
    $isLearning = $cell + 24 | 0;
    $4 = HEAP8[$isLearning] | 0;
    $5 = $4 & 1;
    $wasLearning = $cell + 25 | 0;
    HEAP8[$wasLearning] = $5;
    HEAP8[$isActive] = 0;
    HEAP8[$isPredicting] = 0;
    HEAP8[$isLearning] = 0;
    $numSegments = $cell + 32 | 0;
    $6 = HEAP32[$numSegments >> 2] | 0;
    $cmp13 = ($6 | 0) > 0;
    if ($cmp13) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $segments = $cell + 28 | 0;
    $i_014 = 0;
    label = 4;
    break;
   case 4:
    $7 = HEAP32[$segments >> 2] | 0;
    $arrayidx = $7 + ($i_014 * 44 & -1) | 0;
    _nextSegmentTimeStep($arrayidx);
    $inc = $i_014 + 1 | 0;
    $8 = HEAP32[$numSegments >> 2] | 0;
    $cmp = ($inc | 0) < ($8 | 0);
    if ($cmp) {
      $i_014 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    return;
  }
}
function _createCellSegment($cell) {
  $cell = $cell | 0;
  var $numSegments = 0, $0 = 0, $allocatedSegments = 0, $1 = 0, $cmp = 0, $mul = 0, $segments = 0, $2 = 0, $3 = 0, $mul2 = 0, $call = 0, $4 = 0, $5 = 0, $segments6 = 0, $6 = 0, $arrayidx = 0, $column = 0, $7 = 0, $region = 0, $8 = 0, $segActiveThreshold = 0, $9 = 0, $10 = 0, $add = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegments = $cell + 32 | 0;
    $0 = HEAP32[$numSegments >> 2] | 0;
    $allocatedSegments = $cell + 36 | 0;
    $1 = HEAP32[$allocatedSegments >> 2] | 0;
    $cmp = ($0 | 0) == ($1 | 0);
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    $mul = $1 << 1;
    $segments = $cell + 28 | 0;
    $2 = HEAP32[$segments >> 2] | 0;
    $3 = $2;
    $mul2 = $1 * 88 & -1;
    $call = _realloc($3, $mul2) | 0;
    $4 = $call;
    HEAP32[$segments >> 2] = $4;
    HEAP32[$allocatedSegments >> 2] = $mul;
    label = 4;
    break;
   case 4:
    $5 = HEAP32[$numSegments >> 2] | 0;
    $segments6 = $cell + 28 | 0;
    $6 = HEAP32[$segments6 >> 2] | 0;
    $arrayidx = $6 + ($5 * 44 & -1) | 0;
    $column = $cell + 4 | 0;
    $7 = HEAP32[$column >> 2] | 0;
    $region = $7 | 0;
    $8 = HEAP32[$region >> 2] | 0;
    $segActiveThreshold = $8 + 16 | 0;
    $9 = HEAP32[$segActiveThreshold >> 2] | 0;
    _initSegment($arrayidx, $9);
    $10 = HEAP32[$numSegments >> 2] | 0;
    $add = $10 + 1 | 0;
    HEAP32[$numSegments >> 2] = $add;
    return $arrayidx | 0;
  }
  return 0;
}
function _updateSegmentActiveSynapses($cell, $previous, $segmentID, $newSynapses) {
  $cell = $cell | 0;
  $previous = $previous | 0;
  $segmentID = $segmentID | 0;
  $newSynapses = $newSynapses | 0;
  var $numSegUpdates = 0, $0 = 0, $allocatedSegUpdates = 0, $1 = 0, $cmp = 0, $mul = 0, $segmentUpdates = 0, $2 = 0, $3 = 0, $mul3 = 0, $call = 0, $4 = 0, $5 = 0, $segmentUpdates7 = 0, $6 = 0, $arrayidx = 0, $7 = 0, $add = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegUpdates = $cell + 44 | 0;
    $0 = HEAP32[$numSegUpdates >> 2] | 0;
    $allocatedSegUpdates = $cell + 48 | 0;
    $1 = HEAP32[$allocatedSegUpdates >> 2] | 0;
    $cmp = ($0 | 0) == ($1 | 0);
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    $mul = $1 << 1;
    $segmentUpdates = $cell + 40 | 0;
    $2 = HEAP32[$segmentUpdates >> 2] | 0;
    $3 = $2;
    $mul3 = $1 << 6;
    $call = _realloc($3, $mul3) | 0;
    $4 = $call;
    HEAP32[$segmentUpdates >> 2] = $4;
    HEAP32[$allocatedSegUpdates >> 2] = $mul;
    label = 4;
    break;
   case 4:
    $5 = HEAP32[$numSegUpdates >> 2] | 0;
    $segmentUpdates7 = $cell + 40 | 0;
    $6 = HEAP32[$segmentUpdates7 >> 2] | 0;
    $arrayidx = $6 + ($5 << 5) | 0;
    _initSegmentUpdateInfo($arrayidx, $cell, $segmentID, $previous, $newSynapses);
    $7 = HEAP32[$numSegUpdates >> 2] | 0;
    $add = $7 + 1 | 0;
    HEAP32[$numSegUpdates >> 2] = $add;
    return $arrayidx | 0;
  }
  return 0;
}
function _applyCellSegmentUpdates($cell, $positiveReinforcement) {
  $cell = $cell | 0;
  $positiveReinforcement = $positiveReinforcement | 0;
  var $numSegUpdates = 0, $0 = 0, $cmp6 = 0, $segmentUpdates = 0, $i_07 = 0, $1 = 0, $arrayidx = 0, $inc = 0, $2 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSegUpdates = $cell + 44 | 0;
    $0 = HEAP32[$numSegUpdates >> 2] | 0;
    $cmp6 = ($0 | 0) > 0;
    if ($cmp6) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $segmentUpdates = $cell + 40 | 0;
    $i_07 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$segmentUpdates >> 2] | 0;
    $arrayidx = $1 + ($i_07 << 5) | 0;
    _applySegmentUpdates($arrayidx, $positiveReinforcement);
    _deleteSegmentUpdateInfo($arrayidx);
    $inc = $i_07 + 1 | 0;
    $2 = HEAP32[$numSegUpdates >> 2] | 0;
    $cmp = ($inc | 0) < ($2 | 0);
    if ($cmp) {
      $i_07 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    HEAP32[$numSegUpdates >> 2] = 0;
    return;
  }
}
function _getBestMatchingPreviousSegment($cell, $segmentID) {
  $cell = $cell | 0;
  $segmentID = $segmentID | 0;
  return _getBestMatchingSegment($cell, (HEAP32[$cell + 16 >> 2] | 0) + 1 | 0, 1, $segmentID) | 0;
}
function _initColumn($col, $region, $srcPosX, $srcPosY, $posX, $posY) {
  $col = $col | 0;
  $region = $region | 0;
  $srcPosX = $srcPosX | 0;
  $srcPosY = $srcPosY | 0;
  $posX = $posX | 0;
  $posY = $posY | 0;
  var $region1 = 0, $cellsPerCol = 0, $0 = 0, $numCells = 0, $mul = 0, $call = 0, $1 = 0, $cells = 0, $2 = 0, $cmp23 = 0, $i_024 = 0, $3 = 0, $arrayidx = 0, $inc = 0, $4 = 0, $cmp = 0, $isActive = 0, $call5 = 0, $5 = 0, $proximalSegment = 0, $segActiveThreshold = 0, $6 = 0, $boost = 0, $activeDutyCycle = 0, $overlapDutyCycle = 0, $overlap = 0, $ix = 0, $iy = 0, $cx = 0, $cy = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $region1 = $col | 0;
    HEAP32[$region1 >> 2] = $region;
    $cellsPerCol = $region + 12 | 0;
    $0 = HEAP32[$cellsPerCol >> 2] | 0;
    $numCells = $col + 8 | 0;
    HEAP32[$numCells >> 2] = $0;
    $mul = $0 * 52 & -1;
    $call = _malloc($mul) | 0;
    $1 = $call;
    $cells = $col + 4 | 0;
    HEAP32[$cells >> 2] = $1;
    $2 = HEAP32[$numCells >> 2] | 0;
    $cmp23 = ($2 | 0) > 0;
    if ($cmp23) {
      $i_024 = 0;
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    $3 = HEAP32[$cells >> 2] | 0;
    $arrayidx = $3 + ($i_024 * 52 & -1) | 0;
    _initCell($arrayidx, $col, $i_024);
    $inc = $i_024 + 1 | 0;
    $4 = HEAP32[$numCells >> 2] | 0;
    $cmp = ($inc | 0) < ($4 | 0);
    if ($cmp) {
      $i_024 = $inc;
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $isActive = $col + 12 | 0;
    HEAP8[$isActive] = 0;
    $call5 = _malloc(44) | 0;
    $5 = $call5;
    $proximalSegment = $col + 16 | 0;
    HEAP32[$proximalSegment >> 2] = $5;
    $segActiveThreshold = $region + 16 | 0;
    $6 = HEAP32[$segActiveThreshold >> 2] | 0;
    _initSegment($5, $6);
    $boost = $col + 20 | 0;
    HEAPF32[$boost >> 2] = 1.0;
    $activeDutyCycle = $col + 24 | 0;
    HEAPF32[$activeDutyCycle >> 2] = 1.0;
    $overlapDutyCycle = $col + 28 | 0;
    HEAPF32[$overlapDutyCycle >> 2] = 1.0;
    $overlap = $col + 32 | 0;
    HEAP32[$overlap >> 2] = 0;
    $ix = $col + 36 | 0;
    HEAP32[$ix >> 2] = $srcPosX;
    $iy = $col + 40 | 0;
    HEAP32[$iy >> 2] = $srcPosY;
    $cx = $col + 44 | 0;
    HEAP32[$cx >> 2] = $posX;
    $cy = $col + 48 | 0;
    HEAP32[$cy >> 2] = $posY;
    return;
  }
}
function _deleteColumn($col) {
  $col = $col | 0;
  var $numCells = 0, $0 = 0, $cmp8 = 0, $cells = 0, $1 = 0, $2 = 0, $i_09 = 0, $arrayidx = 0, $inc = 0, $3 = 0, $cmp = 0, $4 = 0, $_lcssa = 0, $5 = 0, $proximalSegment = 0, $6 = 0, $7 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCells = $col + 8 | 0;
    $0 = HEAP32[$numCells >> 2] | 0;
    $cmp8 = ($0 | 0) > 0;
    $cells = $col + 4 | 0;
    $1 = HEAP32[$cells >> 2] | 0;
    if ($cmp8) {
      $i_09 = 0;
      $2 = $1;
      label = 3;
      break;
    } else {
      $_lcssa = $1;
      label = 4;
      break;
    }
   case 3:
    $arrayidx = $2 + ($i_09 * 52 & -1) | 0;
    _deleteCell($arrayidx);
    $inc = $i_09 + 1 | 0;
    $3 = HEAP32[$numCells >> 2] | 0;
    $cmp = ($inc | 0) < ($3 | 0);
    $4 = HEAP32[$cells >> 2] | 0;
    if ($cmp) {
      $i_09 = $inc;
      $2 = $4;
      label = 3;
      break;
    } else {
      $_lcssa = $4;
      label = 4;
      break;
    }
   case 4:
    $5 = $_lcssa;
    _free($5);
    $proximalSegment = $col + 16 | 0;
    $6 = HEAP32[$proximalSegment >> 2] | 0;
    $7 = $6;
    _free($7);
    HEAP32[$cells >> 2] = 0;
    HEAP32[$proximalSegment >> 2] = 0;
    return;
  }
}
function _nextColumnTimeStep($col) {
  $col = $col | 0;
  var $numCells = 0, $0 = 0, $cmp4 = 0, $cells = 0, $i_05 = 0, $1 = 0, $arrayidx = 0, $inc = 0, $2 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCells = $col + 8 | 0;
    $0 = HEAP32[$numCells >> 2] | 0;
    $cmp4 = ($0 | 0) > 0;
    if ($cmp4) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $cells = $col + 4 | 0;
    $i_05 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$cells >> 2] | 0;
    $arrayidx = $1 + ($i_05 * 52 & -1) | 0;
    _nextCellTimeStep($arrayidx);
    $inc = $i_05 + 1 | 0;
    $2 = HEAP32[$numCells >> 2] | 0;
    $cmp = ($inc | 0) < ($2 | 0);
    if ($cmp) {
      $i_05 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    return;
  }
}
function _getBestMatchingCell($col, $bestSegPtr, $segmentID, $numPredictionSteps, $previous) {
  $col = $col | 0;
  $bestSegPtr = $bestSegPtr | 0;
  $segmentID = $segmentID | 0;
  $numPredictionSteps = $numPredictionSteps | 0;
  $previous = $previous | 0;
  var $bestSegID = 0, $numCells = 0, $0 = 0, $cmp25 = 0, $cells = 0, $1 = 0, $bestCell_029 = 0, $bestSeg_028 = 0, $i_027 = 0, $bestCount_026 = 0, $2 = 0, $arrayidx = 0, $call = 0, $cmp1 = 0, $numPrevActiveAllSyns = 0, $numActiveAllSyns = 0, $synCount_0_in = 0, $synCount_0 = 0, $cmp4 = 0, $3 = 0, $bestCount_1 = 0, $bestSeg_1 = 0, $bestCell_1 = 0, $inc = 0, $4 = 0, $cmp = 0, $cmp8 = 0, $_pr = 0, $cells10 = 0, $5 = 0, $cmp1421 = 0, $numSegments = 0, $6 = 0, $7 = 0, $8 = 0, $fewestCount_024 = 0, $bestCell_223 = 0, $i_122 = 0, $numSegments18 = 0, $9 = 0, $cmp19 = 0, $arrayidx17 = 0, $bestCell_3 = 0, $fewestCount_1 = 0, $inc28 = 0, $cmp14 = 0, $bestSeg_0_lcssa34 = 0, $bestCell_4 = 0, label = 0, __stackBase__ = 0;
  __stackBase__ = STACKTOP;
  STACKTOP = STACKTOP + 8 | 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $bestSegID = __stackBase__ | 0;
    $numCells = $col + 8 | 0;
    $0 = HEAP32[$numCells >> 2] | 0;
    $cmp25 = ($0 | 0) > 0;
    $cells = $col + 4 | 0;
    if ($cmp25) {
      $bestCount_026 = 0;
      $i_027 = 0;
      $bestSeg_028 = 0;
      $bestCell_029 = 0;
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $1 = HEAP32[$cells >> 2] | 0;
    $bestCell_4 = $1;
    $bestSeg_0_lcssa34 = 0;
    label = 14;
    break;
   case 4:
    $2 = HEAP32[$cells >> 2] | 0;
    $arrayidx = $2 + ($i_027 * 52 & -1) | 0;
    $call = _getBestMatchingSegment($arrayidx, $numPredictionSteps, $previous, $bestSegID) | 0;
    $cmp1 = ($call | 0) == 0;
    if ($cmp1) {
      $bestCell_1 = $bestCell_029;
      $bestSeg_1 = $bestSeg_028;
      $bestCount_1 = $bestCount_026;
      label = 7;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $numPrevActiveAllSyns = $call + 40 | 0;
    $numActiveAllSyns = $call + 36 | 0;
    $synCount_0_in = $previous ? $numPrevActiveAllSyns : $numActiveAllSyns;
    $synCount_0 = HEAP32[$synCount_0_in >> 2] | 0;
    $cmp4 = ($synCount_0 | 0) > ($bestCount_026 | 0);
    if ($cmp4) {
      label = 6;
      break;
    } else {
      $bestCell_1 = $bestCell_029;
      $bestSeg_1 = $bestSeg_028;
      $bestCount_1 = $bestCount_026;
      label = 7;
      break;
    }
   case 6:
    $3 = HEAP32[$bestSegID >> 2] | 0;
    HEAP32[$segmentID >> 2] = $3;
    $bestCell_1 = $arrayidx;
    $bestSeg_1 = $call;
    $bestCount_1 = $synCount_0;
    label = 7;
    break;
   case 7:
    $inc = $i_027 + 1 | 0;
    $4 = HEAP32[$numCells >> 2] | 0;
    $cmp = ($inc | 0) < ($4 | 0);
    if ($cmp) {
      $bestCount_026 = $bestCount_1;
      $i_027 = $inc;
      $bestSeg_028 = $bestSeg_1;
      $bestCell_029 = $bestCell_1;
      label = 4;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $cmp8 = ($bestCell_1 | 0) == 0;
    if ($cmp8) {
      label = 9;
      break;
    } else {
      $bestCell_4 = $bestCell_1;
      $bestSeg_0_lcssa34 = $bestSeg_1;
      label = 14;
      break;
    }
   case 9:
    $_pr = HEAP32[$numCells >> 2] | 0;
    $cells10 = $col + 4 | 0;
    $5 = HEAP32[$cells10 >> 2] | 0;
    $cmp1421 = ($_pr | 0) > 1;
    if ($cmp1421) {
      label = 10;
      break;
    } else {
      $bestCell_4 = $5;
      $bestSeg_0_lcssa34 = $bestSeg_1;
      label = 14;
      break;
    }
   case 10:
    $numSegments = $5 + 32 | 0;
    $6 = HEAP32[$numSegments >> 2] | 0;
    $7 = HEAP32[$cells10 >> 2] | 0;
    $8 = HEAP32[$numCells >> 2] | 0;
    $i_122 = 1;
    $bestCell_223 = $5;
    $fewestCount_024 = $6;
    label = 11;
    break;
   case 11:
    $numSegments18 = $7 + ($i_122 * 52 & -1) + 32 | 0;
    $9 = HEAP32[$numSegments18 >> 2] | 0;
    $cmp19 = ($9 | 0) < ($fewestCount_024 | 0);
    if ($cmp19) {
      label = 12;
      break;
    } else {
      $fewestCount_1 = $fewestCount_024;
      $bestCell_3 = $bestCell_223;
      label = 13;
      break;
    }
   case 12:
    $arrayidx17 = $7 + ($i_122 * 52 & -1) | 0;
    $fewestCount_1 = $9;
    $bestCell_3 = $arrayidx17;
    label = 13;
    break;
   case 13:
    $inc28 = $i_122 + 1 | 0;
    $cmp14 = ($inc28 | 0) < ($8 | 0);
    if ($cmp14) {
      $i_122 = $inc28;
      $bestCell_223 = $bestCell_3;
      $fewestCount_024 = $fewestCount_1;
      label = 11;
      break;
    } else {
      $bestCell_4 = $bestCell_3;
      $bestSeg_0_lcssa34 = $bestSeg_1;
      label = 14;
      break;
    }
   case 14:
    HEAP32[$bestSegPtr >> 2] = $bestSeg_0_lcssa34;
    STACKTOP = __stackBase__;
    return $bestCell_4 | 0;
  }
  return 0;
}
function _computeOverlap($col) {
  $col = $col | 0;
  var $proximalSegment = 0, $0 = 0, $1 = 0, $numActiveConnectedSyns = 0, $2 = 0, $conv = 0.0, $region = 0, $3 = 0, $minOverlap = 0, $4 = 0.0, $cmp = 0, $boost = 0, $5 = 0.0, $mul = 0.0, $conv4 = 0, $overlap_0 = 0, $overlap5 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $proximalSegment = $col + 16 | 0;
    $0 = HEAP32[$proximalSegment >> 2] | 0;
    _processSegment($0);
    $1 = HEAP32[$proximalSegment >> 2] | 0;
    $numActiveConnectedSyns = $1 + 28 | 0;
    $2 = HEAP32[$numActiveConnectedSyns >> 2] | 0;
    $conv = +($2 | 0);
    $region = $col | 0;
    $3 = HEAP32[$region >> 2] | 0;
    $minOverlap = $3 + 64 | 0;
    $4 = +HEAPF32[$minOverlap >> 2];
    $cmp = $conv < $4;
    if ($cmp) {
      $overlap_0 = 0;
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $boost = $col + 20 | 0;
    $5 = +HEAPF32[$boost >> 2];
    $mul = $conv * $5;
    $conv4 = ~~$mul;
    $overlap_0 = $conv4;
    label = 4;
    break;
   case 4:
    $overlap5 = $col + 32 | 0;
    HEAP32[$overlap5 >> 2] = $overlap_0;
    return;
  }
}
function _updateColumnPermanences($col) {
  $col = $col | 0;
  var $proximalSegment = 0, $0 = 0, $numSynapses = 0, $1 = 0, $cmp5 = 0, $synapses = 0, $i_06 = 0, $2 = 0, $arrayidx = 0, $call = 0, $inc = 0, $3 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $proximalSegment = $col + 16 | 0;
    $0 = HEAP32[$proximalSegment >> 2] | 0;
    $numSynapses = $0 + 4 | 0;
    $1 = HEAP32[$numSynapses >> 2] | 0;
    $cmp5 = ($1 | 0) > 0;
    if ($cmp5) {
      label = 3;
      break;
    } else {
      label = 8;
      break;
    }
   case 3:
    $synapses = $0 | 0;
    $i_06 = 0;
    label = 4;
    break;
   case 4:
    $2 = HEAP32[$synapses >> 2] | 0;
    $arrayidx = $2 + ($i_06 * 12 & -1) | 0;
    $call = _isSynapseActive($arrayidx, 0) | 0;
    if ($call) {
      label = 5;
      break;
    } else {
      label = 6;
      break;
    }
   case 5:
    _increaseSynapsePermanence($arrayidx, 0);
    label = 7;
    break;
   case 6:
    _decreaseSynapsePermanence($arrayidx, 0);
    label = 7;
    break;
   case 7:
    $inc = $i_06 + 1 | 0;
    $3 = HEAP32[$numSynapses >> 2] | 0;
    $cmp = ($inc | 0) < ($3 | 0);
    if ($cmp) {
      $i_06 = $inc;
      label = 4;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    return;
  }
}
function _increasePermanences($col, $amount) {
  $col = $col | 0;
  $amount = $amount | 0;
  var $proximalSegment = 0, $0 = 0, $numSynapses = 0, $1 = 0, $cmp4 = 0, $synapses = 0, $i_05 = 0, $2 = 0, $arrayidx = 0, $inc = 0, $3 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $proximalSegment = $col + 16 | 0;
    $0 = HEAP32[$proximalSegment >> 2] | 0;
    $numSynapses = $0 + 4 | 0;
    $1 = HEAP32[$numSynapses >> 2] | 0;
    $cmp4 = ($1 | 0) > 0;
    if ($cmp4) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $synapses = $0 | 0;
    $i_05 = 0;
    label = 4;
    break;
   case 4:
    $2 = HEAP32[$synapses >> 2] | 0;
    $arrayidx = $2 + ($i_05 * 12 & -1) | 0;
    _increaseSynapsePermanence($arrayidx, $amount);
    $inc = $i_05 + 1 | 0;
    $3 = HEAP32[$numSynapses >> 2] | 0;
    $cmp = ($inc | 0) < ($3 | 0);
    if ($cmp) {
      $i_05 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    return;
  }
}
function _updateOverlapDutyCycle($col) {
  $col = $col | 0;
  var $0 = 0.0, $conv = 0.0, $sub = 0.0, $overlapDutyCycle = 0, $1 = 0.0, $conv1 = 0.0, $mul = 0.0, $conv2 = 0.0, $overlap = 0, $2 = 0, $conv3 = 0.0, $region = 0, $3 = 0, $minOverlap = 0, $4 = 0.0, $cmp = 0, $add = 0.0, $newCycle_0 = 0.0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = +HEAPF32[212];
    $conv = $0;
    $sub = 1.0 - $conv;
    $overlapDutyCycle = $col + 28 | 0;
    $1 = +HEAPF32[$overlapDutyCycle >> 2];
    $conv1 = $1;
    $mul = $sub * $conv1;
    $conv2 = $mul;
    $overlap = $col + 32 | 0;
    $2 = HEAP32[$overlap >> 2] | 0;
    $conv3 = +($2 | 0);
    $region = $col | 0;
    $3 = HEAP32[$region >> 2] | 0;
    $minOverlap = $3 + 64 | 0;
    $4 = +HEAPF32[$minOverlap >> 2];
    $cmp = $conv3 > $4;
    if ($cmp) {
      label = 3;
      break;
    } else {
      $newCycle_0 = $conv2;
      label = 4;
      break;
    }
   case 3:
    $add = $0 + $conv2;
    $newCycle_0 = $add;
    label = 4;
    break;
   case 4:
    HEAPF32[$overlapDutyCycle >> 2] = $newCycle_0;
    return;
  }
}
function _boostFunction($col, $minDutyCycle) {
  $col = $col | 0;
  $minDutyCycle = +$minDutyCycle;
  var $activeDutyCycle = 0, $0 = 0.0, $cmp = 0, $cmp2 = 0, $boost = 0, $1 = 0.0, $conv5 = 0.0, $mul = 0.0, $conv6 = 0.0, $div = 0.0, $retval_0 = 0.0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $activeDutyCycle = $col + 24 | 0;
    $0 = +HEAPF32[$activeDutyCycle >> 2];
    $cmp = $0 > $minDutyCycle;
    if ($cmp) {
      $retval_0 = 1.0;
      label = 6;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $cmp2 = $0 == 0.0;
    if ($cmp2) {
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 4:
    $boost = $col + 20 | 0;
    $1 = +HEAPF32[$boost >> 2];
    $conv5 = $1;
    $mul = $conv5 * 1.05;
    $conv6 = $mul;
    $retval_0 = $conv6;
    label = 6;
    break;
   case 5:
    $div = $minDutyCycle / $0;
    $retval_0 = $div;
    label = 6;
    break;
   case 6:
    return +$retval_0;
  }
  return 0.0;
}
function _getColumnPredictions($region, $outData) {
  $region = $region | 0;
  $outData = $outData | 0;
  var $numCols = 0, $0 = 0, $cmp22 = 0, $columns = 0, $width = 0, $i_023 = 0, $1 = 0, $arrayidx1 = 0, $numCells = 0, $2 = 0, $cmp317 = 0, $cells = 0, $3 = 0, $4 = 0, $p_020 = 0, $colOK_0_off019 = 0, $j_018 = 0, $isPredicting = 0, $5 = 0, $6 = 0, $tobool = 0, $predictionSteps = 0, $7 = 0, $conv = 0, $cmp6 = 0, $conv9 = 0, $_colOK_0_off0 = 0, $conv9_p_0 = 0, $colOK_1_off0 = 0, $p_1 = 0, $inc = 0, $cmp3 = 0, $cy = 0, $8 = 0, $9 = 0, $mul = 0, $cx = 0, $10 = 0, $add = 0, $arrayidx12 = 0, $inc15 = 0, $11 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp22 = ($0 | 0) > 0;
    if ($cmp22) {
      label = 3;
      break;
    } else {
      label = 12;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $width = $region + 40 | 0;
    $i_023 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$columns >> 2] | 0;
    $arrayidx1 = $outData + $i_023 | 0;
    HEAP8[$arrayidx1] = 0;
    $numCells = $1 + ($i_023 * 52 & -1) + 8 | 0;
    $2 = HEAP32[$numCells >> 2] | 0;
    $cmp317 = ($2 | 0) > 0;
    if ($cmp317) {
      label = 5;
      break;
    } else {
      label = 11;
      break;
    }
   case 5:
    $cells = $1 + ($i_023 * 52 & -1) + 4 | 0;
    $3 = HEAP32[$cells >> 2] | 0;
    $4 = HEAP32[$numCells >> 2] | 0;
    $j_018 = 0;
    $colOK_0_off019 = 0;
    $p_020 = 10;
    label = 6;
    break;
   case 6:
    $isPredicting = $3 + ($j_018 * 52 & -1) + 22 | 0;
    $5 = HEAP8[$isPredicting] | 0;
    $6 = $5 & 1;
    $tobool = $6 << 24 >> 24 == 0;
    if ($tobool) {
      $p_1 = $p_020;
      $colOK_1_off0 = $colOK_0_off019;
      label = 8;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $predictionSteps = $3 + ($j_018 * 52 & -1) + 16 | 0;
    $7 = HEAP32[$predictionSteps >> 2] | 0;
    $conv = $p_020 << 24 >> 24;
    $cmp6 = ($7 | 0) < ($conv | 0);
    $conv9 = $7 & 255;
    $_colOK_0_off0 = $cmp6 | $colOK_0_off019;
    $conv9_p_0 = $cmp6 ? $conv9 : $p_020;
    $p_1 = $conv9_p_0;
    $colOK_1_off0 = $_colOK_0_off0;
    label = 8;
    break;
   case 8:
    $inc = $j_018 + 1 | 0;
    $cmp3 = ($inc | 0) < ($4 | 0);
    if ($cmp3) {
      $j_018 = $inc;
      $colOK_0_off019 = $colOK_1_off0;
      $p_020 = $p_1;
      label = 6;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    if ($colOK_1_off0) {
      label = 10;
      break;
    } else {
      label = 11;
      break;
    }
   case 10:
    $cy = $1 + ($i_023 * 52 & -1) + 48 | 0;
    $8 = HEAP32[$cy >> 2] | 0;
    $9 = HEAP32[$width >> 2] | 0;
    $mul = Math_imul($9, $8);
    $cx = $1 + ($i_023 * 52 & -1) + 44 | 0;
    $10 = HEAP32[$cx >> 2] | 0;
    $add = $mul + $10 | 0;
    $arrayidx12 = $outData + $add | 0;
    HEAP8[$arrayidx12] = $p_1;
    label = 11;
    break;
   case 11:
    $inc15 = $i_023 + 1 | 0;
    $11 = HEAP32[$numCols >> 2] | 0;
    $cmp = ($inc15 | 0) < ($11 | 0);
    if ($cmp) {
      $i_023 = $inc15;
      label = 4;
      break;
    } else {
      label = 12;
      break;
    }
   case 12:
    return;
  }
}
function _performBoosting($col) {
  $col = $col | 0;
  var $region1 = 0, $0 = 0, $inhibitionRadius = 0, $1 = 0.0, $roundf = 0.0, $conv2 = 0, $cx = 0, $2 = 0, $sub = 0, $sub4 = 0, $cmp = 0, $sub_sub4 = 0, $cmp10 = 0, $_sub_sub4 = 0, $cy = 0, $3 = 0, $sub30 = 0, $sub32 = 0, $cmp33 = 0, $sub30_sub32 = 0, $cmp43 = 0, $cond62 = 0, $width = 0, $4 = 0, $5 = 0, $add = 0, $add65 = 0, $cmp66 = 0, $add_add65 = 0, $cmp76 = 0, $_add_add65 = 0, $height = 0, $6 = 0, $7 = 0, $add98 = 0, $add100 = 0, $cmp101 = 0, $add98_add100 = 0, $cmp111 = 0, $cond131 = 0, $8 = 0, $add133 = 0, $cmp134 = 0, $_add133 = 0, $9 = 0, $add143 = 0, $cmp144 = 0, $cond151 = 0, $cmp15270 = 0, $cmp15567 = 0, $columns = 0, $x_072 = 0, $maxDuty_071 = 0.0, $10 = 0, $11 = 0, $y_069 = 0, $maxDuty_168 = 0.0, $mul = 0, $add160 = 0, $activeDutyCycle = 0, $12 = 0.0, $cmp161 = 0, $maxDuty_2 = 0.0, $inc = 0, $cmp155 = 0, $maxDuty_1_lcssa = 0.0, $inc165 = 0, $cmp152 = 0, $maxDuty_0_lcssa = 0.0, $conv167 = 0.0, $mul168 = 0.0, $conv169 = 0.0, $call170 = 0.0, $boost = 0, $overlapDutyCycle = 0, $13 = 0.0, $cmp171 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $region1 = $col | 0;
    $0 = HEAP32[$region1 >> 2] | 0;
    $inhibitionRadius = $0 + 68 | 0;
    $1 = +HEAPF32[$inhibitionRadius >> 2];
    $roundf = +_round(+$1);
    $conv2 = ~~$roundf;
    $cx = $col + 44 | 0;
    $2 = HEAP32[$cx >> 2] | 0;
    $sub = $2 - 1 | 0;
    $sub4 = $2 - $conv2 | 0;
    $cmp = ($sub | 0) < ($sub4 | 0);
    $sub_sub4 = $cmp ? $sub : $sub4;
    $cmp10 = ($sub_sub4 | 0) < 0;
    $_sub_sub4 = $cmp10 ? 0 : $sub_sub4;
    $cy = $col + 48 | 0;
    $3 = HEAP32[$cy >> 2] | 0;
    $sub30 = $3 - 1 | 0;
    $sub32 = $3 - $conv2 | 0;
    $cmp33 = ($sub30 | 0) < ($sub32 | 0);
    $sub30_sub32 = $cmp33 ? $sub30 : $sub32;
    $cmp43 = ($sub30_sub32 | 0) < 0;
    $cond62 = $cmp43 ? 0 : $sub30_sub32;
    $width = $0 + 40 | 0;
    $4 = HEAP32[$width >> 2] | 0;
    $5 = HEAP32[$cx >> 2] | 0;
    $add = $5 + 1 | 0;
    $add65 = $5 + $conv2 | 0;
    $cmp66 = ($add | 0) > ($add65 | 0);
    $add_add65 = $cmp66 ? $add : $add65;
    $cmp76 = ($4 | 0) < ($add_add65 | 0);
    $_add_add65 = $cmp76 ? $4 : $add_add65;
    $height = $0 + 44 | 0;
    $6 = HEAP32[$height >> 2] | 0;
    $7 = HEAP32[$cy >> 2] | 0;
    $add98 = $7 + 1 | 0;
    $add100 = $7 + $conv2 | 0;
    $cmp101 = ($add98 | 0) > ($add100 | 0);
    $add98_add100 = $cmp101 ? $add98 : $add100;
    $cmp111 = ($6 | 0) < ($add98_add100 | 0);
    $cond131 = $cmp111 ? $6 : $add98_add100;
    $8 = HEAP32[$width >> 2] | 0;
    $add133 = $_add_add65 + 1 | 0;
    $cmp134 = ($8 | 0) < ($add133 | 0);
    $_add133 = $cmp134 ? $8 : $add133;
    $9 = HEAP32[$height >> 2] | 0;
    $add143 = $cond131 + 1 | 0;
    $cmp144 = ($9 | 0) < ($add143 | 0);
    $cond151 = $cmp144 ? $9 : $add143;
    $cmp15270 = ($_sub_sub4 | 0) < ($_add133 | 0);
    if ($cmp15270) {
      label = 3;
      break;
    } else {
      $maxDuty_0_lcssa = 0.0;
      label = 8;
      break;
    }
   case 3:
    $cmp15567 = ($cond62 | 0) < ($cond151 | 0);
    $columns = $0 + 56 | 0;
    $maxDuty_071 = 0.0;
    $x_072 = $_sub_sub4;
    label = 4;
    break;
   case 4:
    if ($cmp15567) {
      label = 5;
      break;
    } else {
      $maxDuty_1_lcssa = $maxDuty_071;
      label = 7;
      break;
    }
   case 5:
    $10 = HEAP32[$width >> 2] | 0;
    $11 = HEAP32[$columns >> 2] | 0;
    $maxDuty_168 = $maxDuty_071;
    $y_069 = $cond62;
    label = 6;
    break;
   case 6:
    $mul = Math_imul($10, $y_069);
    $add160 = $mul + $x_072 | 0;
    $activeDutyCycle = $11 + ($add160 * 52 & -1) + 24 | 0;
    $12 = +HEAPF32[$activeDutyCycle >> 2];
    $cmp161 = $12 > $maxDuty_168;
    $maxDuty_2 = $cmp161 ? $12 : $maxDuty_168;
    $inc = $y_069 + 1 | 0;
    $cmp155 = ($inc | 0) < ($cond151 | 0);
    if ($cmp155) {
      $maxDuty_168 = $maxDuty_2;
      $y_069 = $inc;
      label = 6;
      break;
    } else {
      $maxDuty_1_lcssa = $maxDuty_2;
      label = 7;
      break;
    }
   case 7:
    $inc165 = $x_072 + 1 | 0;
    $cmp152 = ($inc165 | 0) < ($_add133 | 0);
    if ($cmp152) {
      $maxDuty_071 = $maxDuty_1_lcssa;
      $x_072 = $inc165;
      label = 4;
      break;
    } else {
      $maxDuty_0_lcssa = $maxDuty_1_lcssa;
      label = 8;
      break;
    }
   case 8:
    $conv167 = $maxDuty_0_lcssa;
    $mul168 = $conv167 * .01;
    $conv169 = $mul168;
    _updateActiveDutyCycle($col);
    $call170 = +_boostFunction($col, $conv169);
    $boost = $col + 20 | 0;
    HEAPF32[$boost >> 2] = $call170;
    _updateOverlapDutyCycle($col);
    $overlapDutyCycle = $col + 28 | 0;
    $13 = +HEAPF32[$overlapDutyCycle >> 2];
    $cmp171 = $13 < $conv169;
    if ($cmp171) {
      label = 9;
      break;
    } else {
      label = 10;
      break;
    }
   case 9:
    _increasePermanences($col, 50);
    label = 10;
    break;
   case 10:
    return;
  }
}
function _averageReceptiveFieldSize($region) {
  $region = $region | 0;
  var $numCols = 0, $0 = 0, $cmp23 = 0, $columns = 0, $1 = 0, $2 = 0, $inputWidth = 0, $xSpace = 0, $i_026 = 0, $n_025 = 0, $sum_024 = 0.0, $proximalSegment = 0, $3 = 0, $numSynapses = 0, $4 = 0, $cmp218 = 0, $synapses = 0, $5 = 0, $6 = 0, $ix = 0, $iy = 0, $j_021 = 0, $n_120 = 0, $sum_119 = 0.0, $isConnected = 0, $7 = 0, $8 = 0, $tobool = 0, $inputSource = 0, $9 = 0, $index = 0, $10 = 0, $11 = 0, $div = 0, $conv = 0.0, $rem = 0, $conv8 = 0.0, $12 = 0, $conv9 = 0.0, $sub = 0.0, $13 = 0, $conv10 = 0.0, $sub11 = 0.0, $mul = 0.0, $mul12 = 0.0, $add = 0.0, $call = 0.0, $14 = 0.0, $conv13 = 0.0, $div14 = 0.0, $add15 = 0.0, $inc = 0, $sum_2 = 0.0, $n_2 = 0, $inc16 = 0, $cmp2 = 0, $n_1_lcssa = 0, $sum_1_lcssa = 0.0, $inc18 = 0, $cmp = 0, $n_0_lcssa = 0, $sum_0_lcssa = 0.0, $conv20 = 0.0, $div21 = 0.0, $conv22 = 0.0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp23 = ($0 | 0) > 0;
    if ($cmp23) {
      label = 3;
      break;
    } else {
      $sum_0_lcssa = 0.0;
      $n_0_lcssa = 0;
      label = 10;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $1 = HEAP32[$columns >> 2] | 0;
    $2 = HEAP32[$numCols >> 2] | 0;
    $inputWidth = $region | 0;
    $xSpace = $region + 48 | 0;
    $sum_024 = 0.0;
    $n_025 = 0;
    $i_026 = 0;
    label = 4;
    break;
   case 4:
    $proximalSegment = $1 + ($i_026 * 52 & -1) + 16 | 0;
    $3 = HEAP32[$proximalSegment >> 2] | 0;
    $numSynapses = $3 + 4 | 0;
    $4 = HEAP32[$numSynapses >> 2] | 0;
    $cmp218 = ($4 | 0) > 0;
    if ($cmp218) {
      label = 5;
      break;
    } else {
      $sum_1_lcssa = $sum_024;
      $n_1_lcssa = $n_025;
      label = 9;
      break;
    }
   case 5:
    $synapses = $3 | 0;
    $5 = HEAP32[$synapses >> 2] | 0;
    $6 = HEAP32[$numSynapses >> 2] | 0;
    $ix = $1 + ($i_026 * 52 & -1) + 36 | 0;
    $iy = $1 + ($i_026 * 52 & -1) + 40 | 0;
    $sum_119 = $sum_024;
    $n_120 = $n_025;
    $j_021 = 0;
    label = 6;
    break;
   case 6:
    $isConnected = $5 + ($j_021 * 12 & -1) + 8 | 0;
    $7 = HEAP8[$isConnected] | 0;
    $8 = $7 & 1;
    $tobool = $8 << 24 >> 24 == 0;
    if ($tobool) {
      $n_2 = $n_120;
      $sum_2 = $sum_119;
      label = 8;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $inputSource = $5 + ($j_021 * 12 & -1) | 0;
    $9 = HEAP32[$inputSource >> 2] | 0;
    $index = $9 + 8 | 0;
    $10 = HEAP32[$index >> 2] | 0;
    $11 = HEAP32[$inputWidth >> 2] | 0;
    $div = ($10 | 0) / ($11 | 0) & -1;
    $conv = +($div | 0);
    $rem = ($10 | 0) % ($11 | 0);
    $conv8 = +($rem | 0);
    $12 = HEAP32[$ix >> 2] | 0;
    $conv9 = +($12 | 0);
    $sub = $conv9 - $conv;
    $13 = HEAP32[$iy >> 2] | 0;
    $conv10 = +($13 | 0);
    $sub11 = $conv10 - $conv8;
    $mul = $sub * $sub;
    $mul12 = $sub11 * $sub11;
    $add = $mul + $mul12;
    $call = +Math_sqrt(+$add);
    $14 = +HEAPF32[$xSpace >> 2];
    $conv13 = $14;
    $div14 = $call / $conv13;
    $add15 = $sum_119 + $div14;
    $inc = $n_120 + 1 | 0;
    $n_2 = $inc;
    $sum_2 = $add15;
    label = 8;
    break;
   case 8:
    $inc16 = $j_021 + 1 | 0;
    $cmp2 = ($inc16 | 0) < ($6 | 0);
    if ($cmp2) {
      $sum_119 = $sum_2;
      $n_120 = $n_2;
      $j_021 = $inc16;
      label = 6;
      break;
    } else {
      $sum_1_lcssa = $sum_2;
      $n_1_lcssa = $n_2;
      label = 9;
      break;
    }
   case 9:
    $inc18 = $i_026 + 1 | 0;
    $cmp = ($inc18 | 0) < ($2 | 0);
    if ($cmp) {
      $sum_024 = $sum_1_lcssa;
      $n_025 = $n_1_lcssa;
      $i_026 = $inc18;
      label = 4;
      break;
    } else {
      $sum_0_lcssa = $sum_1_lcssa;
      $n_0_lcssa = $n_1_lcssa;
      label = 10;
      break;
    }
   case 10:
    $conv20 = +($n_0_lcssa | 0);
    $div21 = $sum_0_lcssa / $conv20;
    $conv22 = $div21;
    return +$conv22;
  }
  return 0.0;
}
function _newRegionHardcoded($inputSizeX, $inputSizeY, $localityRadius, $cellsPerCol, $segActiveThreshold, $newSynapseCount, $inputData) {
  $inputSizeX = $inputSizeX | 0;
  $inputSizeY = $inputSizeY | 0;
  $localityRadius = $localityRadius | 0;
  $cellsPerCol = $cellsPerCol | 0;
  $segActiveThreshold = $segActiveThreshold | 0;
  $newSynapseCount = $newSynapseCount | 0;
  $inputData = $inputData | 0;
  var $call = 0, $0 = 0, $cmp = 0, $inputWidth = 0, $inputHeight = 0, $1 = 0, $iters = 0, $2 = 0, $inputData1 = 0, $3 = 0, $inputCells = 0, $4 = 0, $localityRadius2 = 0, $5 = 0, $cellsPerCol3 = 0, $6 = 0, $segActiveThreshold4 = 0, $7 = 0, $newSynapseCount5 = 0, $8 = 0, $width = 0, $9 = 0, $height = 0, $10 = 0, $xSpace = 0, $11 = 0, $ySpace = 0, $12 = 0, $13 = 0, $14 = 0, $mul = 0, $numCols = 0, $15 = 0, $mul9 = 0, $call10 = 0, $16 = 0, $columns = 0, $17 = 0, $cmp12 = 0, $18 = 0, $cmp1647 = 0, $cx_048 = 0, $19 = 0, $cmp1945 = 0, $cy_046 = 0, $20 = 0, $mul22 = 0, $add = 0, $21 = 0, $arrayidx = 0, $inc = 0, $22 = 0, $cmp19 = 0, $inc25 = 0, $23 = 0, $cmp16 = 0, $24 = 0, $conv = 0.0, $div = 0.0, $pctInputPerCol = 0, $25 = 0, $pctMinOverlap = 0, $26 = 0, $pctLocalActivity = 0, $27 = 0, $minOverlap = 0, $28 = 0, $desiredLocalActivity = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $retval_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $call = _malloc(92) | 0;
    $0 = $call;
    $cmp = ($call | 0) == 0;
    if ($cmp) {
      $retval_0 = 0;
      label = 9;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $inputWidth = $call;
    HEAP32[$inputWidth >> 2] = $inputSizeX;
    $inputHeight = $call + 4 | 0;
    $1 = $inputHeight;
    HEAP32[$1 >> 2] = $inputSizeY;
    $iters = $call + 88 | 0;
    $2 = $iters;
    HEAP32[$2 >> 2] = 0;
    $inputData1 = $call + 76 | 0;
    $3 = $inputData1;
    HEAP32[$3 >> 2] = $inputData;
    $inputCells = $call + 84 | 0;
    $4 = $inputCells;
    HEAP32[$4 >> 2] = 0;
    $localityRadius2 = $call + 8 | 0;
    $5 = $localityRadius2;
    HEAP32[$5 >> 2] = $localityRadius;
    $cellsPerCol3 = $call + 12 | 0;
    $6 = $cellsPerCol3;
    HEAP32[$6 >> 2] = $cellsPerCol;
    $segActiveThreshold4 = $call + 16 | 0;
    $7 = $segActiveThreshold4;
    HEAP32[$7 >> 2] = $segActiveThreshold;
    $newSynapseCount5 = $call + 20 | 0;
    $8 = $newSynapseCount5;
    HEAP32[$8 >> 2] = $newSynapseCount;
    $width = $call + 40 | 0;
    $9 = $width;
    HEAP32[$9 >> 2] = $inputSizeX;
    $height = $call + 44 | 0;
    $10 = $height;
    HEAP32[$10 >> 2] = $inputSizeY;
    $xSpace = $call + 48 | 0;
    $11 = $xSpace;
    HEAPF32[$11 >> 2] = 1.0;
    $ySpace = $call + 52 | 0;
    $12 = $ySpace;
    HEAPF32[$12 >> 2] = 1.0;
    $13 = HEAP32[$9 >> 2] | 0;
    $14 = HEAP32[$10 >> 2] | 0;
    $mul = Math_imul($14, $13);
    $numCols = $call + 60 | 0;
    $15 = $numCols;
    HEAP32[$15 >> 2] = $mul;
    $mul9 = $mul * 52 & -1;
    $call10 = _malloc($mul9) | 0;
    $16 = $call10;
    $columns = $call + 56 | 0;
    $17 = $columns;
    HEAP32[$17 >> 2] = $16;
    $cmp12 = ($call10 | 0) == 0;
    if ($cmp12) {
      $retval_0 = 0;
      label = 9;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $18 = HEAP32[$9 >> 2] | 0;
    $cmp1647 = ($18 | 0) > 0;
    if ($cmp1647) {
      $cx_048 = 0;
      label = 5;
      break;
    } else {
      label = 8;
      break;
    }
   case 5:
    $19 = HEAP32[$10 >> 2] | 0;
    $cmp1945 = ($19 | 0) > 0;
    if ($cmp1945) {
      $cy_046 = 0;
      label = 6;
      break;
    } else {
      label = 7;
      break;
    }
   case 6:
    $20 = HEAP32[$9 >> 2] | 0;
    $mul22 = Math_imul($20, $cy_046);
    $add = $mul22 + $cx_048 | 0;
    $21 = HEAP32[$17 >> 2] | 0;
    $arrayidx = $21 + ($add * 52 & -1) | 0;
    _initColumn($arrayidx, $0, $cx_048, $cy_046, $cx_048, $cy_046);
    $inc = $cy_046 + 1 | 0;
    $22 = HEAP32[$10 >> 2] | 0;
    $cmp19 = ($inc | 0) < ($22 | 0);
    if ($cmp19) {
      $cy_046 = $inc;
      label = 6;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $inc25 = $cx_048 + 1 | 0;
    $23 = HEAP32[$9 >> 2] | 0;
    $cmp16 = ($inc25 | 0) < ($23 | 0);
    if ($cmp16) {
      $cx_048 = $inc25;
      label = 5;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $24 = HEAP32[$15 >> 2] | 0;
    $conv = +($24 | 0);
    $div = 1.0 / $conv;
    $pctInputPerCol = $call + 24 | 0;
    $25 = $pctInputPerCol;
    HEAPF32[$25 >> 2] = $div;
    $pctMinOverlap = $call + 28 | 0;
    $26 = $pctMinOverlap;
    HEAPF32[$26 >> 2] = 1.0;
    $pctLocalActivity = $call + 32 | 0;
    $27 = $pctLocalActivity;
    HEAPF32[$27 >> 2] = 1.0;
    $minOverlap = $call + 64 | 0;
    $28 = $minOverlap;
    HEAPF32[$28 >> 2] = 1.0;
    $desiredLocalActivity = $call + 72 | 0;
    $29 = $desiredLocalActivity;
    HEAP32[$29 >> 2] = 1;
    $30 = $call + 36 | 0;
    HEAP8[$30] = 1;
    $31 = $call + 37 | 0;
    HEAP8[$31] = 0;
    $32 = $call + 38 | 0;
    HEAP8[$32] = 1;
    $retval_0 = $0;
    label = 9;
    break;
   case 9:
    return $retval_0 | 0;
  }
  return 0;
}
function _newRegion($inputSizeX, $inputSizeY, $colGridSizeX, $colGridSizeY, $pctInputPerCol, $pctMinOverlap, $localityRadius, $pctLocalActivity, $cellsPerCol, $segActiveThreshold, $newSynapseCount, $inputData) {
  $inputSizeX = $inputSizeX | 0;
  $inputSizeY = $inputSizeY | 0;
  $colGridSizeX = $colGridSizeX | 0;
  $colGridSizeY = $colGridSizeY | 0;
  $pctInputPerCol = +$pctInputPerCol;
  $pctMinOverlap = +$pctMinOverlap;
  $localityRadius = $localityRadius | 0;
  $pctLocalActivity = +$pctLocalActivity;
  $cellsPerCol = $cellsPerCol | 0;
  $segActiveThreshold = $segActiveThreshold | 0;
  $newSynapseCount = $newSynapseCount | 0;
  $inputData = $inputData | 0;
  var $call = 0, $0 = 0, $cmp = 0, $inputWidth = 0, $inputHeight = 0, $1 = 0, $2 = 0, $mul = 0, $nInput = 0, $3 = 0, $iters = 0, $4 = 0, $inputData3 = 0, $5 = 0, $localityRadius4 = 0, $6 = 0, $cellsPerCol5 = 0, $7 = 0, $segActiveThreshold6 = 0, $8 = 0, $newSynapseCount7 = 0, $9 = 0, $pctInputPerCol8 = 0, $10 = 0, $pctMinOverlap9 = 0, $11 = 0, $pctLocalActivity10 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $width = 0, $16 = 0, $height = 0, $17 = 0, $18 = 0, $mul13 = 0, $numCols = 0, $19 = 0, $20 = 0, $conv = 0.0, $sub = 0.0, $21 = 0, $sub16 = 0, $conv17 = 0.0, $call18 = 0.0, $conv19 = 0.0, $div = 0.0, $conv20 = 0.0, $xSpace = 0, $22 = 0, $23 = 0, $conv22 = 0.0, $sub23 = 0.0, $24 = 0, $sub25 = 0, $conv26 = 0.0, $call27 = 0.0, $conv28 = 0.0, $div29 = 0.0, $conv30 = 0.0, $ySpace = 0, $25 = 0, $26 = 0, $mul32 = 0, $call33 = 0, $27 = 0, $columns = 0, $28 = 0, $cmp35 = 0, $29 = 0, $cmp40155 = 0, $cx_0156 = 0, $30 = 0, $cmp44153 = 0, $conv47 = 0.0, $cy_0154 = 0, $31 = 0.0, $mul49 = 0.0, $call50 = 0.0, $conv51 = 0, $conv52 = 0.0, $32 = 0.0, $mul54 = 0.0, $call55 = 0.0, $conv56 = 0, $33 = 0, $mul58 = 0, $add = 0, $34 = 0, $arrayidx = 0, $inc = 0, $35 = 0, $cmp44 = 0, $inc61 = 0, $36 = 0, $cmp40 = 0, $37 = 0, $conv64 = 0.0, $38 = 0.0, $mul66 = 0.0, $cmp68 = 0, $39 = 0, $40 = 0, $mul73 = 0, $conv74 = 0.0, $mul77 = 0.0, $conv74_pn = 0.0, $synapsesPerSegment_0_in = 0.0, $synapsesPerSegment_0 = 0, $conv81 = 0.0, $mul82 = 0.0, $minOverlap = 0, $41 = 0, $42 = 0, $mul84 = 0, $call85 = 0, $43 = 0, $inputCells = 0, $44 = 0, $mul86 = 0, $call87 = 0, $45 = 0, $mul88 = 0, $call89 = 0, $46 = 0, $cmp91151 = 0, $i_0152 = 0, $47 = 0, $arrayidx95 = 0, $48 = 0, $arrayidx97 = 0, $arrayidx98 = 0, $inc100 = 0, $cmp91 = 0, $call102 = 0.0, $conv103 = 0, $49 = 0, $cmp110148 = 0, $cmp187146 = 0, $i_1150 = 0, $nc_0149 = 0, $50 = 0, $51 = 0, $tobool = 0, $52 = 0, $53 = 0, $cmp119 = 0, $iy = 0, $54 = 0, $sub122 = 0, $cmp123 = 0, $_sub122 = 0, $55 = 0, $sub128 = 0, $add130 = 0, $cmp131 = 0, $cond140 = 0, $ix = 0, $56 = 0, $sub141 = 0, $cmp142 = 0, $_sub141 = 0, $57 = 0, $sub151 = 0, $add153 = 0, $cmp154 = 0, $cond163 = 0, $cmp165142 = 0, $cmp169139 = 0, $s_0144 = 0, $x_0143 = 0, $s_1141 = 0, $y_0140 = 0, $58 = 0, $mul173 = 0, $add174 = 0, $59 = 0, $arrayidx176 = 0, $inc177 = 0, $arrayidx178 = 0, $inc180 = 0, $cmp169 = 0, $s_1_lcssa = 0, $inc183 = 0, $cmp165 = 0, $nc_1 = 0, $proximalSegment195 = 0, $s_2147 = 0, $arrayidx190 = 0, $60 = 0, $61 = 0, $62 = 0, $tobool191 = 0, $63 = 0, $call193 = 0, $call196 = 0, $inc199 = 0, $cmp187 = 0, $proximalSegment201 = 0, $64 = 0, $inc203 = 0, $65 = 0, $cmp110 = 0, $66 = 0, $67 = 0, $tobool206 = 0, $call208 = 0.0, $inhibitionRadius = 0, $68 = 0, $inhibitionRadius210 = 0, $69 = 0, $70 = 0, $cmp213 = 0, $inhibitionRadius216 = 0, $71 = 0, $72 = 0.0, $73 = 0.0, $mul218 = 0.0, $mul222 = 0, $conv223 = 0.0, $74 = 0.0, $mul225 = 0.0, $dla_0 = 0.0, $roundf = 0.0, $cmp229 = 0, $phitmp = 0, $cond236 = 0, $desiredLocalActivity = 0, $75 = 0, $76 = 0, $77 = 0, $tobool238 = 0, $call240 = 0, $call241 = 0, $78 = 0.0, $conv243 = 0.0, $79 = 0.0, $conv245 = 0.0, $call246 = 0, $call247 = 0, $inhibitionRadius248 = 0, $80 = 0, $81 = 0.0, $conv249 = 0.0, $call250 = 0, $82 = 0, $call252 = 0, $call253 = 0, $83 = 0.0, $conv255 = 0.0, $call256 = 0, $call257 = 0, $retval_0 = 0, label = 0, __stackBase__ = 0;
  __stackBase__ = STACKTOP;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $call = _malloc(92) | 0;
    $0 = $call;
    $cmp = ($call | 0) == 0;
    if ($cmp) {
      $retval_0 = 0;
      label = 40;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $inputWidth = $call;
    HEAP32[$inputWidth >> 2] = $inputSizeX;
    $inputHeight = $call + 4 | 0;
    $1 = $inputHeight;
    HEAP32[$1 >> 2] = $inputSizeY;
    $2 = HEAP32[$inputWidth >> 2] | 0;
    $mul = Math_imul($2, $inputSizeY);
    $nInput = $call + 80 | 0;
    $3 = $nInput;
    HEAP32[$3 >> 2] = $mul;
    $iters = $call + 88 | 0;
    $4 = $iters;
    HEAP32[$4 >> 2] = 0;
    $inputData3 = $call + 76 | 0;
    $5 = $inputData3;
    HEAP32[$5 >> 2] = $inputData;
    $localityRadius4 = $call + 8 | 0;
    $6 = $localityRadius4;
    HEAP32[$6 >> 2] = $localityRadius;
    $cellsPerCol5 = $call + 12 | 0;
    $7 = $cellsPerCol5;
    HEAP32[$7 >> 2] = $cellsPerCol;
    $segActiveThreshold6 = $call + 16 | 0;
    $8 = $segActiveThreshold6;
    HEAP32[$8 >> 2] = $segActiveThreshold;
    $newSynapseCount7 = $call + 20 | 0;
    $9 = $newSynapseCount7;
    HEAP32[$9 >> 2] = $newSynapseCount;
    $pctInputPerCol8 = $call + 24 | 0;
    $10 = $pctInputPerCol8;
    HEAPF32[$10 >> 2] = $pctInputPerCol;
    $pctMinOverlap9 = $call + 28 | 0;
    $11 = $pctMinOverlap9;
    HEAPF32[$11 >> 2] = $pctMinOverlap;
    $pctLocalActivity10 = $call + 32 | 0;
    $12 = $pctLocalActivity10;
    HEAPF32[$12 >> 2] = $pctLocalActivity;
    $13 = $call + 36 | 0;
    HEAP8[$13] = 0;
    $14 = $call + 37 | 0;
    HEAP8[$14] = 1;
    $15 = $call + 38 | 0;
    HEAP8[$15] = 1;
    $width = $call + 40 | 0;
    $16 = $width;
    HEAP32[$16 >> 2] = $colGridSizeX;
    $height = $call + 44 | 0;
    $17 = $height;
    HEAP32[$17 >> 2] = $colGridSizeY;
    $18 = HEAP32[$16 >> 2] | 0;
    $mul13 = Math_imul($18, $colGridSizeY);
    $numCols = $call + 60 | 0;
    $19 = $numCols;
    HEAP32[$19 >> 2] = $mul13;
    $20 = HEAP32[$inputWidth >> 2] | 0;
    $conv = +($20 | 0);
    $sub = $conv + -1.0;
    $21 = HEAP32[$16 >> 2] | 0;
    $sub16 = $21 - 1 | 0;
    $conv17 = +($sub16 | 0);
    $call18 = +_fmax(1.0, +$conv17);
    $conv19 = $call18;
    $div = $sub / $conv19;
    $conv20 = $div;
    $xSpace = $call + 48 | 0;
    $22 = $xSpace;
    HEAPF32[$22 >> 2] = $conv20;
    $23 = HEAP32[$1 >> 2] | 0;
    $conv22 = +($23 | 0);
    $sub23 = $conv22 + -1.0;
    $24 = HEAP32[$17 >> 2] | 0;
    $sub25 = $24 - 1 | 0;
    $conv26 = +($sub25 | 0);
    $call27 = +_fmax(1.0, +$conv26);
    $conv28 = $call27;
    $div29 = $sub23 / $conv28;
    $conv30 = $div29;
    $ySpace = $call + 52 | 0;
    $25 = $ySpace;
    HEAPF32[$25 >> 2] = $conv30;
    $26 = HEAP32[$19 >> 2] | 0;
    $mul32 = $26 * 52 & -1;
    $call33 = _malloc($mul32) | 0;
    $27 = $call33;
    $columns = $call + 56 | 0;
    $28 = $columns;
    HEAP32[$28 >> 2] = $27;
    $cmp35 = ($call33 | 0) == 0;
    if ($cmp35) {
      $retval_0 = 0;
      label = 40;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $29 = HEAP32[$16 >> 2] | 0;
    $cmp40155 = ($29 | 0) > 0;
    if ($cmp40155) {
      $cx_0156 = 0;
      label = 5;
      break;
    } else {
      label = 9;
      break;
    }
   case 5:
    $30 = HEAP32[$17 >> 2] | 0;
    $cmp44153 = ($30 | 0) > 0;
    if ($cmp44153) {
      label = 6;
      break;
    } else {
      label = 8;
      break;
    }
   case 6:
    $conv47 = +($cx_0156 | 0);
    $cy_0154 = 0;
    label = 7;
    break;
   case 7:
    $31 = +HEAPF32[$22 >> 2];
    $mul49 = $conv47 * $31;
    $call50 = +_round(+$mul49);
    $conv51 = ~~$call50;
    $conv52 = +($cy_0154 | 0);
    $32 = +HEAPF32[$25 >> 2];
    $mul54 = $conv52 * $32;
    $call55 = +_round(+$mul54);
    $conv56 = ~~$call55;
    $33 = HEAP32[$16 >> 2] | 0;
    $mul58 = Math_imul($33, $cy_0154);
    $add = $mul58 + $cx_0156 | 0;
    $34 = HEAP32[$28 >> 2] | 0;
    $arrayidx = $34 + ($add * 52 & -1) | 0;
    _initColumn($arrayidx, $0, $conv51, $conv56, $cx_0156, $cy_0154);
    $inc = $cy_0154 + 1 | 0;
    $35 = HEAP32[$17 >> 2] | 0;
    $cmp44 = ($inc | 0) < ($35 | 0);
    if ($cmp44) {
      $cy_0154 = $inc;
      label = 7;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $inc61 = $cx_0156 + 1 | 0;
    $36 = HEAP32[$16 >> 2] | 0;
    $cmp40 = ($inc61 | 0) < ($36 | 0);
    if ($cmp40) {
      $cx_0156 = $inc61;
      label = 5;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $37 = HEAP32[$6 >> 2] | 0;
    $conv64 = +($37 | 0);
    $38 = +HEAPF32[$22 >> 2];
    $mul66 = $conv64 * $38;
    $cmp68 = ($37 | 0) == 0;
    if ($cmp68) {
      label = 10;
      break;
    } else {
      label = 11;
      break;
    }
   case 10:
    $39 = HEAP32[$inputWidth >> 2] | 0;
    $40 = HEAP32[$1 >> 2] | 0;
    $mul73 = Math_imul($40, $39);
    $conv74 = +($mul73 | 0);
    $conv74_pn = $conv74;
    label = 12;
    break;
   case 11:
    $mul77 = $mul66 * $mul66;
    $conv74_pn = $mul77;
    label = 12;
    break;
   case 12:
    $synapsesPerSegment_0_in = $conv74_pn * $pctInputPerCol;
    $synapsesPerSegment_0 = ~~$synapsesPerSegment_0_in;
    $conv81 = +($synapsesPerSegment_0 | 0);
    $mul82 = $conv81 * $pctMinOverlap;
    $minOverlap = $call + 64 | 0;
    $41 = $minOverlap;
    HEAPF32[$41 >> 2] = $mul82;
    $42 = HEAP32[$3 >> 2] | 0;
    $mul84 = $42 * 52 & -1;
    $call85 = _malloc($mul84) | 0;
    $43 = $call85;
    $inputCells = $call + 84 | 0;
    $44 = $inputCells;
    HEAP32[$44 >> 2] = $43;
    $mul86 = $42 << 2;
    $call87 = _malloc($mul86) | 0;
    $45 = $call87;
    $mul88 = $synapsesPerSegment_0 << 2;
    $call89 = _malloc($mul88) | 0;
    $46 = $call89;
    $cmp91151 = ($42 | 0) > 0;
    if ($cmp91151) {
      $i_0152 = 0;
      label = 13;
      break;
    } else {
      label = 14;
      break;
    }
   case 13:
    $47 = HEAP32[$44 >> 2] | 0;
    $arrayidx95 = $47 + ($i_0152 * 52 & -1) | 0;
    _initInputCell($arrayidx95, $0, $i_0152);
    $48 = HEAP32[$44 >> 2] | 0;
    $arrayidx97 = $48 + ($i_0152 * 52 & -1) | 0;
    $arrayidx98 = $45 + ($i_0152 << 2) | 0;
    HEAP32[$arrayidx98 >> 2] = $arrayidx97;
    $inc100 = $i_0152 + 1 | 0;
    $cmp91 = ($inc100 | 0) < ($42 | 0);
    if ($cmp91) {
      $i_0152 = $inc100;
      label = 13;
      break;
    } else {
      label = 14;
      break;
    }
   case 14:
    $call102 = +_round(+$mul66);
    $conv103 = ~~$call102;
    $49 = HEAP32[$19 >> 2] | 0;
    $cmp110148 = ($49 | 0) > 0;
    if ($cmp110148) {
      label = 15;
      break;
    } else {
      label = 30;
      break;
    }
   case 15:
    $cmp187146 = ($synapsesPerSegment_0 | 0) > 0;
    $nc_0149 = $42;
    $i_1150 = 0;
    label = 16;
    break;
   case 16:
    $50 = HEAP8[$13] | 0;
    $51 = $50 & 1;
    $tobool = $51 << 24 >> 24 == 0;
    if ($tobool) {
      label = 17;
      break;
    } else {
      label = 30;
      break;
    }
   case 17:
    $52 = HEAP32[$28 >> 2] | 0;
    $53 = HEAP32[$6 >> 2] | 0;
    $cmp119 = ($53 | 0) > 0;
    if ($cmp119) {
      label = 18;
      break;
    } else {
      $nc_1 = $nc_0149;
      label = 23;
      break;
    }
   case 18:
    $iy = $52 + ($i_1150 * 52 & -1) + 40 | 0;
    $54 = HEAP32[$iy >> 2] | 0;
    $sub122 = $54 - $conv103 | 0;
    $cmp123 = ($sub122 | 0) < 0;
    $_sub122 = $cmp123 ? 0 : $sub122;
    $55 = HEAP32[$1 >> 2] | 0;
    $sub128 = $55 - 1 | 0;
    $add130 = $54 + $conv103 | 0;
    $cmp131 = ($sub128 | 0) < ($add130 | 0);
    $cond140 = $cmp131 ? $sub128 : $add130;
    $ix = $52 + ($i_1150 * 52 & -1) + 36 | 0;
    $56 = HEAP32[$ix >> 2] | 0;
    $sub141 = $56 - $conv103 | 0;
    $cmp142 = ($sub141 | 0) < 0;
    $_sub141 = $cmp142 ? 0 : $sub141;
    $57 = HEAP32[$inputWidth >> 2] | 0;
    $sub151 = $57 - 1 | 0;
    $add153 = $56 + $conv103 | 0;
    $cmp154 = ($sub151 | 0) < ($add153 | 0);
    $cond163 = $cmp154 ? $sub151 : $add153;
    $cmp165142 = ($_sub141 | 0) > ($cond163 | 0);
    if ($cmp165142) {
      $nc_1 = 0;
      label = 23;
      break;
    } else {
      label = 19;
      break;
    }
   case 19:
    $cmp169139 = ($_sub122 | 0) > ($cond140 | 0);
    $x_0143 = $_sub141;
    $s_0144 = 0;
    label = 20;
    break;
   case 20:
    if ($cmp169139) {
      $s_1_lcssa = $s_0144;
      label = 22;
      break;
    } else {
      $y_0140 = $_sub122;
      $s_1141 = $s_0144;
      label = 21;
      break;
    }
   case 21:
    $58 = HEAP32[$inputWidth >> 2] | 0;
    $mul173 = Math_imul($58, $y_0140);
    $add174 = $mul173 + $x_0143 | 0;
    $59 = HEAP32[$44 >> 2] | 0;
    $arrayidx176 = $59 + ($add174 * 52 & -1) | 0;
    $inc177 = $s_1141 + 1 | 0;
    $arrayidx178 = $45 + ($s_1141 << 2) | 0;
    HEAP32[$arrayidx178 >> 2] = $arrayidx176;
    $inc180 = $y_0140 + 1 | 0;
    $cmp169 = ($inc180 | 0) > ($cond140 | 0);
    if ($cmp169) {
      $s_1_lcssa = $inc177;
      label = 22;
      break;
    } else {
      $y_0140 = $inc180;
      $s_1141 = $inc177;
      label = 21;
      break;
    }
   case 22:
    $inc183 = $x_0143 + 1 | 0;
    $cmp165 = ($inc183 | 0) > ($cond163 | 0);
    if ($cmp165) {
      $nc_1 = $s_1_lcssa;
      label = 23;
      break;
    } else {
      $x_0143 = $inc183;
      $s_0144 = $s_1_lcssa;
      label = 20;
      break;
    }
   case 23:
    _randomSample($45, $nc_1, $46, $synapsesPerSegment_0);
    if ($cmp187146) {
      label = 24;
      break;
    } else {
      label = 29;
      break;
    }
   case 24:
    $proximalSegment195 = $52 + ($i_1150 * 52 & -1) + 16 | 0;
    $s_2147 = 0;
    label = 25;
    break;
   case 25:
    $arrayidx190 = $46 + ($s_2147 << 2) | 0;
    $60 = HEAP32[$arrayidx190 >> 2] | 0;
    $61 = HEAP8[840] | 0;
    $62 = $61 & 1;
    $tobool191 = $62 << 24 >> 24 == 0;
    $63 = HEAP32[$proximalSegment195 >> 2] | 0;
    if ($tobool191) {
      label = 27;
      break;
    } else {
      label = 26;
      break;
    }
   case 26:
    $call193 = _createSynapse($63, $60, 1e4) | 0;
    label = 28;
    break;
   case 27:
    $call196 = _createSynapse($63, $60, 2666) | 0;
    label = 28;
    break;
   case 28:
    $inc199 = $s_2147 + 1 | 0;
    $cmp187 = ($inc199 | 0) < ($synapsesPerSegment_0 | 0);
    if ($cmp187) {
      $s_2147 = $inc199;
      label = 25;
      break;
    } else {
      label = 29;
      break;
    }
   case 29:
    $proximalSegment201 = $52 + ($i_1150 * 52 & -1) + 16 | 0;
    $64 = HEAP32[$proximalSegment201 >> 2] | 0;
    _processSegment($64);
    $inc203 = $i_1150 + 1 | 0;
    $65 = HEAP32[$19 >> 2] | 0;
    $cmp110 = ($inc203 | 0) < ($65 | 0);
    if ($cmp110) {
      $nc_0149 = $nc_1;
      $i_1150 = $inc203;
      label = 16;
      break;
    } else {
      label = 30;
      break;
    }
   case 30:
    _free($call89);
    _free($call87);
    $66 = HEAP8[$13] | 0;
    $67 = $66 & 1;
    $tobool206 = $67 << 24 >> 24 == 0;
    if ($tobool206) {
      label = 31;
      break;
    } else {
      label = 32;
      break;
    }
   case 31:
    $call208 = +_averageReceptiveFieldSize($0);
    $inhibitionRadius = $call + 68 | 0;
    $68 = $inhibitionRadius;
    HEAPF32[$68 >> 2] = $call208;
    label = 33;
    break;
   case 32:
    $inhibitionRadius210 = $call + 68 | 0;
    $69 = $inhibitionRadius210;
    HEAPF32[$69 >> 2] = 0.0;
    label = 33;
    break;
   case 33:
    $70 = HEAP32[$6 >> 2] | 0;
    $cmp213 = ($70 | 0) == 0;
    if ($cmp213) {
      label = 34;
      break;
    } else {
      label = 35;
      break;
    }
   case 34:
    $inhibitionRadius216 = $call + 68 | 0;
    $71 = $inhibitionRadius216;
    $72 = +HEAPF32[$71 >> 2];
    $73 = +HEAPF32[$12 >> 2];
    $mul218 = $72 * $73;
    $dla_0 = $mul218;
    label = 36;
    break;
   case 35:
    $mul222 = Math_imul($70, $70);
    $conv223 = +($mul222 | 0);
    $74 = +HEAPF32[$12 >> 2];
    $mul225 = $conv223 * $74;
    $dla_0 = $mul225;
    label = 36;
    break;
   case 36:
    $roundf = +_round(+$dla_0);
    $cmp229 = $roundf < 2.0;
    if ($cmp229) {
      $cond236 = 2;
      label = 38;
      break;
    } else {
      label = 37;
      break;
    }
   case 37:
    $phitmp = ~~$roundf;
    $cond236 = $phitmp;
    label = 38;
    break;
   case 38:
    $desiredLocalActivity = $call + 72 | 0;
    $75 = $desiredLocalActivity;
    HEAP32[$75 >> 2] = $cond236;
    $76 = HEAP8[856] | 0;
    $77 = $76 & 1;
    $tobool238 = $77 << 24 >> 24 == 0;
    if ($tobool238) {
      $retval_0 = $0;
      label = 40;
      break;
    } else {
      label = 39;
      break;
    }
   case 39:
    $call240 = _printf(328, (tempInt = STACKTOP, STACKTOP = STACKTOP + 1 | 0, STACKTOP = STACKTOP + 7 >> 3 << 3, HEAP32[tempInt >> 2] = 0, tempInt) | 0) | 0;
    $call241 = _printf(304, (tempInt = STACKTOP, STACKTOP = STACKTOP + 16 | 0, HEAP32[tempInt >> 2] = $colGridSizeX, HEAP32[tempInt + 8 >> 2] = $colGridSizeY, tempInt) | 0) | 0;
    $78 = +HEAPF32[$22 >> 2];
    $conv243 = $78;
    $79 = +HEAPF32[$25 >> 2];
    $conv245 = $79;
    $call246 = _printf(216, (tempInt = STACKTOP, STACKTOP = STACKTOP + 16 | 0, HEAPF64[tempInt >> 3] = $conv243, HEAPF64[tempInt + 8 >> 3] = $conv245, tempInt) | 0) | 0;
    $call247 = _printf(192, (tempInt = STACKTOP, STACKTOP = STACKTOP + 8 | 0, HEAP32[tempInt >> 2] = $conv103, tempInt) | 0) | 0;
    $inhibitionRadius248 = $call + 68 | 0;
    $80 = $inhibitionRadius248;
    $81 = +HEAPF32[$80 >> 2];
    $conv249 = $81;
    $call250 = _printf(160, (tempInt = STACKTOP, STACKTOP = STACKTOP + 8 | 0, HEAPF64[tempInt >> 3] = $conv249, tempInt) | 0) | 0;
    $82 = HEAP32[$75 >> 2] | 0;
    $call252 = _printf(128, (tempInt = STACKTOP, STACKTOP = STACKTOP + 8 | 0, HEAP32[tempInt >> 2] = $82, tempInt) | 0) | 0;
    $call253 = _printf(88, (tempInt = STACKTOP, STACKTOP = STACKTOP + 8 | 0, HEAP32[tempInt >> 2] = $synapsesPerSegment_0, tempInt) | 0) | 0;
    $83 = +HEAPF32[$41 >> 2];
    $conv255 = $83;
    $call256 = _printf(64, (tempInt = STACKTOP, STACKTOP = STACKTOP + 8 | 0, HEAPF64[tempInt >> 3] = $conv255, tempInt) | 0) | 0;
    $call257 = _printf(32, (tempInt = STACKTOP, STACKTOP = STACKTOP + 16 | 0, HEAP32[tempInt >> 2] = 2e3, HEAP32[tempInt + 8 >> 2] = 150, tempInt) | 0) | 0;
    $retval_0 = $0;
    label = 40;
    break;
   case 40:
    STACKTOP = __stackBase__;
    return $retval_0 | 0;
  }
  return 0;
}
function _deleteRegion($region) {
  $region = $region | 0;
  var $numCols = 0, $0 = 0, $cmp9 = 0, $columns = 0, $1 = 0, $2 = 0, $i_010 = 0, $arrayidx = 0, $inc = 0, $3 = 0, $cmp = 0, $4 = 0, $_lcssa = 0, $5 = 0, $inputCells = 0, $6 = 0, $cmp3 = 0, $7 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp9 = ($0 | 0) > 0;
    $columns = $region + 56 | 0;
    $1 = HEAP32[$columns >> 2] | 0;
    if ($cmp9) {
      $i_010 = 0;
      $2 = $1;
      label = 3;
      break;
    } else {
      $_lcssa = $1;
      label = 4;
      break;
    }
   case 3:
    $arrayidx = $2 + ($i_010 * 52 & -1) | 0;
    _deleteColumn($arrayidx);
    $inc = $i_010 + 1 | 0;
    $3 = HEAP32[$numCols >> 2] | 0;
    $cmp = ($inc | 0) < ($3 | 0);
    $4 = HEAP32[$columns >> 2] | 0;
    if ($cmp) {
      $i_010 = $inc;
      $2 = $4;
      label = 3;
      break;
    } else {
      $_lcssa = $4;
      label = 4;
      break;
    }
   case 4:
    $5 = $_lcssa;
    _free($5);
    HEAP32[$columns >> 2] = 0;
    $inputCells = $region + 84 | 0;
    $6 = HEAP32[$inputCells >> 2] | 0;
    $cmp3 = ($6 | 0) == 0;
    if ($cmp3) {
      label = 6;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $7 = $6;
    _free($7);
    label = 6;
    break;
   case 6:
    HEAP32[$inputCells >> 2] = 0;
    return;
  }
}
function _getLastAccuracy($region, $result) {
  $region = $region | 0;
  $result = $result | 0;
  var $numCols = 0, $0 = 0, $cmp26 = 0, $columns = 0, $1 = 0, $2 = 0, $sumP_030 = 0, $sumA_029 = 0, $sumAP_028 = 0, $i_027 = 0, $isActive = 0, $3 = 0, $4 = 0, $inc = 0, $sumA_0_inc = 0, $numCells = 0, $5 = 0, $cmp224 = 0, $cells = 0, $6 = 0, $c_025 = 0, $wasPredicted = 0, $7 = 0, $8 = 0, $tobool5 = 0, $numSegments = 0, $9 = 0, $cmp822 = 0, $segments = 0, $10 = 0, $s_023 = 0, $wasActive = 0, $11 = 0, $12 = 0, $tobool11 = 0, $isSequence = 0, $13 = 0, $14 = 0, $tobool12 = 0, $inc15 = 0, $15 = 0, $cmp8 = 0, $inc19 = 0, $16 = 0, $17 = 0, $inc23 = 0, $sumAP_0_inc23 = 0, $inc27 = 0, $18 = 0, $cmp2 = 0, $sumAP_1 = 0, $sumP_1 = 0, $inc30 = 0, $cmp = 0, $cmp32 = 0, $conv = 0.0, $conv34 = 0.0, $div = 0.0, $pctA_0 = 0.0, $cmp36 = 0, $conv39 = 0.0, $conv40 = 0.0, $div41 = 0.0, $pctA_037 = 0.0, $pctP_0 = 0.0, $arrayidx44 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp26 = ($0 | 0) > 0;
    if ($cmp26) {
      label = 3;
      break;
    } else {
      $pctP_0 = 0.0;
      $pctA_037 = 0.0;
      label = 19;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $1 = HEAP32[$columns >> 2] | 0;
    $2 = HEAP32[$numCols >> 2] | 0;
    $i_027 = 0;
    $sumAP_028 = 0;
    $sumA_029 = 0;
    $sumP_030 = 0;
    label = 4;
    break;
   case 4:
    $isActive = $1 + ($i_027 * 52 & -1) + 12 | 0;
    $3 = HEAP8[$isActive] | 0;
    $4 = $3 & 1;
    $inc = $4 & 255;
    $sumA_0_inc = $inc + $sumA_029 | 0;
    $numCells = $1 + ($i_027 * 52 & -1) + 8 | 0;
    $5 = HEAP32[$numCells >> 2] | 0;
    $cmp224 = ($5 | 0) > 0;
    if ($cmp224) {
      label = 5;
      break;
    } else {
      $sumP_1 = $sumP_030;
      $sumAP_1 = $sumAP_028;
      label = 14;
      break;
    }
   case 5:
    $cells = $1 + ($i_027 * 52 & -1) + 4 | 0;
    $6 = HEAP32[$cells >> 2] | 0;
    $c_025 = 0;
    label = 6;
    break;
   case 6:
    $wasPredicted = $6 + ($c_025 * 52 & -1) + 23 | 0;
    $7 = HEAP8[$wasPredicted] | 0;
    $8 = $7 & 1;
    $tobool5 = $8 << 24 >> 24 == 0;
    if ($tobool5) {
      label = 13;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $numSegments = $6 + ($c_025 * 52 & -1) + 32 | 0;
    $9 = HEAP32[$numSegments >> 2] | 0;
    $cmp822 = ($9 | 0) > 0;
    if ($cmp822) {
      label = 8;
      break;
    } else {
      label = 13;
      break;
    }
   case 8:
    $segments = $6 + ($c_025 * 52 & -1) + 28 | 0;
    $10 = HEAP32[$segments >> 2] | 0;
    $s_023 = 0;
    label = 9;
    break;
   case 9:
    $wasActive = $10 + ($s_023 * 44 & -1) + 25 | 0;
    $11 = HEAP8[$wasActive] | 0;
    $12 = $11 & 1;
    $tobool11 = $12 << 24 >> 24 == 0;
    if ($tobool11) {
      label = 11;
      break;
    } else {
      label = 10;
      break;
    }
   case 10:
    $isSequence = $10 + ($s_023 * 44 & -1) + 12 | 0;
    $13 = HEAP8[$isSequence] | 0;
    $14 = $13 & 1;
    $tobool12 = $14 << 24 >> 24 == 0;
    if ($tobool12) {
      label = 11;
      break;
    } else {
      label = 12;
      break;
    }
   case 11:
    $inc15 = $s_023 + 1 | 0;
    $15 = HEAP32[$numSegments >> 2] | 0;
    $cmp8 = ($inc15 | 0) < ($15 | 0);
    if ($cmp8) {
      $s_023 = $inc15;
      label = 9;
      break;
    } else {
      label = 13;
      break;
    }
   case 12:
    $inc19 = $sumP_030 + 1 | 0;
    $16 = HEAP8[$isActive] | 0;
    $17 = $16 & 1;
    $inc23 = $17 & 255;
    $sumAP_0_inc23 = $inc23 + $sumAP_028 | 0;
    $sumP_1 = $inc19;
    $sumAP_1 = $sumAP_0_inc23;
    label = 14;
    break;
   case 13:
    $inc27 = $c_025 + 1 | 0;
    $18 = HEAP32[$numCells >> 2] | 0;
    $cmp2 = ($inc27 | 0) < ($18 | 0);
    if ($cmp2) {
      $c_025 = $inc27;
      label = 6;
      break;
    } else {
      $sumP_1 = $sumP_030;
      $sumAP_1 = $sumAP_028;
      label = 14;
      break;
    }
   case 14:
    $inc30 = $i_027 + 1 | 0;
    $cmp = ($inc30 | 0) < ($2 | 0);
    if ($cmp) {
      $i_027 = $inc30;
      $sumAP_028 = $sumAP_1;
      $sumA_029 = $sumA_0_inc;
      $sumP_030 = $sumP_1;
      label = 4;
      break;
    } else {
      label = 15;
      break;
    }
   case 15:
    $cmp32 = ($sumA_0_inc | 0) > 0;
    if ($cmp32) {
      label = 16;
      break;
    } else {
      $pctA_0 = 0.0;
      label = 17;
      break;
    }
   case 16:
    $conv = +($sumAP_1 | 0);
    $conv34 = +($sumA_0_inc | 0);
    $div = $conv / $conv34;
    $pctA_0 = $div;
    label = 17;
    break;
   case 17:
    $cmp36 = ($sumP_1 | 0) > 0;
    if ($cmp36) {
      label = 18;
      break;
    } else {
      $pctP_0 = 0.0;
      $pctA_037 = $pctA_0;
      label = 19;
      break;
    }
   case 18:
    $conv39 = +($sumAP_1 | 0);
    $conv40 = +($sumP_1 | 0);
    $div41 = $conv39 / $conv40;
    $pctP_0 = $div41;
    $pctA_037 = $pctA_0;
    label = 19;
    break;
   case 19:
    HEAPF32[$result >> 2] = $pctA_037;
    $arrayidx44 = $result + 4 | 0;
    HEAPF32[$arrayidx44 >> 2] = $pctP_0;
    return;
  }
}
function _numRegionActiveColumns($region) {
  $region = $region | 0;
  var $numCols = 0, $0 = 0, $cmp5 = 0, $columns = 0, $1 = 0, $2 = 0, $c_07 = 0, $i_06 = 0, $isActive = 0, $3 = 0, $4 = 0, $cond = 0, $add = 0, $inc = 0, $cmp = 0, $c_0_lcssa = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp5 = ($0 | 0) > 0;
    if ($cmp5) {
      label = 3;
      break;
    } else {
      $c_0_lcssa = 0;
      label = 5;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $1 = HEAP32[$columns >> 2] | 0;
    $2 = HEAP32[$numCols >> 2] | 0;
    $i_06 = 0;
    $c_07 = 0;
    label = 4;
    break;
   case 4:
    $isActive = $1 + ($i_06 * 52 & -1) + 12 | 0;
    $3 = HEAP8[$isActive] | 0;
    $4 = $3 & 1;
    $cond = $4 & 255;
    $add = $cond + $c_07 | 0;
    $inc = $i_06 + 1 | 0;
    $cmp = ($inc | 0) < ($2 | 0);
    if ($cmp) {
      $i_06 = $inc;
      $c_07 = $add;
      label = 4;
      break;
    } else {
      $c_0_lcssa = $add;
      label = 5;
      break;
    }
   case 5:
    return $c_0_lcssa | 0;
  }
  return 0;
}
function _nextSegmentTimeStep($seg) {
  $seg = $seg | 0;
  var $isActive = 0, $0 = 0, $1 = 0, $wasActive = 0, $numActiveAllSyns = 0, $2 = 0, $numPrevActiveAllSyns = 0, $numActiveConnectedSyns = 0, $3 = 0, $numPrevActiveConnectedSyns = 0, $numSynapses = 0, $4 = 0, $cmp15 = 0, $synapses = 0, $i_016 = 0, $5 = 0, $isConnected = 0, $6 = 0, $7 = 0, $wasConnected = 0, $8 = 0, $isConnected8 = 0, $inc = 0, $9 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $isActive = $seg + 24 | 0;
    $0 = HEAP8[$isActive] | 0;
    $1 = $0 & 1;
    $wasActive = $seg + 25 | 0;
    HEAP8[$wasActive] = $1;
    HEAP8[$isActive] = 0;
    $numActiveAllSyns = $seg + 36 | 0;
    $2 = HEAP32[$numActiveAllSyns >> 2] | 0;
    $numPrevActiveAllSyns = $seg + 40 | 0;
    HEAP32[$numPrevActiveAllSyns >> 2] = $2;
    $numActiveConnectedSyns = $seg + 28 | 0;
    $3 = HEAP32[$numActiveConnectedSyns >> 2] | 0;
    $numPrevActiveConnectedSyns = $seg + 32 | 0;
    HEAP32[$numPrevActiveConnectedSyns >> 2] = $3;
    $numSynapses = $seg + 4 | 0;
    $4 = HEAP32[$numSynapses >> 2] | 0;
    $cmp15 = ($4 | 0) > 0;
    if ($cmp15) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $synapses = $seg | 0;
    $i_016 = 0;
    label = 4;
    break;
   case 4:
    $5 = HEAP32[$synapses >> 2] | 0;
    $isConnected = $5 + ($i_016 * 12 & -1) + 8 | 0;
    $6 = HEAP8[$isConnected] | 0;
    $7 = $6 & 1;
    $wasConnected = $5 + ($i_016 * 12 & -1) + 9 | 0;
    HEAP8[$wasConnected] = $7;
    $8 = HEAP32[$synapses >> 2] | 0;
    $isConnected8 = $8 + ($i_016 * 12 & -1) + 8 | 0;
    HEAP8[$isConnected8] = 0;
    $inc = $i_016 + 1 | 0;
    $9 = HEAP32[$numSynapses >> 2] | 0;
    $cmp = ($inc | 0) < ($9 | 0);
    if ($cmp) {
      $i_016 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    return;
  }
}
function _processSegment($seg) {
  $seg = $seg | 0;
  var $numSynapses = 0, $0 = 0, $cmp14 = 0, $synapses = 0, $i_017 = 0, $na_016 = 0, $nc_015 = 0, $1 = 0, $permanence = 0, $2 = 0, $cmp1 = 0, $isConnected = 0, $frombool = 0, $inputSource = 0, $3 = 0, $isActive = 0, $4 = 0, $5 = 0, $tobool = 0, $conv = 0, $add = 0, $inc = 0, $nc_1 = 0, $na_1 = 0, $inc4 = 0, $6 = 0, $cmp = 0, $na_0_lcssa = 0, $nc_0_lcssa = 0, $numActiveConnectedSyns = 0, $numActiveAllSyns = 0, $7 = 0, $segActiveThreshold = 0, $8 = 0, $cmp6 = 0, $isActive8 = 0, $frombool9 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSynapses = $seg + 4 | 0;
    $0 = HEAP32[$numSynapses >> 2] | 0;
    $cmp14 = ($0 | 0) > 0;
    if ($cmp14) {
      label = 3;
      break;
    } else {
      $nc_0_lcssa = 0;
      $na_0_lcssa = 0;
      label = 7;
      break;
    }
   case 3:
    $synapses = $seg | 0;
    $nc_015 = 0;
    $na_016 = 0;
    $i_017 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$synapses >> 2] | 0;
    $permanence = $1 + ($i_017 * 12 & -1) + 4 | 0;
    $2 = HEAP32[$permanence >> 2] | 0;
    $cmp1 = ($2 | 0) > 1999;
    $isConnected = $1 + ($i_017 * 12 & -1) + 8 | 0;
    $frombool = $cmp1 & 1;
    HEAP8[$isConnected] = $frombool;
    $inputSource = $1 + ($i_017 * 12 & -1) | 0;
    $3 = HEAP32[$inputSource >> 2] | 0;
    $isActive = $3 + 20 | 0;
    $4 = HEAP8[$isActive] | 0;
    $5 = $4 & 1;
    $tobool = $5 << 24 >> 24 == 0;
    if ($tobool) {
      $na_1 = $na_016;
      $nc_1 = $nc_015;
      label = 6;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $conv = $cmp1 & 1;
    $add = $conv + $nc_015 | 0;
    $inc = $na_016 + 1 | 0;
    $na_1 = $inc;
    $nc_1 = $add;
    label = 6;
    break;
   case 6:
    $inc4 = $i_017 + 1 | 0;
    $6 = HEAP32[$numSynapses >> 2] | 0;
    $cmp = ($inc4 | 0) < ($6 | 0);
    if ($cmp) {
      $nc_015 = $nc_1;
      $na_016 = $na_1;
      $i_017 = $inc4;
      label = 4;
      break;
    } else {
      $nc_0_lcssa = $nc_1;
      $na_0_lcssa = $na_1;
      label = 7;
      break;
    }
   case 7:
    $numActiveConnectedSyns = $seg + 28 | 0;
    HEAP32[$numActiveConnectedSyns >> 2] = $nc_0_lcssa;
    $numActiveAllSyns = $seg + 36 | 0;
    HEAP32[$numActiveAllSyns >> 2] = $na_0_lcssa;
    $7 = HEAP32[$numActiveConnectedSyns >> 2] | 0;
    $segActiveThreshold = $seg + 20 | 0;
    $8 = HEAP32[$segActiveThreshold >> 2] | 0;
    $cmp6 = ($7 | 0) >= ($8 | 0);
    $isActive8 = $seg + 24 | 0;
    $frombool9 = $cmp6 & 1;
    HEAP8[$isActive8] = $frombool9;
    return;
  }
}
function _setNumPredictionSteps($seg, $steps) {
  $seg = $seg | 0;
  $steps = $steps | 0;
  var $_steps = 0, $steps_addr_1 = 0;
  $_steps = ($steps | 0) < 1 ? 1 : $steps;
  $steps_addr_1 = ($_steps | 0) > 10 ? 10 : $_steps;
  HEAP32[$seg + 16 >> 2] = $steps_addr_1;
  HEAP8[$seg + 12 | 0] = ($steps_addr_1 | 0) == 1 & 1;
  return;
}
function _numRegionSegments($region, $predictionSteps) {
  $region = $region | 0;
  $predictionSteps = $predictionSteps | 0;
  var $numCols = 0, $0 = 0, $cmp11 = 0, $columns = 0, $1 = 0, $2 = 0, $c_013 = 0, $i_012 = 0, $numCells = 0, $3 = 0, $cmp28 = 0, $cells = 0, $4 = 0, $5 = 0, $c_110 = 0, $j_09 = 0, $arrayidx4 = 0, $call = 0, $add = 0, $inc = 0, $cmp2 = 0, $c_1_lcssa = 0, $inc6 = 0, $cmp = 0, $c_0_lcssa = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp11 = ($0 | 0) > 0;
    if ($cmp11) {
      label = 3;
      break;
    } else {
      $c_0_lcssa = 0;
      label = 8;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $1 = HEAP32[$columns >> 2] | 0;
    $2 = HEAP32[$numCols >> 2] | 0;
    $i_012 = 0;
    $c_013 = 0;
    label = 4;
    break;
   case 4:
    $numCells = $1 + ($i_012 * 52 & -1) + 8 | 0;
    $3 = HEAP32[$numCells >> 2] | 0;
    $cmp28 = ($3 | 0) > 0;
    if ($cmp28) {
      label = 5;
      break;
    } else {
      $c_1_lcssa = $c_013;
      label = 7;
      break;
    }
   case 5:
    $cells = $1 + ($i_012 * 52 & -1) + 4 | 0;
    $4 = HEAP32[$cells >> 2] | 0;
    $5 = HEAP32[$numCells >> 2] | 0;
    $j_09 = 0;
    $c_110 = $c_013;
    label = 6;
    break;
   case 6:
    $arrayidx4 = $4 + ($j_09 * 52 & -1) | 0;
    $call = _numCellSegments($arrayidx4, $predictionSteps) | 0;
    $add = $call + $c_110 | 0;
    $inc = $j_09 + 1 | 0;
    $cmp2 = ($inc | 0) < ($5 | 0);
    if ($cmp2) {
      $j_09 = $inc;
      $c_110 = $add;
      label = 6;
      break;
    } else {
      $c_1_lcssa = $add;
      label = 7;
      break;
    }
   case 7:
    $inc6 = $i_012 + 1 | 0;
    $cmp = ($inc6 | 0) < ($2 | 0);
    if ($cmp) {
      $i_012 = $inc6;
      $c_013 = $c_1_lcssa;
      label = 4;
      break;
    } else {
      $c_0_lcssa = $c_1_lcssa;
      label = 8;
      break;
    }
   case 8:
    return $c_0_lcssa | 0;
  }
  return 0;
}
function _isWithinKthScore($region, $col, $k) {
  $region = $region | 0;
  $col = $col | 0;
  $k = $k | 0;
  var $inhibitionRadius = 0, $0 = 0.0, $roundf = 0.0, $conv1 = 0, $cx = 0, $1 = 0, $sub = 0, $sub3 = 0, $cmp = 0, $sub_sub3 = 0, $cmp9 = 0, $_sub_sub3 = 0, $cy = 0, $2 = 0, $sub29 = 0, $sub31 = 0, $cmp32 = 0, $sub29_sub31 = 0, $cmp42 = 0, $cond61 = 0, $width = 0, $3 = 0, $4 = 0, $add = 0, $add64 = 0, $cmp65 = 0, $add_add64 = 0, $cmp75 = 0, $_add_add64 = 0, $height = 0, $5 = 0, $6 = 0, $add97 = 0, $add99 = 0, $cmp100 = 0, $add97_add99 = 0, $cmp110 = 0, $cond130 = 0, $7 = 0, $add132 = 0, $cmp133 = 0, $_add132 = 0, $8 = 0, $add142 = 0, $cmp143 = 0, $cond150 = 0, $cmp15162 = 0, $cmp15459 = 0, $columns = 0, $overlap159 = 0, $c_064 = 0, $x_063 = 0, $9 = 0, $10 = 0, $11 = 0, $c_161 = 0, $y_060 = 0, $mul = 0, $add158 = 0, $overlap = 0, $12 = 0, $cmp160 = 0, $conv161 = 0, $add162 = 0, $inc = 0, $cmp154 = 0, $c_1_lcssa = 0, $inc164 = 0, $cmp151 = 0, $c_0_lcssa = 0, $cmp166 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $inhibitionRadius = $region + 68 | 0;
    $0 = +HEAPF32[$inhibitionRadius >> 2];
    $roundf = +_round(+$0);
    $conv1 = ~~$roundf;
    $cx = $col + 44 | 0;
    $1 = HEAP32[$cx >> 2] | 0;
    $sub = $1 - 1 | 0;
    $sub3 = $1 - $conv1 | 0;
    $cmp = ($sub | 0) < ($sub3 | 0);
    $sub_sub3 = $cmp ? $sub : $sub3;
    $cmp9 = ($sub_sub3 | 0) < 0;
    $_sub_sub3 = $cmp9 ? 0 : $sub_sub3;
    $cy = $col + 48 | 0;
    $2 = HEAP32[$cy >> 2] | 0;
    $sub29 = $2 - 1 | 0;
    $sub31 = $2 - $conv1 | 0;
    $cmp32 = ($sub29 | 0) < ($sub31 | 0);
    $sub29_sub31 = $cmp32 ? $sub29 : $sub31;
    $cmp42 = ($sub29_sub31 | 0) < 0;
    $cond61 = $cmp42 ? 0 : $sub29_sub31;
    $width = $region + 40 | 0;
    $3 = HEAP32[$width >> 2] | 0;
    $4 = HEAP32[$cx >> 2] | 0;
    $add = $4 + 1 | 0;
    $add64 = $4 + $conv1 | 0;
    $cmp65 = ($add | 0) > ($add64 | 0);
    $add_add64 = $cmp65 ? $add : $add64;
    $cmp75 = ($3 | 0) < ($add_add64 | 0);
    $_add_add64 = $cmp75 ? $3 : $add_add64;
    $height = $region + 44 | 0;
    $5 = HEAP32[$height >> 2] | 0;
    $6 = HEAP32[$cy >> 2] | 0;
    $add97 = $6 + 1 | 0;
    $add99 = $6 + $conv1 | 0;
    $cmp100 = ($add97 | 0) > ($add99 | 0);
    $add97_add99 = $cmp100 ? $add97 : $add99;
    $cmp110 = ($5 | 0) < ($add97_add99 | 0);
    $cond130 = $cmp110 ? $5 : $add97_add99;
    $7 = HEAP32[$width >> 2] | 0;
    $add132 = $_add_add64 + 1 | 0;
    $cmp133 = ($7 | 0) < ($add132 | 0);
    $_add132 = $cmp133 ? $7 : $add132;
    $8 = HEAP32[$height >> 2] | 0;
    $add142 = $cond130 + 1 | 0;
    $cmp143 = ($8 | 0) < ($add142 | 0);
    $cond150 = $cmp143 ? $8 : $add142;
    $cmp15162 = ($_sub_sub3 | 0) < ($_add132 | 0);
    if ($cmp15162) {
      label = 3;
      break;
    } else {
      $c_0_lcssa = 0;
      label = 8;
      break;
    }
   case 3:
    $cmp15459 = ($cond61 | 0) < ($cond150 | 0);
    $columns = $region + 56 | 0;
    $overlap159 = $col + 32 | 0;
    $x_063 = $_sub_sub3;
    $c_064 = 0;
    label = 4;
    break;
   case 4:
    if ($cmp15459) {
      label = 5;
      break;
    } else {
      $c_1_lcssa = $c_064;
      label = 7;
      break;
    }
   case 5:
    $9 = HEAP32[$width >> 2] | 0;
    $10 = HEAP32[$columns >> 2] | 0;
    $11 = HEAP32[$overlap159 >> 2] | 0;
    $y_060 = $cond61;
    $c_161 = $c_064;
    label = 6;
    break;
   case 6:
    $mul = Math_imul($9, $y_060);
    $add158 = $mul + $x_063 | 0;
    $overlap = $10 + ($add158 * 52 & -1) + 32 | 0;
    $12 = HEAP32[$overlap >> 2] | 0;
    $cmp160 = ($12 | 0) > ($11 | 0);
    $conv161 = $cmp160 & 1;
    $add162 = $conv161 + $c_161 | 0;
    $inc = $y_060 + 1 | 0;
    $cmp154 = ($inc | 0) < ($cond150 | 0);
    if ($cmp154) {
      $y_060 = $inc;
      $c_161 = $add162;
      label = 6;
      break;
    } else {
      $c_1_lcssa = $add162;
      label = 7;
      break;
    }
   case 7:
    $inc164 = $x_063 + 1 | 0;
    $cmp151 = ($inc164 | 0) < ($_add132 | 0);
    if ($cmp151) {
      $x_063 = $inc164;
      $c_064 = $c_1_lcssa;
      label = 4;
      break;
    } else {
      $c_0_lcssa = $c_1_lcssa;
      label = 8;
      break;
    }
   case 8:
    $cmp166 = ($c_0_lcssa | 0) < ($k | 0);
    return $cmp166 | 0;
  }
  return 0;
}
function _performSpatialPooling($region) {
  $region = $region | 0;
  var $spatialHardcoded = 0, $0 = 0, $1 = 0, $tobool = 0, $numCols = 0, $2 = 0, $cmp42 = 0, $inputData = 0, $columns = 0, $nInput = 0, $3 = 0, $cmp540 = 0, $inputData8 = 0, $inputCells = 0, $i_043 = 0, $4 = 0, $arrayidx = 0, $5 = 0, $cmp1 = 0, $6 = 0, $isActive = 0, $frombool = 0, $inc = 0, $7 = 0, $cmp = 0, $numCols20 = 0, $8 = 0, $cmp2138 = 0, $columns24 = 0, $i_141 = 0, $9 = 0, $arrayidx9 = 0, $10 = 0, $cmp11 = 0, $11 = 0, $isActive14 = 0, $frombool15 = 0, $inc17 = 0, $12 = 0, $cmp5 = 0, $cmp3136 = 0, $columns34 = 0, $desiredLocalActivity = 0, $spatialLearning = 0, $spatialLearning47 = 0, $i_239 = 0, $13 = 0, $arrayidx25 = 0, $inc27 = 0, $14 = 0, $cmp21 = 0, $i_337 = 0, $15 = 0, $arrayidx35 = 0, $isActive36 = 0, $overlap = 0, $16 = 0, $cmp37 = 0, $17 = 0, $call = 0, $18 = 0, $19 = 0, $tobool42 = 0, $20 = 0, $21 = 0, $tobool48 = 0, $inc52 = 0, $22 = 0, $cmp31 = 0, $spatialLearning54 = 0, $23 = 0, $24 = 0, $tobool55 = 0, $call57 = 0.0, $inhibitionRadius = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $spatialHardcoded = $region + 36 | 0;
    $0 = HEAP8[$spatialHardcoded] | 0;
    $1 = $0 & 1;
    $tobool = $1 << 24 >> 24 == 0;
    if ($tobool) {
      label = 5;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $numCols = $region + 60 | 0;
    $2 = HEAP32[$numCols >> 2] | 0;
    $cmp42 = ($2 | 0) > 0;
    if ($cmp42) {
      label = 4;
      break;
    } else {
      label = 23;
      break;
    }
   case 4:
    $inputData = $region + 76 | 0;
    $columns = $region + 56 | 0;
    $i_043 = 0;
    label = 7;
    break;
   case 5:
    $nInput = $region + 80 | 0;
    $3 = HEAP32[$nInput >> 2] | 0;
    $cmp540 = ($3 | 0) > 0;
    if ($cmp540) {
      label = 6;
      break;
    } else {
      label = 8;
      break;
    }
   case 6:
    $inputData8 = $region + 76 | 0;
    $inputCells = $region + 84 | 0;
    $i_141 = 0;
    label = 10;
    break;
   case 7:
    $4 = HEAP32[$inputData >> 2] | 0;
    $arrayidx = $4 + $i_043 | 0;
    $5 = HEAP8[$arrayidx] | 0;
    $cmp1 = $5 << 24 >> 24 == 1;
    $6 = HEAP32[$columns >> 2] | 0;
    $isActive = $6 + ($i_043 * 52 & -1) + 12 | 0;
    $frombool = $cmp1 & 1;
    HEAP8[$isActive] = $frombool;
    $inc = $i_043 + 1 | 0;
    $7 = HEAP32[$numCols >> 2] | 0;
    $cmp = ($inc | 0) < ($7 | 0);
    if ($cmp) {
      $i_043 = $inc;
      label = 7;
      break;
    } else {
      label = 23;
      break;
    }
   case 8:
    $numCols20 = $region + 60 | 0;
    $8 = HEAP32[$numCols20 >> 2] | 0;
    $cmp2138 = ($8 | 0) > 0;
    if ($cmp2138) {
      label = 9;
      break;
    } else {
      label = 21;
      break;
    }
   case 9:
    $columns24 = $region + 56 | 0;
    $i_239 = 0;
    label = 13;
    break;
   case 10:
    $9 = HEAP32[$inputData8 >> 2] | 0;
    $arrayidx9 = $9 + $i_141 | 0;
    $10 = HEAP8[$arrayidx9] | 0;
    $cmp11 = $10 << 24 >> 24 == 1;
    $11 = HEAP32[$inputCells >> 2] | 0;
    $isActive14 = $11 + ($i_141 * 52 & -1) + 20 | 0;
    $frombool15 = $cmp11 & 1;
    HEAP8[$isActive14] = $frombool15;
    $inc17 = $i_141 + 1 | 0;
    $12 = HEAP32[$nInput >> 2] | 0;
    $cmp5 = ($inc17 | 0) < ($12 | 0);
    if ($cmp5) {
      $i_141 = $inc17;
      label = 10;
      break;
    } else {
      label = 8;
      break;
    }
   case 11:
    $cmp3136 = ($14 | 0) > 0;
    if ($cmp3136) {
      label = 12;
      break;
    } else {
      label = 21;
      break;
    }
   case 12:
    $columns34 = $region + 56 | 0;
    $desiredLocalActivity = $region + 72 | 0;
    $spatialLearning = $region + 37 | 0;
    $spatialLearning47 = $region + 37 | 0;
    $i_337 = 0;
    label = 14;
    break;
   case 13:
    $13 = HEAP32[$columns24 >> 2] | 0;
    $arrayidx25 = $13 + ($i_239 * 52 & -1) | 0;
    _computeOverlap($arrayidx25);
    $inc27 = $i_239 + 1 | 0;
    $14 = HEAP32[$numCols20 >> 2] | 0;
    $cmp21 = ($inc27 | 0) < ($14 | 0);
    if ($cmp21) {
      $i_239 = $inc27;
      label = 13;
      break;
    } else {
      label = 11;
      break;
    }
   case 14:
    $15 = HEAP32[$columns34 >> 2] | 0;
    $arrayidx35 = $15 + ($i_337 * 52 & -1) | 0;
    $isActive36 = $15 + ($i_337 * 52 & -1) + 12 | 0;
    HEAP8[$isActive36] = 0;
    $overlap = $15 + ($i_337 * 52 & -1) + 32 | 0;
    $16 = HEAP32[$overlap >> 2] | 0;
    $cmp37 = ($16 | 0) > 0;
    if ($cmp37) {
      label = 15;
      break;
    } else {
      label = 18;
      break;
    }
   case 15:
    $17 = HEAP32[$desiredLocalActivity >> 2] | 0;
    $call = _isWithinKthScore($region, $arrayidx35, $17) | 0;
    if ($call) {
      label = 16;
      break;
    } else {
      label = 18;
      break;
    }
   case 16:
    HEAP8[$isActive36] = 1;
    $18 = HEAP8[$spatialLearning] | 0;
    $19 = $18 & 1;
    $tobool42 = $19 << 24 >> 24 == 0;
    if ($tobool42) {
      label = 18;
      break;
    } else {
      label = 17;
      break;
    }
   case 17:
    _updateColumnPermanences($arrayidx35);
    label = 18;
    break;
   case 18:
    $20 = HEAP8[$spatialLearning47] | 0;
    $21 = $20 & 1;
    $tobool48 = $21 << 24 >> 24 == 0;
    if ($tobool48) {
      label = 20;
      break;
    } else {
      label = 19;
      break;
    }
   case 19:
    _performBoosting($arrayidx35);
    label = 20;
    break;
   case 20:
    $inc52 = $i_337 + 1 | 0;
    $22 = HEAP32[$numCols20 >> 2] | 0;
    $cmp31 = ($inc52 | 0) < ($22 | 0);
    if ($cmp31) {
      $i_337 = $inc52;
      label = 14;
      break;
    } else {
      label = 21;
      break;
    }
   case 21:
    $spatialLearning54 = $region + 37 | 0;
    $23 = HEAP8[$spatialLearning54] | 0;
    $24 = $23 & 1;
    $tobool55 = $24 << 24 >> 24 == 0;
    if ($tobool55) {
      label = 23;
      break;
    } else {
      label = 22;
      break;
    }
   case 22:
    $call57 = +_averageReceptiveFieldSize($region);
    $inhibitionRadius = $region + 68 | 0;
    HEAPF32[$inhibitionRadius >> 2] = $call57;
    label = 23;
    break;
   case 23:
    return;
  }
}
function _performTemporalPooling($region) {
  $region = $region | 0;
  var $bestSeg = 0, $bestSegID = 0, $predSegID = 0, $numCols = 0, $0 = 0, $cmp94 = 0, $columns = 0, $temporalLearning30 = 0, $temporalLearning = 0, $cmp4582 = 0, $columns49 = 0, $temporalLearning75 = 0, $temporalLearning84 = 0, $i_095 = 0, $1 = 0, $arrayidx = 0, $isActive = 0, $2 = 0, $3 = 0, $tobool = 0, $numCells = 0, $4 = 0, $cmp285 = 0, $cells = 0, $buPredicted_0_off088 = 0, $learningCellChosen_0_off087 = 0, $c_086 = 0, $5 = 0, $wasPredicted = 0, $6 = 0, $7 = 0, $tobool5 = 0, $arrayidx4 = 0, $call = 0, $cmp7 = 0, $isSequence = 0, $8 = 0, $9 = 0, $tobool8 = 0, $isActive10 = 0, $10 = 0, $11 = 0, $tobool11 = 0, $call13 = 0, $isLearning = 0, $learningCellChosen_1_off0 = 0, $buPredicted_1_off0 = 0, $inc = 0, $12 = 0, $cmp2 = 0, $_pr = 0, $cmp2192 = 0, $cells23 = 0, $c_193 = 0, $13 = 0, $isActive25 = 0, $inc27 = 0, $14 = 0, $cmp21 = 0, $learningCellChosen_0_off0_lcssa101 = 0, $15 = 0, $16 = 0, $tobool31 = 0, $brmerge = 0, $call35 = 0, $isLearning36 = 0, $17 = 0, $call37 = 0, $numPredictionSteps = 0, $inc41 = 0, $18 = 0, $cmp = 0, $i_183 = 0, $19 = 0, $numCells5179 = 0, $20 = 0, $cmp5280 = 0, $21 = 0, $c47_081 = 0, $cells57 = 0, $22 = 0, $arrayidx58 = 0, $numSegments = 0, $23 = 0, $cmp6076 = 0, $segments = 0, $s_077 = 0, $24 = 0, $arrayidx62 = 0, $inc64 = 0, $25 = 0, $cmp60 = 0, $26 = 0, $segments70 = 0, $s_1 = 0, $cmp68 = 0, $27 = 0, $isActive72 = 0, $28 = 0, $29 = 0, $tobool73 = 0, $inc82 = 0, $30 = 0, $31 = 0, $tobool76 = 0, $call78 = 0, $32 = 0, $33 = 0, $tobool85 = 0, $isPredicting = 0, $34 = 0, $35 = 0, $tobool87 = 0, $call89 = 0, $36 = 0, $call90 = 0, $cmp91 = 0, $predictionSteps = 0, $37 = 0, $add = 0, $numPredictionSteps93 = 0, $inc97 = 0, $38 = 0, $numCells51 = 0, $39 = 0, $cmp52 = 0, $inc100 = 0, $40 = 0, $cmp45 = 0, $temporalLearning102 = 0, $41 = 0, $42 = 0, $tobool103 = 0, $43 = 0, $cmp10873 = 0, $columns112 = 0, $i_274 = 0, $44 = 0, $numCells11470 = 0, $45 = 0, $cmp11571 = 0, $46 = 0, $c110_072 = 0, $cells120 = 0, $47 = 0, $arrayidx121 = 0, $isLearning122 = 0, $48 = 0, $49 = 0, $tobool123 = 0, $isPredicting125 = 0, $50 = 0, $51 = 0, $tobool126 = 0, $wasPredicted128 = 0, $52 = 0, $53 = 0, $tobool129 = 0, $inc134 = 0, $54 = 0, $numCells114 = 0, $55 = 0, $cmp115 = 0, $inc137 = 0, $56 = 0, $cmp108 = 0, label = 0, __stackBase__ = 0;
  __stackBase__ = STACKTOP;
  STACKTOP = STACKTOP + 24 | 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $bestSeg = __stackBase__ | 0;
    $bestSegID = __stackBase__ + 8 | 0;
    $predSegID = __stackBase__ + 16 | 0;
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp94 = ($0 | 0) > 0;
    if ($cmp94) {
      label = 3;
      break;
    } else {
      label = 38;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $temporalLearning30 = $region + 38 | 0;
    $temporalLearning = $region + 38 | 0;
    $i_095 = 0;
    label = 6;
    break;
   case 4:
    $cmp4582 = ($18 | 0) > 0;
    if ($cmp4582) {
      label = 5;
      break;
    } else {
      label = 38;
      break;
    }
   case 5:
    $columns49 = $region + 56 | 0;
    $temporalLearning75 = $region + 38 | 0;
    $temporalLearning84 = $region + 38 | 0;
    $i_183 = 0;
    label = 23;
    break;
   case 6:
    $1 = HEAP32[$columns >> 2] | 0;
    $arrayidx = $1 + ($i_095 * 52 & -1) | 0;
    $isActive = $1 + ($i_095 * 52 & -1) + 12 | 0;
    $2 = HEAP8[$isActive] | 0;
    $3 = $2 & 1;
    $tobool = $3 << 24 >> 24 == 0;
    if ($tobool) {
      label = 22;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $numCells = $1 + ($i_095 * 52 & -1) + 8 | 0;
    $4 = HEAP32[$numCells >> 2] | 0;
    $cmp285 = ($4 | 0) > 0;
    if ($cmp285) {
      label = 8;
      break;
    } else {
      $learningCellChosen_0_off0_lcssa101 = 0;
      label = 20;
      break;
    }
   case 8:
    $cells = $1 + ($i_095 * 52 & -1) + 4 | 0;
    $c_086 = 0;
    $learningCellChosen_0_off087 = 0;
    $buPredicted_0_off088 = 0;
    label = 9;
    break;
   case 9:
    $5 = HEAP32[$cells >> 2] | 0;
    $wasPredicted = $5 + ($c_086 * 52 & -1) + 23 | 0;
    $6 = HEAP8[$wasPredicted] | 0;
    $7 = $6 & 1;
    $tobool5 = $7 << 24 >> 24 == 0;
    if ($tobool5) {
      $buPredicted_1_off0 = $buPredicted_0_off088;
      $learningCellChosen_1_off0 = $learningCellChosen_0_off087;
      label = 15;
      break;
    } else {
      label = 10;
      break;
    }
   case 10:
    $arrayidx4 = $5 + ($c_086 * 52 & -1) | 0;
    $call = _getPreviousActiveSegment($arrayidx4) | 0;
    $cmp7 = ($call | 0) == 0;
    if ($cmp7) {
      $buPredicted_1_off0 = $buPredicted_0_off088;
      $learningCellChosen_1_off0 = $learningCellChosen_0_off087;
      label = 15;
      break;
    } else {
      label = 11;
      break;
    }
   case 11:
    $isSequence = $call + 12 | 0;
    $8 = HEAP8[$isSequence] | 0;
    $9 = $8 & 1;
    $tobool8 = $9 << 24 >> 24 == 0;
    if ($tobool8) {
      $buPredicted_1_off0 = $buPredicted_0_off088;
      $learningCellChosen_1_off0 = $learningCellChosen_0_off087;
      label = 15;
      break;
    } else {
      label = 12;
      break;
    }
   case 12:
    $isActive10 = $5 + ($c_086 * 52 & -1) + 20 | 0;
    HEAP8[$isActive10] = 1;
    $10 = HEAP8[$temporalLearning] | 0;
    $11 = $10 & 1;
    $tobool11 = $11 << 24 >> 24 == 0;
    if ($tobool11) {
      $buPredicted_1_off0 = 1;
      $learningCellChosen_1_off0 = $learningCellChosen_0_off087;
      label = 15;
      break;
    } else {
      label = 13;
      break;
    }
   case 13:
    $call13 = _wasSegmentActiveFromLearning($call) | 0;
    if ($call13) {
      label = 14;
      break;
    } else {
      $buPredicted_1_off0 = 1;
      $learningCellChosen_1_off0 = $learningCellChosen_0_off087;
      label = 15;
      break;
    }
   case 14:
    $isLearning = $5 + ($c_086 * 52 & -1) + 24 | 0;
    HEAP8[$isLearning] = 1;
    $buPredicted_1_off0 = 1;
    $learningCellChosen_1_off0 = 1;
    label = 15;
    break;
   case 15:
    $inc = $c_086 + 1 | 0;
    $12 = HEAP32[$numCells >> 2] | 0;
    $cmp2 = ($inc | 0) < ($12 | 0);
    if ($cmp2) {
      $c_086 = $inc;
      $learningCellChosen_0_off087 = $learningCellChosen_1_off0;
      $buPredicted_0_off088 = $buPredicted_1_off0;
      label = 9;
      break;
    } else {
      label = 16;
      break;
    }
   case 16:
    if ($buPredicted_1_off0) {
      $learningCellChosen_0_off0_lcssa101 = $learningCellChosen_1_off0;
      label = 20;
      break;
    } else {
      label = 17;
      break;
    }
   case 17:
    $_pr = HEAP32[$numCells >> 2] | 0;
    $cmp2192 = ($_pr | 0) > 0;
    if ($cmp2192) {
      label = 18;
      break;
    } else {
      $learningCellChosen_0_off0_lcssa101 = $learningCellChosen_1_off0;
      label = 20;
      break;
    }
   case 18:
    $cells23 = $1 + ($i_095 * 52 & -1) + 4 | 0;
    $c_193 = 0;
    label = 19;
    break;
   case 19:
    $13 = HEAP32[$cells23 >> 2] | 0;
    $isActive25 = $13 + ($c_193 * 52 & -1) + 20 | 0;
    HEAP8[$isActive25] = 1;
    $inc27 = $c_193 + 1 | 0;
    $14 = HEAP32[$numCells >> 2] | 0;
    $cmp21 = ($inc27 | 0) < ($14 | 0);
    if ($cmp21) {
      $c_193 = $inc27;
      label = 19;
      break;
    } else {
      $learningCellChosen_0_off0_lcssa101 = $learningCellChosen_1_off0;
      label = 20;
      break;
    }
   case 20:
    $15 = HEAP8[$temporalLearning30] | 0;
    $16 = $15 & 1;
    $tobool31 = $16 << 24 >> 24 == 0;
    $brmerge = $tobool31 | $learningCellChosen_0_off0_lcssa101;
    if ($brmerge) {
      label = 22;
      break;
    } else {
      label = 21;
      break;
    }
   case 21:
    HEAP32[$bestSeg >> 2] = 0;
    HEAP32[$bestSegID >> 2] = -1;
    $call35 = _getBestMatchingCell($arrayidx, $bestSeg, $bestSegID, 1, 1) | 0;
    $isLearning36 = $call35 + 24 | 0;
    HEAP8[$isLearning36] = 1;
    $17 = HEAP32[$bestSegID >> 2] | 0;
    $call37 = _updateSegmentActiveSynapses($call35, 1, $17, 1) | 0;
    $numPredictionSteps = $call37 + 8 | 0;
    HEAP32[$numPredictionSteps >> 2] = 1;
    label = 22;
    break;
   case 22:
    $inc41 = $i_095 + 1 | 0;
    $18 = HEAP32[$numCols >> 2] | 0;
    $cmp = ($inc41 | 0) < ($18 | 0);
    if ($cmp) {
      $i_095 = $inc41;
      label = 6;
      break;
    } else {
      label = 4;
      break;
    }
   case 23:
    $19 = HEAP32[$columns49 >> 2] | 0;
    $numCells5179 = $19 + ($i_183 * 52 & -1) + 8 | 0;
    $20 = HEAP32[$numCells5179 >> 2] | 0;
    $cmp5280 = ($20 | 0) > 0;
    if ($cmp5280) {
      $c47_081 = 0;
      $21 = $19;
      label = 24;
      break;
    } else {
      label = 37;
      break;
    }
   case 24:
    $cells57 = $21 + ($i_183 * 52 & -1) + 4 | 0;
    $22 = HEAP32[$cells57 >> 2] | 0;
    $arrayidx58 = $22 + ($c47_081 * 52 & -1) | 0;
    $numSegments = $22 + ($c47_081 * 52 & -1) + 32 | 0;
    $23 = HEAP32[$numSegments >> 2] | 0;
    $cmp6076 = ($23 | 0) > 0;
    if ($cmp6076) {
      label = 25;
      break;
    } else {
      label = 27;
      break;
    }
   case 25:
    $segments = $22 + ($c47_081 * 52 & -1) + 28 | 0;
    $s_077 = 0;
    label = 26;
    break;
   case 26:
    $24 = HEAP32[$segments >> 2] | 0;
    $arrayidx62 = $24 + ($s_077 * 44 & -1) | 0;
    _processSegment($arrayidx62);
    $inc64 = $s_077 + 1 | 0;
    $25 = HEAP32[$numSegments >> 2] | 0;
    $cmp60 = ($inc64 | 0) < ($25 | 0);
    if ($cmp60) {
      $s_077 = $inc64;
      label = 26;
      break;
    } else {
      label = 27;
      break;
    }
   case 27:
    $26 = HEAP32[$numSegments >> 2] | 0;
    $segments70 = $22 + ($c47_081 * 52 & -1) + 28 | 0;
    $s_1 = 0;
    label = 28;
    break;
   case 28:
    $cmp68 = ($s_1 | 0) < ($26 | 0);
    if ($cmp68) {
      label = 29;
      break;
    } else {
      label = 32;
      break;
    }
   case 29:
    $27 = HEAP32[$segments70 >> 2] | 0;
    $isActive72 = $27 + ($s_1 * 44 & -1) + 24 | 0;
    $28 = HEAP8[$isActive72] | 0;
    $29 = $28 & 1;
    $tobool73 = $29 << 24 >> 24 == 0;
    $inc82 = $s_1 + 1 | 0;
    if ($tobool73) {
      $s_1 = $inc82;
      label = 28;
      break;
    } else {
      label = 30;
      break;
    }
   case 30:
    _setCellPredicting($arrayidx58, 1);
    $30 = HEAP8[$temporalLearning75] | 0;
    $31 = $30 & 1;
    $tobool76 = $31 << 24 >> 24 == 0;
    if ($tobool76) {
      label = 32;
      break;
    } else {
      label = 31;
      break;
    }
   case 31:
    $call78 = _updateSegmentActiveSynapses($arrayidx58, 0, $s_1, 0) | 0;
    label = 32;
    break;
   case 32:
    $32 = HEAP8[$temporalLearning84] | 0;
    $33 = $32 & 1;
    $tobool85 = $33 << 24 >> 24 == 0;
    if ($tobool85) {
      label = 36;
      break;
    } else {
      label = 33;
      break;
    }
   case 33:
    $isPredicting = $22 + ($c47_081 * 52 & -1) + 22 | 0;
    $34 = HEAP8[$isPredicting] | 0;
    $35 = $34 & 1;
    $tobool87 = $35 << 24 >> 24 == 0;
    if ($tobool87) {
      label = 36;
      break;
    } else {
      label = 34;
      break;
    }
   case 34:
    HEAP32[$predSegID >> 2] = -1;
    $call89 = _getBestMatchingPreviousSegment($arrayidx58, $predSegID) | 0;
    $36 = HEAP32[$predSegID >> 2] | 0;
    $call90 = _updateSegmentActiveSynapses($arrayidx58, 1, $36, 1) | 0;
    $cmp91 = ($call89 | 0) == 0;
    if ($cmp91) {
      label = 35;
      break;
    } else {
      label = 36;
      break;
    }
   case 35:
    $predictionSteps = $22 + ($c47_081 * 52 & -1) + 16 | 0;
    $37 = HEAP32[$predictionSteps >> 2] | 0;
    $add = $37 + 1 | 0;
    $numPredictionSteps93 = $call90 + 8 | 0;
    HEAP32[$numPredictionSteps93 >> 2] = $add;
    label = 36;
    break;
   case 36:
    $inc97 = $c47_081 + 1 | 0;
    $38 = HEAP32[$columns49 >> 2] | 0;
    $numCells51 = $38 + ($i_183 * 52 & -1) + 8 | 0;
    $39 = HEAP32[$numCells51 >> 2] | 0;
    $cmp52 = ($inc97 | 0) < ($39 | 0);
    if ($cmp52) {
      $c47_081 = $inc97;
      $21 = $38;
      label = 24;
      break;
    } else {
      label = 37;
      break;
    }
   case 37:
    $inc100 = $i_183 + 1 | 0;
    $40 = HEAP32[$numCols >> 2] | 0;
    $cmp45 = ($inc100 | 0) < ($40 | 0);
    if ($cmp45) {
      $i_183 = $inc100;
      label = 23;
      break;
    } else {
      label = 38;
      break;
    }
   case 38:
    $temporalLearning102 = $region + 38 | 0;
    $41 = HEAP8[$temporalLearning102] | 0;
    $42 = $41 & 1;
    $tobool103 = $42 << 24 >> 24 == 0;
    if ($tobool103) {
      label = 49;
      break;
    } else {
      label = 39;
      break;
    }
   case 39:
    $43 = HEAP32[$numCols >> 2] | 0;
    $cmp10873 = ($43 | 0) > 0;
    if ($cmp10873) {
      label = 40;
      break;
    } else {
      label = 49;
      break;
    }
   case 40:
    $columns112 = $region + 56 | 0;
    $i_274 = 0;
    label = 41;
    break;
   case 41:
    $44 = HEAP32[$columns112 >> 2] | 0;
    $numCells11470 = $44 + ($i_274 * 52 & -1) + 8 | 0;
    $45 = HEAP32[$numCells11470 >> 2] | 0;
    $cmp11571 = ($45 | 0) > 0;
    if ($cmp11571) {
      $c110_072 = 0;
      $46 = $44;
      label = 42;
      break;
    } else {
      label = 48;
      break;
    }
   case 42:
    $cells120 = $46 + ($i_274 * 52 & -1) + 4 | 0;
    $47 = HEAP32[$cells120 >> 2] | 0;
    $arrayidx121 = $47 + ($c110_072 * 52 & -1) | 0;
    $isLearning122 = $47 + ($c110_072 * 52 & -1) + 24 | 0;
    $48 = HEAP8[$isLearning122] | 0;
    $49 = $48 & 1;
    $tobool123 = $49 << 24 >> 24 == 0;
    if ($tobool123) {
      label = 44;
      break;
    } else {
      label = 43;
      break;
    }
   case 43:
    _applyCellSegmentUpdates($arrayidx121, 1);
    label = 47;
    break;
   case 44:
    $isPredicting125 = $47 + ($c110_072 * 52 & -1) + 22 | 0;
    $50 = HEAP8[$isPredicting125] | 0;
    $51 = $50 & 1;
    $tobool126 = $51 << 24 >> 24 == 0;
    if ($tobool126) {
      label = 45;
      break;
    } else {
      label = 47;
      break;
    }
   case 45:
    $wasPredicted128 = $47 + ($c110_072 * 52 & -1) + 23 | 0;
    $52 = HEAP8[$wasPredicted128] | 0;
    $53 = $52 & 1;
    $tobool129 = $53 << 24 >> 24 == 0;
    if ($tobool129) {
      label = 47;
      break;
    } else {
      label = 46;
      break;
    }
   case 46:
    _applyCellSegmentUpdates($arrayidx121, 0);
    label = 47;
    break;
   case 47:
    $inc134 = $c110_072 + 1 | 0;
    $54 = HEAP32[$columns112 >> 2] | 0;
    $numCells114 = $54 + ($i_274 * 52 & -1) + 8 | 0;
    $55 = HEAP32[$numCells114 >> 2] | 0;
    $cmp115 = ($inc134 | 0) < ($55 | 0);
    if ($cmp115) {
      $c110_072 = $inc134;
      $46 = $54;
      label = 42;
      break;
    } else {
      label = 48;
      break;
    }
   case 48:
    $inc137 = $i_274 + 1 | 0;
    $56 = HEAP32[$numCols >> 2] | 0;
    $cmp108 = ($inc137 | 0) < ($56 | 0);
    if ($cmp108) {
      $i_274 = $inc137;
      label = 41;
      break;
    } else {
      label = 49;
      break;
    }
   case 49:
    STACKTOP = __stackBase__;
    return;
  }
}
function _runOnce($region) {
  $region = $region | 0;
  var $numCols = 0, $0 = 0, $cmp6 = 0, $columns = 0, $i_07 = 0, $1 = 0, $arrayidx = 0, $inc = 0, $2 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numCols = $region + 60 | 0;
    $0 = HEAP32[$numCols >> 2] | 0;
    $cmp6 = ($0 | 0) > 0;
    if ($cmp6) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $columns = $region + 56 | 0;
    $i_07 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$columns >> 2] | 0;
    $arrayidx = $1 + ($i_07 * 52 & -1) | 0;
    _nextColumnTimeStep($arrayidx);
    $inc = $i_07 + 1 | 0;
    $2 = HEAP32[$numCols >> 2] | 0;
    $cmp = ($inc | 0) < ($2 | 0);
    if ($cmp) {
      $i_07 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    _performSpatialPooling($region);
    _performTemporalPooling($region);
    return;
  }
}
function _initSegment($seg, $segActiveThreshold) {
  $seg = $seg | 0;
  $segActiveThreshold = $segActiveThreshold | 0;
  HEAP32[$seg + 4 >> 2] = 0;
  HEAP32[$seg + 8 >> 2] = 10;
  HEAP32[$seg >> 2] = _malloc(120) | 0;
  HEAP8[$seg + 12 | 0] = 0;
  HEAP32[$seg + 20 >> 2] = $segActiveThreshold;
  HEAP8[$seg + 24 | 0] = 0;
  HEAP8[$seg + 25 | 0] = 0;
  HEAP32[$seg + 16 >> 2] = 0;
  _memset($seg + 28 | 0, 0, 16);
  return;
}
function _deleteSegment($seg) {
  $seg = $seg | 0;
  var $synapses = 0;
  $synapses = $seg | 0;
  _free(HEAP32[$synapses >> 2] | 0);
  HEAP32[$synapses >> 2] = 0;
  HEAP32[$seg + 4 >> 2] = 0;
  return;
}
function _createSynapse($seg, $inputSource, $initPerm) {
  $seg = $seg | 0;
  $inputSource = $inputSource | 0;
  $initPerm = $initPerm | 0;
  var $numSynapses = 0, $0 = 0, $allocatedSynapses = 0, $1 = 0, $cmp = 0, $mul = 0, $synapses = 0, $2 = 0, $3 = 0, $mul2 = 0, $call = 0, $4 = 0, $5 = 0, $synapses6 = 0, $6 = 0, $arrayidx = 0, $7 = 0, $add = 0, $8 = 0, $arrayidx10 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSynapses = $seg + 4 | 0;
    $0 = HEAP32[$numSynapses >> 2] | 0;
    $allocatedSynapses = $seg + 8 | 0;
    $1 = HEAP32[$allocatedSynapses >> 2] | 0;
    $cmp = ($0 | 0) == ($1 | 0);
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    $mul = $1 << 1;
    $synapses = $seg | 0;
    $2 = HEAP32[$synapses >> 2] | 0;
    $3 = $2;
    $mul2 = $1 * 24 & -1;
    $call = _realloc($3, $mul2) | 0;
    $4 = $call;
    HEAP32[$synapses >> 2] = $4;
    HEAP32[$allocatedSynapses >> 2] = $mul;
    label = 4;
    break;
   case 4:
    $5 = HEAP32[$numSynapses >> 2] | 0;
    $synapses6 = $seg | 0;
    $6 = HEAP32[$synapses6 >> 2] | 0;
    $arrayidx = $6 + ($5 * 12 & -1) | 0;
    _initSynapse($arrayidx, $inputSource, $initPerm);
    $7 = HEAP32[$numSynapses >> 2] | 0;
    $add = $7 + 1 | 0;
    HEAP32[$numSynapses >> 2] = $add;
    $8 = HEAP32[$synapses6 >> 2] | 0;
    $arrayidx10 = $8 + ($7 * 12 & -1) | 0;
    return $arrayidx10 | 0;
  }
  return 0;
}
function _initSynapse($syn, $inputSource, $permanence) {
  $syn = $syn | 0;
  $inputSource = $inputSource | 0;
  $permanence = $permanence | 0;
  HEAP32[$syn + 4 >> 2] = $permanence;
  HEAP32[$syn >> 2] = $inputSource;
  HEAP8[$syn + 8 | 0] = 0;
  HEAP8[$syn + 9 | 0] = 0;
  return;
}
function _isSynapseActive($syn, $connectedOnly) {
  $syn = $syn | 0;
  $connectedOnly = $connectedOnly | 0;
  var $inputSource = 0, $0 = 0, $isActive = 0, $1 = 0, $2 = 0, $tobool = 0, $isConnected = 0, $3 = 0, $4 = 0, $lnot = 0, $not_tobool1 = 0, $lnot_ = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $inputSource = $syn | 0;
    $0 = HEAP32[$inputSource >> 2] | 0;
    $isActive = $0 + 20 | 0;
    $1 = HEAP8[$isActive] | 0;
    $2 = $1 & 1;
    $tobool = $2 << 24 >> 24 == 0;
    if ($tobool) {
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $isConnected = $syn + 8 | 0;
    $3 = HEAP8[$isConnected] | 0;
    $4 = $3 & 1;
    $lnot = $connectedOnly ^ 1;
    $not_tobool1 = $4 << 24 >> 24 != 0;
    $lnot_ = $not_tobool1 | $lnot;
    return $lnot_ | 0;
   case 4:
    return 0;
  }
  return 0;
}
function _wasSynapseActive($syn, $connectedOnly) {
  $syn = $syn | 0;
  $connectedOnly = $connectedOnly | 0;
  var $inputSource = 0, $0 = 0, $wasActive = 0, $1 = 0, $2 = 0, $tobool = 0, $wasConnected = 0, $3 = 0, $4 = 0, $lnot = 0, $not_tobool1 = 0, $lnot_ = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $inputSource = $syn | 0;
    $0 = HEAP32[$inputSource >> 2] | 0;
    $wasActive = $0 + 21 | 0;
    $1 = HEAP8[$wasActive] | 0;
    $2 = $1 & 1;
    $tobool = $2 << 24 >> 24 == 0;
    if ($tobool) {
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $wasConnected = $syn + 9 | 0;
    $3 = HEAP8[$wasConnected] | 0;
    $4 = $3 & 1;
    $lnot = $connectedOnly ^ 1;
    $not_tobool1 = $4 << 24 >> 24 != 0;
    $lnot_ = $not_tobool1 | $lnot;
    return $lnot_ | 0;
   case 4:
    return 0;
  }
  return 0;
}
function _increaseSynapsePermanence($syn, $amount) {
  $syn = $syn | 0;
  $amount = $amount | 0;
  var $permanence = 0, $add = 0;
  $permanence = $syn + 4 | 0;
  $add = (HEAP32[$permanence >> 2] | 0) + (($amount | 0) == 0 ? 150 : $amount) | 0;
  HEAP32[$permanence >> 2] = ($add | 0) > 1e4 ? 1e4 : $add;
  return;
}
function _decreaseSynapsePermanence($syn, $amount) {
  $syn = $syn | 0;
  $amount = $amount | 0;
  var $permanence = 0, $sub = 0;
  $permanence = $syn + 4 | 0;
  $sub = (HEAP32[$permanence >> 2] | 0) - (($amount | 0) == 0 ? 100 : $amount) | 0;
  HEAP32[$permanence >> 2] = ($sub | 0) < 0 ? 0 : $sub;
  return;
}
function _updateSegmentPermanences($seg, $increase) {
  $seg = $seg | 0;
  $increase = $increase | 0;
  var $numSynapses = 0, $0 = 0, $cmp4 = 0, $synapses = 0, $i_05 = 0, $1 = 0, $arrayidx = 0, $inc = 0, $2 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSynapses = $seg + 4 | 0;
    $0 = HEAP32[$numSynapses >> 2] | 0;
    $cmp4 = ($0 | 0) > 0;
    if ($cmp4) {
      label = 3;
      break;
    } else {
      label = 8;
      break;
    }
   case 3:
    $synapses = $seg | 0;
    $i_05 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$synapses >> 2] | 0;
    $arrayidx = $1 + ($i_05 * 12 & -1) | 0;
    if ($increase) {
      label = 5;
      break;
    } else {
      label = 6;
      break;
    }
   case 5:
    _increaseSynapsePermanence($arrayidx, 0);
    label = 7;
    break;
   case 6:
    _decreaseSynapsePermanence($arrayidx, 0);
    label = 7;
    break;
   case 7:
    $inc = $i_05 + 1 | 0;
    $2 = HEAP32[$numSynapses >> 2] | 0;
    $cmp = ($inc | 0) < ($2 | 0);
    if ($cmp) {
      $i_05 = $inc;
      label = 4;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    return;
  }
}
function _wasSegmentActiveFromLearning($seg) {
  $seg = $seg | 0;
  var $numSynapses = 0, $0 = 0, $cmp6 = 0, $synapses = 0, $1 = 0, $2 = 0, $c_08 = 0, $i_07 = 0, $arrayidx = 0, $call = 0, $inc = 0, $inc_c_0 = 0, $inc1 = 0, $cmp = 0, $c_0_lcssa = 0, $segActiveThreshold = 0, $3 = 0, $cmp2 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numSynapses = $seg + 4 | 0;
    $0 = HEAP32[$numSynapses >> 2] | 0;
    $cmp6 = ($0 | 0) > 0;
    if ($cmp6) {
      label = 3;
      break;
    } else {
      $c_0_lcssa = 0;
      label = 5;
      break;
    }
   case 3:
    $synapses = $seg | 0;
    $1 = HEAP32[$synapses >> 2] | 0;
    $2 = HEAP32[$numSynapses >> 2] | 0;
    $i_07 = 0;
    $c_08 = 0;
    label = 4;
    break;
   case 4:
    $arrayidx = $1 + ($i_07 * 12 & -1) | 0;
    $call = _wasSynapseActiveFromLearning($arrayidx) | 0;
    $inc = $call & 1;
    $inc_c_0 = $inc + $c_08 | 0;
    $inc1 = $i_07 + 1 | 0;
    $cmp = ($inc1 | 0) < ($2 | 0);
    if ($cmp) {
      $i_07 = $inc1;
      $c_08 = $inc_c_0;
      label = 4;
      break;
    } else {
      $c_0_lcssa = $inc_c_0;
      label = 5;
      break;
    }
   case 5:
    $segActiveThreshold = $seg + 20 | 0;
    $3 = HEAP32[$segActiveThreshold >> 2] | 0;
    $cmp2 = ($c_0_lcssa | 0) >= ($3 | 0);
    return $cmp2 | 0;
  }
  return 0;
}
function _randomSample($cells, $n, $ssCells, $m) {
  $cells = $cells | 0;
  $n = $n | 0;
  $ssCells = $ssCells | 0;
  $m = $m | 0;
  var $cmp14 = 0, $sub = 0, $i_016 = 0, $k_015 = 0, $call = 0, $add = 0, $rem = 0, $arrayidx = 0, $0 = 0, $j_0 = 0, $cmp2 = 0, $arrayidx4 = 0, $1 = 0, $cmp5 = 0, $inc = 0, $arrayidx7 = 0, $2 = 0, $arrayidx8 = 0, $arrayidx9 = 0, $inc13 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $cmp14 = ($m | 0) > 0;
    if ($cmp14) {
      label = 3;
      break;
    } else {
      label = 10;
      break;
    }
   case 3:
    $sub = $n - $m | 0;
    $k_015 = 0;
    $i_016 = $sub;
    label = 4;
    break;
   case 4:
    $call = _rand() | 0;
    $add = $i_016 + 1 | 0;
    $rem = ($call | 0) % ($add | 0);
    $arrayidx = $cells + ($rem << 2) | 0;
    $0 = HEAP32[$arrayidx >> 2] | 0;
    $j_0 = 0;
    label = 5;
    break;
   case 5:
    $cmp2 = ($j_0 | 0) < ($k_015 | 0);
    if ($cmp2) {
      label = 6;
      break;
    } else {
      label = 8;
      break;
    }
   case 6:
    $arrayidx4 = $ssCells + ($j_0 << 2) | 0;
    $1 = HEAP32[$arrayidx4 >> 2] | 0;
    $cmp5 = ($1 | 0) == ($0 | 0);
    $inc = $j_0 + 1 | 0;
    if ($cmp5) {
      label = 7;
      break;
    } else {
      $j_0 = $inc;
      label = 5;
      break;
    }
   case 7:
    $arrayidx7 = $cells + ($i_016 << 2) | 0;
    $2 = HEAP32[$arrayidx7 >> 2] | 0;
    $arrayidx8 = $ssCells + ($k_015 << 2) | 0;
    HEAP32[$arrayidx8 >> 2] = $2;
    label = 9;
    break;
   case 8:
    $arrayidx9 = $ssCells + ($k_015 << 2) | 0;
    HEAP32[$arrayidx9 >> 2] = $0;
    label = 9;
    break;
   case 9:
    $inc13 = $k_015 + 1 | 0;
    $cmp = ($add | 0) < ($n | 0);
    if ($cmp) {
      $k_015 = $inc13;
      $i_016 = $add;
      label = 4;
      break;
    } else {
      label = 10;
      break;
    }
   case 10:
    return;
  }
}
function _initSegmentUpdateInfo($info, $cell, $segmentID, $previous, $addNewSynapses) {
  $info = $info | 0;
  $cell = $cell | 0;
  $segmentID = $segmentID | 0;
  $previous = $previous | 0;
  $addNewSynapses = $addNewSynapses | 0;
  var $activeSynapseIDs = 0, $learningCells = 0, $cmp = 0, $segments = 0, $0 = 0, $arrayidx = 0, $cmp2 = 0, $numPrevActiveConnectedSyns = 0, $1 = 0, $numActiveSyns = 0, $mul = 0, $call = 0, $2 = 0, $numSynapses = 0, $3 = 0, $cmp7120 = 0, $synapses = 0, $i_0122 = 0, $s_0121 = 0, $4 = 0, $arrayidx8 = 0, $call9 = 0, $5 = 0, $arrayidx12 = 0, $inc = 0, $s_1 = 0, $inc14 = 0, $6 = 0, $cmp7 = 0, $s_0_lcssa = 0, $7 = 0, $cmp16 = 0, $call19 = 0, $numActiveConnectedSyns = 0, $8 = 0, $numActiveSyns21 = 0, $9 = 0, $mul23 = 0, $call24 = 0, $10 = 0, $numSynapses27 = 0, $11 = 0, $cmp28124 = 0, $synapses30 = 0, $i_1126 = 0, $s_2125 = 0, $12 = 0, $arrayidx31 = 0, $call32 = 0, $13 = 0, $arrayidx35 = 0, $inc36 = 0, $s_3 = 0, $inc39 = 0, $14 = 0, $cmp28 = 0, $s_2_lcssa = 0, $15 = 0, $cmp42 = 0, $call45 = 0, $cmp293 = 0, $segment_092 = 0, $cell49 = 0, $segmentID50 = 0, $addNewSynapses52 = 0, $frombool53 = 0, $numPredictionSteps = 0, $column = 0, $16 = 0, $region54 = 0, $17 = 0, $call58 = 0, $18 = 0, $height = 0, $19 = 0, $sub = 0, $width = 0, $20 = 0, $sub61 = 0, $cmp66113 = 0, $cmp69105 = 0, $columns = 0, $numSynapses87 = 0, $synapses90 = 0, $numLearnCells_0117 = 0, $allocatedLearnCells_0116 = 0, $x_0115 = 0, $learningCells56_0114 = 0, $numLearnCells_1109 = 0, $allocatedLearnCells_1108 = 0, $y_0107 = 0, $learningCells56_1106 = 0, $21 = 0, $mul72 = 0, $add = 0, $22 = 0, $arrayidx73 = 0, $cmp74 = 0, $numCells = 0, $23 = 0, $cmp7895 = 0, $cells = 0, $i_2102 = 0, $numLearnCells_2100 = 0, $allocatedLearnCells_298 = 0, $learningCells56_296 = 0, $24 = 0, $arrayidx81 = 0, $wasLearning = 0, $25 = 0, $26 = 0, $tobool82 = 0, $27 = 0, $s_4 = 0, $cmp88 = 0, $28 = 0, $inputSource = 0, $29 = 0, $cmp92 = 0, $inc96 = 0, $cmp101 = 0, $mul103 = 0, $30 = 0, $mul104 = 0, $call105 = 0, $31 = 0, $learningCells56_3 = 0, $allocatedLearnCells_3 = 0, $arrayidx107 = 0, $add108 = 0, $learningCells56_4 = 0, $allocatedLearnCells_4 = 0, $numLearnCells_3 = 0, $inc112 = 0, $32 = 0, $cmp78 = 0, $learningCells56_5 = 0, $allocatedLearnCells_5 = 0, $numLearnCells_4 = 0, $inc115 = 0, $cmp69 = 0, $numLearnCells_1_lcssa = 0, $allocatedLearnCells_1_lcssa = 0, $learningCells56_1_lcssa = 0, $inc118 = 0, $cmp66 = 0, $learningCells56_6 = 0, $numLearnCells_5 = 0, $newSynapseCount = 0, $33 = 0, $numActiveSyns123 = 0, $34 = 0, $sub124 = 0, $cmp125 = 0, $_sub124 = 0, $synCount_0 = 0, $cmp129 = 0, $cond133 = 0, $numLearningCells = 0, $cmp134 = 0, $cmp135 = 0, $or_cond = 0, $mul137 = 0, $call138 = 0, $35 = 0, $36 = 0, label = 0, __stackBase__ = 0;
  __stackBase__ = STACKTOP;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $activeSynapseIDs = $info + 12 | 0;
    HEAP32[$activeSynapseIDs >> 2] = 0;
    $learningCells = $info + 20 | 0;
    HEAP32[$learningCells >> 2] = 0;
    $cmp = ($segmentID | 0) > -1;
    if ($cmp) {
      label = 3;
      break;
    } else {
      $segment_092 = 0;
      $cmp293 = 0;
      label = 19;
      break;
    }
   case 3:
    $segments = $cell + 28 | 0;
    $0 = HEAP32[$segments >> 2] | 0;
    $arrayidx = $0 + ($segmentID * 44 & -1) | 0;
    $cmp2 = ($arrayidx | 0) != 0;
    if ($cmp2) {
      label = 4;
      break;
    } else {
      $segment_092 = 0;
      $cmp293 = 0;
      label = 19;
      break;
    }
   case 4:
    if ($previous) {
      label = 5;
      break;
    } else {
      label = 12;
      break;
    }
   case 5:
    $numPrevActiveConnectedSyns = $0 + ($segmentID * 44 & -1) + 32 | 0;
    $1 = HEAP32[$numPrevActiveConnectedSyns >> 2] | 0;
    $numActiveSyns = $info + 16 | 0;
    HEAP32[$numActiveSyns >> 2] = $1;
    $mul = $1 << 2;
    $call = _malloc($mul) | 0;
    $2 = $call;
    HEAP32[$activeSynapseIDs >> 2] = $2;
    $numSynapses = $0 + ($segmentID * 44 & -1) + 4 | 0;
    $3 = HEAP32[$numSynapses >> 2] | 0;
    $cmp7120 = ($3 | 0) > 0;
    if ($cmp7120) {
      label = 6;
      break;
    } else {
      $s_0_lcssa = 0;
      label = 10;
      break;
    }
   case 6:
    $synapses = $arrayidx | 0;
    $s_0121 = 0;
    $i_0122 = 0;
    label = 7;
    break;
   case 7:
    $4 = HEAP32[$synapses >> 2] | 0;
    $arrayidx8 = $4 + ($i_0122 * 12 & -1) | 0;
    $call9 = _wasSynapseActive($arrayidx8, 1) | 0;
    if ($call9) {
      label = 8;
      break;
    } else {
      $s_1 = $s_0121;
      label = 9;
      break;
    }
   case 8:
    $5 = HEAP32[$activeSynapseIDs >> 2] | 0;
    $arrayidx12 = $5 + ($s_0121 << 2) | 0;
    HEAP32[$arrayidx12 >> 2] = $i_0122;
    $inc = $s_0121 + 1 | 0;
    $s_1 = $inc;
    label = 9;
    break;
   case 9:
    $inc14 = $i_0122 + 1 | 0;
    $6 = HEAP32[$numSynapses >> 2] | 0;
    $cmp7 = ($inc14 | 0) < ($6 | 0);
    if ($cmp7) {
      $s_0121 = $s_1;
      $i_0122 = $inc14;
      label = 7;
      break;
    } else {
      $s_0_lcssa = $s_1;
      label = 10;
      break;
    }
   case 10:
    $7 = HEAP32[$numActiveSyns >> 2] | 0;
    $cmp16 = ($7 | 0) == ($s_0_lcssa | 0);
    if ($cmp16) {
      $segment_092 = $arrayidx;
      $cmp293 = $cmp2;
      label = 19;
      break;
    } else {
      label = 11;
      break;
    }
   case 11:
    $call19 = _printf(240, (tempInt = STACKTOP, STACKTOP = STACKTOP + 16 | 0, HEAP32[tempInt >> 2] = $7, HEAP32[tempInt + 8 >> 2] = $s_0_lcssa, tempInt) | 0) | 0;
    $segment_092 = $arrayidx;
    $cmp293 = $cmp2;
    label = 19;
    break;
   case 12:
    $numActiveConnectedSyns = $0 + ($segmentID * 44 & -1) + 28 | 0;
    $8 = HEAP32[$numActiveConnectedSyns >> 2] | 0;
    $numActiveSyns21 = $info + 16 | 0;
    HEAP32[$numActiveSyns21 >> 2] = $8;
    $9 = HEAP32[$numActiveConnectedSyns >> 2] | 0;
    $mul23 = $9 << 2;
    $call24 = _malloc($mul23) | 0;
    $10 = $call24;
    HEAP32[$activeSynapseIDs >> 2] = $10;
    $numSynapses27 = $0 + ($segmentID * 44 & -1) + 4 | 0;
    $11 = HEAP32[$numSynapses27 >> 2] | 0;
    $cmp28124 = ($11 | 0) > 0;
    if ($cmp28124) {
      label = 13;
      break;
    } else {
      $s_2_lcssa = 0;
      label = 17;
      break;
    }
   case 13:
    $synapses30 = $arrayidx | 0;
    $s_2125 = 0;
    $i_1126 = 0;
    label = 14;
    break;
   case 14:
    $12 = HEAP32[$synapses30 >> 2] | 0;
    $arrayidx31 = $12 + ($i_1126 * 12 & -1) | 0;
    $call32 = _isSynapseActive($arrayidx31, 1) | 0;
    if ($call32) {
      label = 15;
      break;
    } else {
      $s_3 = $s_2125;
      label = 16;
      break;
    }
   case 15:
    $13 = HEAP32[$activeSynapseIDs >> 2] | 0;
    $arrayidx35 = $13 + ($s_2125 << 2) | 0;
    HEAP32[$arrayidx35 >> 2] = $i_1126;
    $inc36 = $s_2125 + 1 | 0;
    $s_3 = $inc36;
    label = 16;
    break;
   case 16:
    $inc39 = $i_1126 + 1 | 0;
    $14 = HEAP32[$numSynapses27 >> 2] | 0;
    $cmp28 = ($inc39 | 0) < ($14 | 0);
    if ($cmp28) {
      $s_2125 = $s_3;
      $i_1126 = $inc39;
      label = 14;
      break;
    } else {
      $s_2_lcssa = $s_3;
      label = 17;
      break;
    }
   case 17:
    $15 = HEAP32[$numActiveSyns21 >> 2] | 0;
    $cmp42 = ($15 | 0) == ($s_2_lcssa | 0);
    if ($cmp42) {
      $segment_092 = $arrayidx;
      $cmp293 = $cmp2;
      label = 19;
      break;
    } else {
      label = 18;
      break;
    }
   case 18:
    $call45 = _printf(272, (tempInt = STACKTOP, STACKTOP = STACKTOP + 16 | 0, HEAP32[tempInt >> 2] = $15, HEAP32[tempInt + 8 >> 2] = $s_2_lcssa, tempInt) | 0) | 0;
    $segment_092 = $arrayidx;
    $cmp293 = $cmp2;
    label = 19;
    break;
   case 19:
    $cell49 = $info | 0;
    HEAP32[$cell49 >> 2] = $cell;
    $segmentID50 = $info + 4 | 0;
    HEAP32[$segmentID50 >> 2] = $segmentID;
    $addNewSynapses52 = $info + 28 | 0;
    $frombool53 = $addNewSynapses & 1;
    HEAP8[$addNewSynapses52] = $frombool53;
    $numPredictionSteps = $info + 8 | 0;
    HEAP32[$numPredictionSteps >> 2] = 1;
    $column = $cell + 4 | 0;
    $16 = HEAP32[$column >> 2] | 0;
    $region54 = $16 | 0;
    $17 = HEAP32[$region54 >> 2] | 0;
    $call58 = _malloc(40) | 0;
    $18 = $call58;
    if ($addNewSynapses) {
      label = 20;
      break;
    } else {
      $numLearnCells_5 = 0;
      $learningCells56_6 = $18;
      label = 37;
      break;
    }
   case 20:
    $height = $17 + 44 | 0;
    $19 = HEAP32[$height >> 2] | 0;
    $sub = $19 - 1 | 0;
    $width = $17 + 40 | 0;
    $20 = HEAP32[$width >> 2] | 0;
    $sub61 = $20 - 1 | 0;
    $cmp66113 = ($sub61 | 0) < 0;
    if ($cmp66113) {
      $numLearnCells_5 = 0;
      $learningCells56_6 = $18;
      label = 37;
      break;
    } else {
      label = 21;
      break;
    }
   case 21:
    $cmp69105 = ($sub | 0) < 0;
    $columns = $17 + 56 | 0;
    $numSynapses87 = $segment_092 + 4 | 0;
    $synapses90 = $segment_092 | 0;
    $learningCells56_0114 = $18;
    $x_0115 = 0;
    $allocatedLearnCells_0116 = 10;
    $numLearnCells_0117 = 0;
    label = 22;
    break;
   case 22:
    if ($cmp69105) {
      $learningCells56_1_lcssa = $learningCells56_0114;
      $allocatedLearnCells_1_lcssa = $allocatedLearnCells_0116;
      $numLearnCells_1_lcssa = $numLearnCells_0117;
      label = 36;
      break;
    } else {
      $learningCells56_1106 = $learningCells56_0114;
      $y_0107 = 0;
      $allocatedLearnCells_1108 = $allocatedLearnCells_0116;
      $numLearnCells_1109 = $numLearnCells_0117;
      label = 23;
      break;
    }
   case 23:
    $21 = HEAP32[$width >> 2] | 0;
    $mul72 = Math_imul($21, $y_0107);
    $add = $mul72 + $x_0115 | 0;
    $22 = HEAP32[$columns >> 2] | 0;
    $arrayidx73 = $22 + ($add * 52 & -1) | 0;
    $cmp74 = ($arrayidx73 | 0) == ($16 | 0);
    if ($cmp74) {
      $numLearnCells_4 = $numLearnCells_1109;
      $allocatedLearnCells_5 = $allocatedLearnCells_1108;
      $learningCells56_5 = $learningCells56_1106;
      label = 35;
      break;
    } else {
      label = 24;
      break;
    }
   case 24:
    $numCells = $22 + ($add * 52 & -1) + 8 | 0;
    $23 = HEAP32[$numCells >> 2] | 0;
    $cmp7895 = ($23 | 0) > 0;
    if ($cmp7895) {
      label = 25;
      break;
    } else {
      $numLearnCells_4 = $numLearnCells_1109;
      $allocatedLearnCells_5 = $allocatedLearnCells_1108;
      $learningCells56_5 = $learningCells56_1106;
      label = 35;
      break;
    }
   case 25:
    $cells = $22 + ($add * 52 & -1) + 4 | 0;
    $learningCells56_296 = $learningCells56_1106;
    $allocatedLearnCells_298 = $allocatedLearnCells_1108;
    $numLearnCells_2100 = $numLearnCells_1109;
    $i_2102 = 0;
    label = 26;
    break;
   case 26:
    $24 = HEAP32[$cells >> 2] | 0;
    $arrayidx81 = $24 + ($i_2102 * 52 & -1) | 0;
    $wasLearning = $24 + ($i_2102 * 52 & -1) + 25 | 0;
    $25 = HEAP8[$wasLearning] | 0;
    $26 = $25 & 1;
    $tobool82 = $26 << 24 >> 24 == 0;
    if ($tobool82) {
      $numLearnCells_3 = $numLearnCells_2100;
      $allocatedLearnCells_4 = $allocatedLearnCells_298;
      $learningCells56_4 = $learningCells56_296;
      label = 34;
      break;
    } else {
      label = 27;
      break;
    }
   case 27:
    if ($cmp293) {
      label = 28;
      break;
    } else {
      label = 31;
      break;
    }
   case 28:
    $27 = HEAP32[$numSynapses87 >> 2] | 0;
    $s_4 = 0;
    label = 29;
    break;
   case 29:
    $cmp88 = ($s_4 | 0) < ($27 | 0);
    if ($cmp88) {
      label = 30;
      break;
    } else {
      label = 31;
      break;
    }
   case 30:
    $28 = HEAP32[$synapses90 >> 2] | 0;
    $inputSource = $28 + ($s_4 * 12 & -1) | 0;
    $29 = HEAP32[$inputSource >> 2] | 0;
    $cmp92 = ($29 | 0) == ($arrayidx81 | 0);
    $inc96 = $s_4 + 1 | 0;
    if ($cmp92) {
      $numLearnCells_3 = $numLearnCells_2100;
      $allocatedLearnCells_4 = $allocatedLearnCells_298;
      $learningCells56_4 = $learningCells56_296;
      label = 34;
      break;
    } else {
      $s_4 = $inc96;
      label = 29;
      break;
    }
   case 31:
    $cmp101 = ($numLearnCells_2100 | 0) == ($allocatedLearnCells_298 | 0);
    if ($cmp101) {
      label = 32;
      break;
    } else {
      $allocatedLearnCells_3 = $allocatedLearnCells_298;
      $learningCells56_3 = $learningCells56_296;
      label = 33;
      break;
    }
   case 32:
    $mul103 = $allocatedLearnCells_298 << 1;
    $30 = $learningCells56_296;
    $mul104 = $allocatedLearnCells_298 << 3;
    $call105 = _realloc($30, $mul104) | 0;
    $31 = $call105;
    $allocatedLearnCells_3 = $mul103;
    $learningCells56_3 = $31;
    label = 33;
    break;
   case 33:
    $arrayidx107 = $learningCells56_3 + ($numLearnCells_2100 << 2) | 0;
    HEAP32[$arrayidx107 >> 2] = $arrayidx81;
    $add108 = $numLearnCells_2100 + 1 | 0;
    $numLearnCells_3 = $add108;
    $allocatedLearnCells_4 = $allocatedLearnCells_3;
    $learningCells56_4 = $learningCells56_3;
    label = 34;
    break;
   case 34:
    $inc112 = $i_2102 + 1 | 0;
    $32 = HEAP32[$numCells >> 2] | 0;
    $cmp78 = ($inc112 | 0) < ($32 | 0);
    if ($cmp78) {
      $learningCells56_296 = $learningCells56_4;
      $allocatedLearnCells_298 = $allocatedLearnCells_4;
      $numLearnCells_2100 = $numLearnCells_3;
      $i_2102 = $inc112;
      label = 26;
      break;
    } else {
      $numLearnCells_4 = $numLearnCells_3;
      $allocatedLearnCells_5 = $allocatedLearnCells_4;
      $learningCells56_5 = $learningCells56_4;
      label = 35;
      break;
    }
   case 35:
    $inc115 = $y_0107 + 1 | 0;
    $cmp69 = ($inc115 | 0) > ($sub | 0);
    if ($cmp69) {
      $learningCells56_1_lcssa = $learningCells56_5;
      $allocatedLearnCells_1_lcssa = $allocatedLearnCells_5;
      $numLearnCells_1_lcssa = $numLearnCells_4;
      label = 36;
      break;
    } else {
      $learningCells56_1106 = $learningCells56_5;
      $y_0107 = $inc115;
      $allocatedLearnCells_1108 = $allocatedLearnCells_5;
      $numLearnCells_1109 = $numLearnCells_4;
      label = 23;
      break;
    }
   case 36:
    $inc118 = $x_0115 + 1 | 0;
    $cmp66 = ($inc118 | 0) > ($sub61 | 0);
    if ($cmp66) {
      $numLearnCells_5 = $numLearnCells_1_lcssa;
      $learningCells56_6 = $learningCells56_1_lcssa;
      label = 37;
      break;
    } else {
      $learningCells56_0114 = $learningCells56_1_lcssa;
      $x_0115 = $inc118;
      $allocatedLearnCells_0116 = $allocatedLearnCells_1_lcssa;
      $numLearnCells_0117 = $numLearnCells_1_lcssa;
      label = 22;
      break;
    }
   case 37:
    $newSynapseCount = $17 + 20 | 0;
    $33 = HEAP32[$newSynapseCount >> 2] | 0;
    if ($cmp293) {
      label = 38;
      break;
    } else {
      $synCount_0 = $33;
      label = 39;
      break;
    }
   case 38:
    $numActiveSyns123 = $info + 16 | 0;
    $34 = HEAP32[$numActiveSyns123 >> 2] | 0;
    $sub124 = $33 - $34 | 0;
    $cmp125 = ($sub124 | 0) < 0;
    $_sub124 = $cmp125 ? 0 : $sub124;
    $synCount_0 = $_sub124;
    label = 39;
    break;
   case 39:
    $cmp129 = ($numLearnCells_5 | 0) < ($synCount_0 | 0);
    $cond133 = $cmp129 ? $numLearnCells_5 : $synCount_0;
    $numLearningCells = $info + 24 | 0;
    HEAP32[$numLearningCells >> 2] = $cond133;
    $cmp134 = ($numLearnCells_5 | 0) > 0;
    $cmp135 = ($cond133 | 0) > 0;
    $or_cond = $cmp134 & $cmp135;
    if ($or_cond) {
      label = 40;
      break;
    } else {
      label = 41;
      break;
    }
   case 40:
    $mul137 = $cond133 << 2;
    $call138 = _malloc($mul137) | 0;
    $35 = $call138;
    _randomSample($learningCells56_6, $numLearnCells_5, $35, $cond133);
    HEAP32[$learningCells >> 2] = $35;
    label = 41;
    break;
   case 41:
    $36 = $learningCells56_6;
    _free($36);
    STACKTOP = __stackBase__;
    return;
  }
}
function _deleteSegmentUpdateInfo($info) {
  $info = $info | 0;
  var $activeSynapseIDs = 0, $0 = 0, $cmp = 0, $1 = 0, $numActiveSyns = 0, $learningCells = 0, $2 = 0, $cmp3 = 0, $3 = 0, $numLearningCells = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $activeSynapseIDs = $info + 12 | 0;
    $0 = HEAP32[$activeSynapseIDs >> 2] | 0;
    $cmp = ($0 | 0) == 0;
    if ($cmp) {
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $1 = $0;
    _free($1);
    label = 4;
    break;
   case 4:
    HEAP32[$activeSynapseIDs >> 2] = 0;
    $numActiveSyns = $info + 16 | 0;
    HEAP32[$numActiveSyns >> 2] = 0;
    $learningCells = $info + 20 | 0;
    $2 = HEAP32[$learningCells >> 2] | 0;
    $cmp3 = ($2 | 0) == 0;
    if ($cmp3) {
      label = 6;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $3 = $2;
    _free($3);
    label = 6;
    break;
   case 6:
    HEAP32[$learningCells >> 2] = 0;
    $numLearningCells = $info + 24 | 0;
    HEAP32[$numLearningCells >> 2] = 0;
    return;
  }
}
function _createSynapsesToLearningCells($info, $seg) {
  $info = $info | 0;
  $seg = $seg | 0;
  var $numLearningCells = 0, $0 = 0, $cmp4 = 0, $learningCells = 0, $i_05 = 0, $1 = 0, $arrayidx = 0, $2 = 0, $call = 0, $inc = 0, $3 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numLearningCells = $info + 24 | 0;
    $0 = HEAP32[$numLearningCells >> 2] | 0;
    $cmp4 = ($0 | 0) > 0;
    if ($cmp4) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $learningCells = $info + 20 | 0;
    $i_05 = 0;
    label = 4;
    break;
   case 4:
    $1 = HEAP32[$learningCells >> 2] | 0;
    $arrayidx = $1 + ($i_05 << 2) | 0;
    $2 = HEAP32[$arrayidx >> 2] | 0;
    $call = _createSynapse($seg, $2, 3e3) | 0;
    $inc = $i_05 + 1 | 0;
    $3 = HEAP32[$numLearningCells >> 2] | 0;
    $cmp = ($inc | 0) < ($3 | 0);
    if ($cmp) {
      $i_05 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    return;
  }
}
function _createCellSegmentFromInfo($info) {
  $info = $info | 0;
  var $call = 0;
  $call = _createCellSegment(HEAP32[$info >> 2] | 0) | 0;
  _setNumPredictionSteps($call, HEAP32[$info + 8 >> 2] | 0);
  _createSynapsesToLearningCells($info, $call);
  return $call | 0;
}
function _updateInfoPermanences($info) {
  $info = $info | 0;
  var $segmentID = 0, $0 = 0, $cell = 0, $1 = 0, $segments = 0, $2 = 0, $arrayidx = 0, $numSynapses = 0, $3 = 0, $cmp13 = 0, $synapses = 0, $numActiveSyns = 0, $4 = 0, $cmp311 = 0, $activeSynapseIDs = 0, $synapses7 = 0, $i_014 = 0, $5 = 0, $arrayidx1 = 0, $inc = 0, $6 = 0, $cmp = 0, $i_112 = 0, $7 = 0, $arrayidx6 = 0, $8 = 0, $9 = 0, $arrayidx8 = 0, $inc10 = 0, $10 = 0, $cmp3 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $segmentID = $info + 4 | 0;
    $0 = HEAP32[$segmentID >> 2] | 0;
    $cell = $info | 0;
    $1 = HEAP32[$cell >> 2] | 0;
    $segments = $1 + 28 | 0;
    $2 = HEAP32[$segments >> 2] | 0;
    $arrayidx = $2 + ($0 * 44 & -1) | 0;
    $numSynapses = $2 + ($0 * 44 & -1) + 4 | 0;
    $3 = HEAP32[$numSynapses >> 2] | 0;
    $cmp13 = ($3 | 0) == 0;
    if ($cmp13) {
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $synapses = $arrayidx | 0;
    $i_014 = 0;
    label = 6;
    break;
   case 4:
    $numActiveSyns = $info + 16 | 0;
    $4 = HEAP32[$numActiveSyns >> 2] | 0;
    $cmp311 = ($4 | 0) == 0;
    if ($cmp311) {
      label = 8;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $activeSynapseIDs = $info + 12 | 0;
    $synapses7 = $arrayidx | 0;
    $i_112 = 0;
    label = 7;
    break;
   case 6:
    $5 = HEAP32[$synapses >> 2] | 0;
    $arrayidx1 = $5 + ($i_014 * 12 & -1) | 0;
    _decreaseSynapsePermanence($arrayidx1, 0);
    $inc = $i_014 + 1 | 0;
    $6 = HEAP32[$numSynapses >> 2] | 0;
    $cmp = $inc >>> 0 < $6 >>> 0;
    if ($cmp) {
      $i_014 = $inc;
      label = 6;
      break;
    } else {
      label = 4;
      break;
    }
   case 7:
    $7 = HEAP32[$activeSynapseIDs >> 2] | 0;
    $arrayidx6 = $7 + ($i_112 << 2) | 0;
    $8 = HEAP32[$arrayidx6 >> 2] | 0;
    $9 = HEAP32[$synapses7 >> 2] | 0;
    $arrayidx8 = $9 + ($8 * 12 & -1) | 0;
    _increaseSynapsePermanence($arrayidx8, 300);
    $inc10 = $i_112 + 1 | 0;
    $10 = HEAP32[$numActiveSyns >> 2] | 0;
    $cmp3 = $inc10 >>> 0 < $10 >>> 0;
    if ($cmp3) {
      $i_112 = $inc10;
      label = 7;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    return;
  }
}
function _decreaseInfoPermanences($info) {
  $info = $info | 0;
  var $numActiveSyns = 0, $0 = 0, $cmp6 = 0, $cell = 0, $1 = 0, $segments = 0, $segmentID = 0, $2 = 0, $3 = 0, $activeSynapseIDs = 0, $synapses = 0, $i_07 = 0, $4 = 0, $arrayidx1 = 0, $5 = 0, $6 = 0, $arrayidx2 = 0, $inc = 0, $7 = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $numActiveSyns = $info + 16 | 0;
    $0 = HEAP32[$numActiveSyns >> 2] | 0;
    $cmp6 = ($0 | 0) > 0;
    if ($cmp6) {
      label = 3;
      break;
    } else {
      label = 5;
      break;
    }
   case 3:
    $cell = $info | 0;
    $1 = HEAP32[$cell >> 2] | 0;
    $segments = $1 + 28 | 0;
    $segmentID = $info + 4 | 0;
    $2 = HEAP32[$segments >> 2] | 0;
    $3 = HEAP32[$segmentID >> 2] | 0;
    $activeSynapseIDs = $info + 12 | 0;
    $synapses = $2 + ($3 * 44 & -1) | 0;
    $i_07 = 0;
    label = 4;
    break;
   case 4:
    $4 = HEAP32[$activeSynapseIDs >> 2] | 0;
    $arrayidx1 = $4 + ($i_07 << 2) | 0;
    $5 = HEAP32[$arrayidx1 >> 2] | 0;
    $6 = HEAP32[$synapses >> 2] | 0;
    $arrayidx2 = $6 + ($5 * 12 & -1) | 0;
    _decreaseSynapsePermanence($arrayidx2, 0);
    $inc = $i_07 + 1 | 0;
    $7 = HEAP32[$numActiveSyns >> 2] | 0;
    $cmp = ($inc | 0) < ($7 | 0);
    if ($cmp) {
      $i_07 = $inc;
      label = 4;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    return;
  }
}
function _applySegmentUpdates($info, $positiveReinforcement) {
  $info = $info | 0;
  $positiveReinforcement = $positiveReinforcement | 0;
  var $segmentID = 0, $0 = 0, $cmp = 0, $cell = 0, $1 = 0, $segments = 0, $2 = 0, $arrayidx = 0, $cmp2 = 0, $cmp213 = 0, $segment_012 = 0, $addNewSynapses = 0, $3 = 0, $4 = 0, $tobool7 = 0, $positiveReinforcement_not = 0, $brmerge = 0, $numLearningCells = 0, $5 = 0, $cmp12 = 0, $call = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $segmentID = $info + 4 | 0;
    $0 = HEAP32[$segmentID >> 2] | 0;
    $cmp = ($0 | 0) > -1;
    if ($cmp) {
      label = 3;
      break;
    } else {
      $segment_012 = 0;
      $cmp213 = 1;
      label = 7;
      break;
    }
   case 3:
    $cell = $info | 0;
    $1 = HEAP32[$cell >> 2] | 0;
    $segments = $1 + 28 | 0;
    $2 = HEAP32[$segments >> 2] | 0;
    $arrayidx = $2 + ($0 * 44 & -1) | 0;
    $cmp2 = ($arrayidx | 0) == 0;
    if ($cmp2) {
      $segment_012 = 0;
      $cmp213 = 1;
      label = 7;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    if ($positiveReinforcement) {
      label = 5;
      break;
    } else {
      label = 6;
      break;
    }
   case 5:
    _updateInfoPermanences($info);
    $segment_012 = $arrayidx;
    $cmp213 = $cmp2;
    label = 7;
    break;
   case 6:
    _decreaseInfoPermanences($info);
    label = 13;
    break;
   case 7:
    $addNewSynapses = $info + 28 | 0;
    $3 = HEAP8[$addNewSynapses] | 0;
    $4 = $3 & 1;
    $tobool7 = $4 << 24 >> 24 == 0;
    $positiveReinforcement_not = $positiveReinforcement ^ 1;
    $brmerge = $tobool7 | $positiveReinforcement_not;
    if ($brmerge) {
      label = 13;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $numLearningCells = $info + 24 | 0;
    $5 = HEAP32[$numLearningCells >> 2] | 0;
    $cmp12 = ($5 | 0) > 0;
    if ($cmp213) {
      label = 9;
      break;
    } else {
      label = 11;
      break;
    }
   case 9:
    if ($cmp12) {
      label = 10;
      break;
    } else {
      label = 13;
      break;
    }
   case 10:
    $call = _createCellSegmentFromInfo($info) | 0;
    label = 13;
    break;
   case 11:
    if ($cmp12) {
      label = 12;
      break;
    } else {
      label = 13;
      break;
    }
   case 12:
    _createSynapsesToLearningCells($info, $segment_012);
    label = 13;
    break;
   case 13:
    return;
  }
}
function _wasSynapseActiveFromLearning($syn) {
  $syn = $syn | 0;
  var $call = 0, $inputSource = 0, $0 = 0, $wasLearning = 0, $1 = 0, $2 = 0, $tobool = 0, $3 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $call = _wasSynapseActive($syn, 1) | 0;
    if ($call) {
      label = 3;
      break;
    } else {
      $3 = 0;
      label = 4;
      break;
    }
   case 3:
    $inputSource = $syn | 0;
    $0 = HEAP32[$inputSource >> 2] | 0;
    $wasLearning = $0 + 25 | 0;
    $1 = HEAP8[$wasLearning] | 0;
    $2 = $1 & 1;
    $tobool = $2 << 24 >> 24 != 0;
    $3 = $tobool;
    label = 4;
    break;
   case 4:
    return $3 | 0;
  }
  return 0;
}
function _malloc($bytes) {
  $bytes = $bytes | 0;
  var $cmp = 0, $cmp1 = 0, $add2 = 0, $and = 0, $cond = 0, $shr = 0, $0 = 0, $shr3 = 0, $and4 = 0, $cmp5 = 0, $neg = 0, $and7 = 0, $add8 = 0, $shl = 0, $arrayidx = 0, $1 = 0, $arrayidx_sum = 0, $2 = 0, $3 = 0, $fd9 = 0, $4 = 0, $cmp10 = 0, $shl12 = 0, $neg13 = 0, $and14 = 0, $5 = 0, $6 = 0, $cmp15 = 0, $bk = 0, $7 = 0, $cmp16 = 0, $shl22 = 0, $or23 = 0, $head = 0, $8 = 0, $add_ptr_sum106 = 0, $head25 = 0, $9 = 0, $10 = 0, $or26 = 0, $11 = 0, $12 = 0, $cmp29 = 0, $cmp31 = 0, $shl35 = 0, $shl37 = 0, $sub = 0, $or40 = 0, $and41 = 0, $sub42 = 0, $and43 = 0, $sub44 = 0, $shr45 = 0, $and46 = 0, $shr47 = 0, $shr48 = 0, $and49 = 0, $add50 = 0, $shr51 = 0, $shr52 = 0, $and53 = 0, $add54 = 0, $shr55 = 0, $shr56 = 0, $and57 = 0, $add58 = 0, $shr59 = 0, $shr60 = 0, $and61 = 0, $add62 = 0, $shr63 = 0, $add64 = 0, $shl65 = 0, $arrayidx66 = 0, $13 = 0, $arrayidx66_sum = 0, $14 = 0, $15 = 0, $fd69 = 0, $16 = 0, $cmp70 = 0, $shl72 = 0, $neg73 = 0, $and74 = 0, $17 = 0, $18 = 0, $cmp76 = 0, $bk78 = 0, $19 = 0, $cmp79 = 0, $shl90 = 0, $sub91 = 0, $or93 = 0, $head94 = 0, $20 = 0, $add_ptr95 = 0, $21 = 0, $or96 = 0, $add_ptr95_sum103 = 0, $head97 = 0, $22 = 0, $add_ptr98 = 0, $prev_foot = 0, $23 = 0, $cmp99 = 0, $24 = 0, $shr101 = 0, $shl102 = 0, $arrayidx103 = 0, $25 = 0, $26 = 0, $shl105 = 0, $and106 = 0, $tobool107 = 0, $or110 = 0, $arrayidx103_sum104 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $cmp113 = 0, $F104_0 = 0, $arrayidx103_sum = 0, $31 = 0, $bk122 = 0, $fd123 = 0, $bk124 = 0, $32 = 0, $33 = 0, $cmp128 = 0, $call = 0, $cmp130 = 0, $cmp138 = 0, $add143 = 0, $and144 = 0, $34 = 0, $cmp145 = 0, $call148 = 0, $cmp149 = 0, $nb_0 = 0, $35 = 0, $cmp155 = 0, $sub159 = 0, $36 = 0, $cmp161 = 0, $37 = 0, $add_ptr165 = 0, $38 = 0, $or166 = 0, $add_ptr165_sum = 0, $head167 = 0, $39 = 0, $add_ptr168 = 0, $prev_foot169 = 0, $or171 = 0, $head172 = 0, $or175 = 0, $head176 = 0, $40 = 0, $add_ptr177_sum = 0, $head178 = 0, $41 = 0, $42 = 0, $or179 = 0, $add_ptr181 = 0, $43 = 0, $44 = 0, $cmp183 = 0, $sub187 = 0, $45 = 0, $46 = 0, $add_ptr190 = 0, $47 = 0, $or191 = 0, $add_ptr190_sum = 0, $head192 = 0, $48 = 0, $or194 = 0, $head195 = 0, $add_ptr196 = 0, $49 = 0, $call199 = 0, $mem_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $cmp = $bytes >>> 0 < 245;
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 30;
      break;
    }
   case 3:
    $cmp1 = $bytes >>> 0 < 11;
    if ($cmp1) {
      $cond = 16;
      label = 5;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $add2 = $bytes + 11 | 0;
    $and = $add2 & -8;
    $cond = $and;
    label = 5;
    break;
   case 5:
    $shr = $cond >>> 3;
    $0 = HEAP32[90] | 0;
    $shr3 = $0 >>> ($shr >>> 0);
    $and4 = $shr3 & 3;
    $cmp5 = ($and4 | 0) == 0;
    if ($cmp5) {
      label = 13;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $neg = $shr3 & 1;
    $and7 = $neg ^ 1;
    $add8 = $and7 + $shr | 0;
    $shl = $add8 << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $1 = $arrayidx;
    $arrayidx_sum = $shl + 2 | 0;
    $2 = 400 + ($arrayidx_sum << 2) | 0;
    $3 = HEAP32[$2 >> 2] | 0;
    $fd9 = $3 + 8 | 0;
    $4 = HEAP32[$fd9 >> 2] | 0;
    $cmp10 = ($1 | 0) == ($4 | 0);
    if ($cmp10) {
      label = 7;
      break;
    } else {
      label = 8;
      break;
    }
   case 7:
    $shl12 = 1 << $add8;
    $neg13 = $shl12 ^ -1;
    $and14 = $0 & $neg13;
    HEAP32[90] = $and14;
    label = 12;
    break;
   case 8:
    $5 = $4;
    $6 = HEAP32[94] | 0;
    $cmp15 = $5 >>> 0 < $6 >>> 0;
    if ($cmp15) {
      label = 11;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $bk = $4 + 12 | 0;
    $7 = HEAP32[$bk >> 2] | 0;
    $cmp16 = ($7 | 0) == ($3 | 0);
    if ($cmp16) {
      label = 10;
      break;
    } else {
      label = 11;
      break;
    }
   case 10:
    HEAP32[$bk >> 2] = $1;
    HEAP32[$2 >> 2] = $4;
    label = 12;
    break;
   case 11:
    _abort();
    return 0;
    return 0;
   case 12:
    $shl22 = $add8 << 3;
    $or23 = $shl22 | 3;
    $head = $3 + 4 | 0;
    HEAP32[$head >> 2] = $or23;
    $8 = $3;
    $add_ptr_sum106 = $shl22 | 4;
    $head25 = $8 + $add_ptr_sum106 | 0;
    $9 = $head25;
    $10 = HEAP32[$9 >> 2] | 0;
    $or26 = $10 | 1;
    HEAP32[$9 >> 2] = $or26;
    $11 = $fd9;
    $mem_0 = $11;
    label = 41;
    break;
   case 13:
    $12 = HEAP32[92] | 0;
    $cmp29 = $cond >>> 0 > $12 >>> 0;
    if ($cmp29) {
      label = 14;
      break;
    } else {
      $nb_0 = $cond;
      label = 33;
      break;
    }
   case 14:
    $cmp31 = ($shr3 | 0) == 0;
    if ($cmp31) {
      label = 28;
      break;
    } else {
      label = 15;
      break;
    }
   case 15:
    $shl35 = $shr3 << $shr;
    $shl37 = 2 << $shr;
    $sub = -$shl37 | 0;
    $or40 = $shl37 | $sub;
    $and41 = $shl35 & $or40;
    $sub42 = -$and41 | 0;
    $and43 = $and41 & $sub42;
    $sub44 = $and43 - 1 | 0;
    $shr45 = $sub44 >>> 12;
    $and46 = $shr45 & 16;
    $shr47 = $sub44 >>> ($and46 >>> 0);
    $shr48 = $shr47 >>> 5;
    $and49 = $shr48 & 8;
    $add50 = $and49 | $and46;
    $shr51 = $shr47 >>> ($and49 >>> 0);
    $shr52 = $shr51 >>> 2;
    $and53 = $shr52 & 4;
    $add54 = $add50 | $and53;
    $shr55 = $shr51 >>> ($and53 >>> 0);
    $shr56 = $shr55 >>> 1;
    $and57 = $shr56 & 2;
    $add58 = $add54 | $and57;
    $shr59 = $shr55 >>> ($and57 >>> 0);
    $shr60 = $shr59 >>> 1;
    $and61 = $shr60 & 1;
    $add62 = $add58 | $and61;
    $shr63 = $shr59 >>> ($and61 >>> 0);
    $add64 = $add62 + $shr63 | 0;
    $shl65 = $add64 << 1;
    $arrayidx66 = 400 + ($shl65 << 2) | 0;
    $13 = $arrayidx66;
    $arrayidx66_sum = $shl65 + 2 | 0;
    $14 = 400 + ($arrayidx66_sum << 2) | 0;
    $15 = HEAP32[$14 >> 2] | 0;
    $fd69 = $15 + 8 | 0;
    $16 = HEAP32[$fd69 >> 2] | 0;
    $cmp70 = ($13 | 0) == ($16 | 0);
    if ($cmp70) {
      label = 16;
      break;
    } else {
      label = 17;
      break;
    }
   case 16:
    $shl72 = 1 << $add64;
    $neg73 = $shl72 ^ -1;
    $and74 = $0 & $neg73;
    HEAP32[90] = $and74;
    label = 21;
    break;
   case 17:
    $17 = $16;
    $18 = HEAP32[94] | 0;
    $cmp76 = $17 >>> 0 < $18 >>> 0;
    if ($cmp76) {
      label = 20;
      break;
    } else {
      label = 18;
      break;
    }
   case 18:
    $bk78 = $16 + 12 | 0;
    $19 = HEAP32[$bk78 >> 2] | 0;
    $cmp79 = ($19 | 0) == ($15 | 0);
    if ($cmp79) {
      label = 19;
      break;
    } else {
      label = 20;
      break;
    }
   case 19:
    HEAP32[$bk78 >> 2] = $13;
    HEAP32[$14 >> 2] = $16;
    label = 21;
    break;
   case 20:
    _abort();
    return 0;
    return 0;
   case 21:
    $shl90 = $add64 << 3;
    $sub91 = $shl90 - $cond | 0;
    $or93 = $cond | 3;
    $head94 = $15 + 4 | 0;
    HEAP32[$head94 >> 2] = $or93;
    $20 = $15;
    $add_ptr95 = $20 + $cond | 0;
    $21 = $add_ptr95;
    $or96 = $sub91 | 1;
    $add_ptr95_sum103 = $cond | 4;
    $head97 = $20 + $add_ptr95_sum103 | 0;
    $22 = $head97;
    HEAP32[$22 >> 2] = $or96;
    $add_ptr98 = $20 + $shl90 | 0;
    $prev_foot = $add_ptr98;
    HEAP32[$prev_foot >> 2] = $sub91;
    $23 = HEAP32[92] | 0;
    $cmp99 = ($23 | 0) == 0;
    if ($cmp99) {
      label = 27;
      break;
    } else {
      label = 22;
      break;
    }
   case 22:
    $24 = HEAP32[95] | 0;
    $shr101 = $23 >>> 3;
    $shl102 = $shr101 << 1;
    $arrayidx103 = 400 + ($shl102 << 2) | 0;
    $25 = $arrayidx103;
    $26 = HEAP32[90] | 0;
    $shl105 = 1 << $shr101;
    $and106 = $26 & $shl105;
    $tobool107 = ($and106 | 0) == 0;
    if ($tobool107) {
      label = 23;
      break;
    } else {
      label = 24;
      break;
    }
   case 23:
    $or110 = $26 | $shl105;
    HEAP32[90] = $or110;
    $F104_0 = $25;
    label = 26;
    break;
   case 24:
    $arrayidx103_sum104 = $shl102 + 2 | 0;
    $27 = 400 + ($arrayidx103_sum104 << 2) | 0;
    $28 = HEAP32[$27 >> 2] | 0;
    $29 = $28;
    $30 = HEAP32[94] | 0;
    $cmp113 = $29 >>> 0 < $30 >>> 0;
    if ($cmp113) {
      label = 25;
      break;
    } else {
      $F104_0 = $28;
      label = 26;
      break;
    }
   case 25:
    _abort();
    return 0;
    return 0;
   case 26:
    $arrayidx103_sum = $shl102 + 2 | 0;
    $31 = 400 + ($arrayidx103_sum << 2) | 0;
    HEAP32[$31 >> 2] = $24;
    $bk122 = $F104_0 + 12 | 0;
    HEAP32[$bk122 >> 2] = $24;
    $fd123 = $24 + 8 | 0;
    HEAP32[$fd123 >> 2] = $F104_0;
    $bk124 = $24 + 12 | 0;
    HEAP32[$bk124 >> 2] = $25;
    label = 27;
    break;
   case 27:
    HEAP32[92] = $sub91;
    HEAP32[95] = $21;
    $32 = $fd69;
    $mem_0 = $32;
    label = 41;
    break;
   case 28:
    $33 = HEAP32[91] | 0;
    $cmp128 = ($33 | 0) == 0;
    if ($cmp128) {
      $nb_0 = $cond;
      label = 33;
      break;
    } else {
      label = 29;
      break;
    }
   case 29:
    $call = _tmalloc_small($cond) | 0;
    $cmp130 = ($call | 0) == 0;
    if ($cmp130) {
      $nb_0 = $cond;
      label = 33;
      break;
    } else {
      $mem_0 = $call;
      label = 41;
      break;
    }
   case 30:
    $cmp138 = $bytes >>> 0 > 4294967231;
    if ($cmp138) {
      $nb_0 = -1;
      label = 33;
      break;
    } else {
      label = 31;
      break;
    }
   case 31:
    $add143 = $bytes + 11 | 0;
    $and144 = $add143 & -8;
    $34 = HEAP32[91] | 0;
    $cmp145 = ($34 | 0) == 0;
    if ($cmp145) {
      $nb_0 = $and144;
      label = 33;
      break;
    } else {
      label = 32;
      break;
    }
   case 32:
    $call148 = _tmalloc_large($and144) | 0;
    $cmp149 = ($call148 | 0) == 0;
    if ($cmp149) {
      $nb_0 = $and144;
      label = 33;
      break;
    } else {
      $mem_0 = $call148;
      label = 41;
      break;
    }
   case 33:
    $35 = HEAP32[92] | 0;
    $cmp155 = $nb_0 >>> 0 > $35 >>> 0;
    if ($cmp155) {
      label = 38;
      break;
    } else {
      label = 34;
      break;
    }
   case 34:
    $sub159 = $35 - $nb_0 | 0;
    $36 = HEAP32[95] | 0;
    $cmp161 = $sub159 >>> 0 > 15;
    if ($cmp161) {
      label = 35;
      break;
    } else {
      label = 36;
      break;
    }
   case 35:
    $37 = $36;
    $add_ptr165 = $37 + $nb_0 | 0;
    $38 = $add_ptr165;
    HEAP32[95] = $38;
    HEAP32[92] = $sub159;
    $or166 = $sub159 | 1;
    $add_ptr165_sum = $nb_0 + 4 | 0;
    $head167 = $37 + $add_ptr165_sum | 0;
    $39 = $head167;
    HEAP32[$39 >> 2] = $or166;
    $add_ptr168 = $37 + $35 | 0;
    $prev_foot169 = $add_ptr168;
    HEAP32[$prev_foot169 >> 2] = $sub159;
    $or171 = $nb_0 | 3;
    $head172 = $36 + 4 | 0;
    HEAP32[$head172 >> 2] = $or171;
    label = 37;
    break;
   case 36:
    HEAP32[92] = 0;
    HEAP32[95] = 0;
    $or175 = $35 | 3;
    $head176 = $36 + 4 | 0;
    HEAP32[$head176 >> 2] = $or175;
    $40 = $36;
    $add_ptr177_sum = $35 + 4 | 0;
    $head178 = $40 + $add_ptr177_sum | 0;
    $41 = $head178;
    $42 = HEAP32[$41 >> 2] | 0;
    $or179 = $42 | 1;
    HEAP32[$41 >> 2] = $or179;
    label = 37;
    break;
   case 37:
    $add_ptr181 = $36 + 8 | 0;
    $43 = $add_ptr181;
    $mem_0 = $43;
    label = 41;
    break;
   case 38:
    $44 = HEAP32[93] | 0;
    $cmp183 = $nb_0 >>> 0 < $44 >>> 0;
    if ($cmp183) {
      label = 39;
      break;
    } else {
      label = 40;
      break;
    }
   case 39:
    $sub187 = $44 - $nb_0 | 0;
    HEAP32[93] = $sub187;
    $45 = HEAP32[96] | 0;
    $46 = $45;
    $add_ptr190 = $46 + $nb_0 | 0;
    $47 = $add_ptr190;
    HEAP32[96] = $47;
    $or191 = $sub187 | 1;
    $add_ptr190_sum = $nb_0 + 4 | 0;
    $head192 = $46 + $add_ptr190_sum | 0;
    $48 = $head192;
    HEAP32[$48 >> 2] = $or191;
    $or194 = $nb_0 | 3;
    $head195 = $45 + 4 | 0;
    HEAP32[$head195 >> 2] = $or194;
    $add_ptr196 = $45 + 8 | 0;
    $49 = $add_ptr196;
    $mem_0 = $49;
    label = 41;
    break;
   case 40:
    $call199 = _sys_alloc($nb_0) | 0;
    $mem_0 = $call199;
    label = 41;
    break;
   case 41:
    return $mem_0 | 0;
  }
  return 0;
}
function _tmalloc_small($nb) {
  $nb = $nb | 0;
  var $0 = 0, $sub = 0, $and = 0, $sub2 = 0, $shr = 0, $and3 = 0, $shr4 = 0, $shr5 = 0, $and6 = 0, $add = 0, $shr7 = 0, $shr8 = 0, $and9 = 0, $add10 = 0, $shr11 = 0, $shr12 = 0, $and13 = 0, $add14 = 0, $shr15 = 0, $shr16 = 0, $and17 = 0, $add18 = 0, $shr19 = 0, $add20 = 0, $arrayidx = 0, $1 = 0, $head = 0, $2 = 0, $and21 = 0, $sub22 = 0, $rsize_0 = 0, $v_0 = 0, $t_0 = 0, $arrayidx23 = 0, $3 = 0, $cmp = 0, $arrayidx27 = 0, $4 = 0, $cmp28 = 0, $cond7 = 0, $head29 = 0, $5 = 0, $and30 = 0, $sub31 = 0, $cmp32 = 0, $sub31_rsize_0 = 0, $cond_v_0 = 0, $6 = 0, $7 = 0, $cmp33 = 0, $add_ptr = 0, $8 = 0, $cmp35 = 0, $parent = 0, $9 = 0, $bk = 0, $10 = 0, $cmp40 = 0, $fd = 0, $11 = 0, $12 = 0, $cmp45 = 0, $bk47 = 0, $13 = 0, $cmp48 = 0, $fd50 = 0, $14 = 0, $cmp51 = 0, $arrayidx61 = 0, $15 = 0, $cmp62 = 0, $arrayidx65 = 0, $16 = 0, $cmp66 = 0, $RP_0 = 0, $R_0 = 0, $arrayidx71 = 0, $17 = 0, $cmp72 = 0, $arrayidx75 = 0, $18 = 0, $cmp76 = 0, $CP_0 = 0, $19 = 0, $20 = 0, $21 = 0, $cmp81 = 0, $R_1 = 0, $cmp90 = 0, $index = 0, $22 = 0, $arrayidx94 = 0, $23 = 0, $cmp95 = 0, $cond5 = 0, $24 = 0, $shl = 0, $neg = 0, $25 = 0, $and103 = 0, $26 = 0, $27 = 0, $cmp107 = 0, $arrayidx113 = 0, $28 = 0, $cmp114 = 0, $arrayidx121 = 0, $cmp126 = 0, $29 = 0, $30 = 0, $cmp130 = 0, $parent135 = 0, $arrayidx137 = 0, $31 = 0, $cmp138 = 0, $32 = 0, $33 = 0, $cmp142 = 0, $arrayidx148 = 0, $parent149 = 0, $arrayidx154 = 0, $34 = 0, $cmp155 = 0, $35 = 0, $36 = 0, $cmp159 = 0, $arrayidx165 = 0, $parent166 = 0, $cmp174 = 0, $add177 = 0, $or178 = 0, $head179 = 0, $add_ptr181_sum = 0, $head182 = 0, $37 = 0, $38 = 0, $or183 = 0, $or186 = 0, $head187 = 0, $or188 = 0, $add_ptr_sum = 0, $head189 = 0, $39 = 0, $add_ptr_sum1 = 0, $add_ptr190 = 0, $prev_foot = 0, $40 = 0, $cmp191 = 0, $41 = 0, $shr194 = 0, $shl195 = 0, $arrayidx196 = 0, $42 = 0, $43 = 0, $shl198 = 0, $and199 = 0, $tobool200 = 0, $or204 = 0, $arrayidx196_sum2 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $cmp208 = 0, $F197_0 = 0, $arrayidx196_sum = 0, $48 = 0, $bk218 = 0, $fd219 = 0, $bk220 = 0, $add_ptr225 = 0, $49 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = HEAP32[91] | 0;
    $sub = -$0 | 0;
    $and = $0 & $sub;
    $sub2 = $and - 1 | 0;
    $shr = $sub2 >>> 12;
    $and3 = $shr & 16;
    $shr4 = $sub2 >>> ($and3 >>> 0);
    $shr5 = $shr4 >>> 5;
    $and6 = $shr5 & 8;
    $add = $and6 | $and3;
    $shr7 = $shr4 >>> ($and6 >>> 0);
    $shr8 = $shr7 >>> 2;
    $and9 = $shr8 & 4;
    $add10 = $add | $and9;
    $shr11 = $shr7 >>> ($and9 >>> 0);
    $shr12 = $shr11 >>> 1;
    $and13 = $shr12 & 2;
    $add14 = $add10 | $and13;
    $shr15 = $shr11 >>> ($and13 >>> 0);
    $shr16 = $shr15 >>> 1;
    $and17 = $shr16 & 1;
    $add18 = $add14 | $and17;
    $shr19 = $shr15 >>> ($and17 >>> 0);
    $add20 = $add18 + $shr19 | 0;
    $arrayidx = 664 + ($add20 << 2) | 0;
    $1 = HEAP32[$arrayidx >> 2] | 0;
    $head = $1 + 4 | 0;
    $2 = HEAP32[$head >> 2] | 0;
    $and21 = $2 & -8;
    $sub22 = $and21 - $nb | 0;
    $t_0 = $1;
    $v_0 = $1;
    $rsize_0 = $sub22;
    label = 3;
    break;
   case 3:
    $arrayidx23 = $t_0 + 16 | 0;
    $3 = HEAP32[$arrayidx23 >> 2] | 0;
    $cmp = ($3 | 0) == 0;
    if ($cmp) {
      label = 4;
      break;
    } else {
      $cond7 = $3;
      label = 5;
      break;
    }
   case 4:
    $arrayidx27 = $t_0 + 20 | 0;
    $4 = HEAP32[$arrayidx27 >> 2] | 0;
    $cmp28 = ($4 | 0) == 0;
    if ($cmp28) {
      label = 6;
      break;
    } else {
      $cond7 = $4;
      label = 5;
      break;
    }
   case 5:
    $head29 = $cond7 + 4 | 0;
    $5 = HEAP32[$head29 >> 2] | 0;
    $and30 = $5 & -8;
    $sub31 = $and30 - $nb | 0;
    $cmp32 = $sub31 >>> 0 < $rsize_0 >>> 0;
    $sub31_rsize_0 = $cmp32 ? $sub31 : $rsize_0;
    $cond_v_0 = $cmp32 ? $cond7 : $v_0;
    $t_0 = $cond7;
    $v_0 = $cond_v_0;
    $rsize_0 = $sub31_rsize_0;
    label = 3;
    break;
   case 6:
    $6 = $v_0;
    $7 = HEAP32[94] | 0;
    $cmp33 = $6 >>> 0 < $7 >>> 0;
    if ($cmp33) {
      label = 52;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $add_ptr = $6 + $nb | 0;
    $8 = $add_ptr;
    $cmp35 = $6 >>> 0 < $add_ptr >>> 0;
    if ($cmp35) {
      label = 8;
      break;
    } else {
      label = 52;
      break;
    }
   case 8:
    $parent = $v_0 + 24 | 0;
    $9 = HEAP32[$parent >> 2] | 0;
    $bk = $v_0 + 12 | 0;
    $10 = HEAP32[$bk >> 2] | 0;
    $cmp40 = ($10 | 0) == ($v_0 | 0);
    if ($cmp40) {
      label = 14;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $fd = $v_0 + 8 | 0;
    $11 = HEAP32[$fd >> 2] | 0;
    $12 = $11;
    $cmp45 = $12 >>> 0 < $7 >>> 0;
    if ($cmp45) {
      label = 13;
      break;
    } else {
      label = 10;
      break;
    }
   case 10:
    $bk47 = $11 + 12 | 0;
    $13 = HEAP32[$bk47 >> 2] | 0;
    $cmp48 = ($13 | 0) == ($v_0 | 0);
    if ($cmp48) {
      label = 11;
      break;
    } else {
      label = 13;
      break;
    }
   case 11:
    $fd50 = $10 + 8 | 0;
    $14 = HEAP32[$fd50 >> 2] | 0;
    $cmp51 = ($14 | 0) == ($v_0 | 0);
    if ($cmp51) {
      label = 12;
      break;
    } else {
      label = 13;
      break;
    }
   case 12:
    HEAP32[$bk47 >> 2] = $10;
    HEAP32[$fd50 >> 2] = $11;
    $R_1 = $10;
    label = 22;
    break;
   case 13:
    _abort();
    return 0;
    return 0;
   case 14:
    $arrayidx61 = $v_0 + 20 | 0;
    $15 = HEAP32[$arrayidx61 >> 2] | 0;
    $cmp62 = ($15 | 0) == 0;
    if ($cmp62) {
      label = 15;
      break;
    } else {
      $R_0 = $15;
      $RP_0 = $arrayidx61;
      label = 16;
      break;
    }
   case 15:
    $arrayidx65 = $v_0 + 16 | 0;
    $16 = HEAP32[$arrayidx65 >> 2] | 0;
    $cmp66 = ($16 | 0) == 0;
    if ($cmp66) {
      $R_1 = 0;
      label = 22;
      break;
    } else {
      $R_0 = $16;
      $RP_0 = $arrayidx65;
      label = 16;
      break;
    }
   case 16:
    $arrayidx71 = $R_0 + 20 | 0;
    $17 = HEAP32[$arrayidx71 >> 2] | 0;
    $cmp72 = ($17 | 0) == 0;
    if ($cmp72) {
      label = 17;
      break;
    } else {
      $CP_0 = $arrayidx71;
      label = 18;
      break;
    }
   case 17:
    $arrayidx75 = $R_0 + 16 | 0;
    $18 = HEAP32[$arrayidx75 >> 2] | 0;
    $cmp76 = ($18 | 0) == 0;
    if ($cmp76) {
      label = 19;
      break;
    } else {
      $CP_0 = $arrayidx75;
      label = 18;
      break;
    }
   case 18:
    $19 = HEAP32[$CP_0 >> 2] | 0;
    $R_0 = $19;
    $RP_0 = $CP_0;
    label = 16;
    break;
   case 19:
    $20 = $RP_0;
    $21 = HEAP32[94] | 0;
    $cmp81 = $20 >>> 0 < $21 >>> 0;
    if ($cmp81) {
      label = 21;
      break;
    } else {
      label = 20;
      break;
    }
   case 20:
    HEAP32[$RP_0 >> 2] = 0;
    $R_1 = $R_0;
    label = 22;
    break;
   case 21:
    _abort();
    return 0;
    return 0;
   case 22:
    $cmp90 = ($9 | 0) == 0;
    if ($cmp90) {
      label = 42;
      break;
    } else {
      label = 23;
      break;
    }
   case 23:
    $index = $v_0 + 28 | 0;
    $22 = HEAP32[$index >> 2] | 0;
    $arrayidx94 = 664 + ($22 << 2) | 0;
    $23 = HEAP32[$arrayidx94 >> 2] | 0;
    $cmp95 = ($v_0 | 0) == ($23 | 0);
    if ($cmp95) {
      label = 24;
      break;
    } else {
      label = 26;
      break;
    }
   case 24:
    HEAP32[$arrayidx94 >> 2] = $R_1;
    $cond5 = ($R_1 | 0) == 0;
    if ($cond5) {
      label = 25;
      break;
    } else {
      label = 32;
      break;
    }
   case 25:
    $24 = HEAP32[$index >> 2] | 0;
    $shl = 1 << $24;
    $neg = $shl ^ -1;
    $25 = HEAP32[91] | 0;
    $and103 = $25 & $neg;
    HEAP32[91] = $and103;
    label = 42;
    break;
   case 26:
    $26 = $9;
    $27 = HEAP32[94] | 0;
    $cmp107 = $26 >>> 0 < $27 >>> 0;
    if ($cmp107) {
      label = 30;
      break;
    } else {
      label = 27;
      break;
    }
   case 27:
    $arrayidx113 = $9 + 16 | 0;
    $28 = HEAP32[$arrayidx113 >> 2] | 0;
    $cmp114 = ($28 | 0) == ($v_0 | 0);
    if ($cmp114) {
      label = 28;
      break;
    } else {
      label = 29;
      break;
    }
   case 28:
    HEAP32[$arrayidx113 >> 2] = $R_1;
    label = 31;
    break;
   case 29:
    $arrayidx121 = $9 + 20 | 0;
    HEAP32[$arrayidx121 >> 2] = $R_1;
    label = 31;
    break;
   case 30:
    _abort();
    return 0;
    return 0;
   case 31:
    $cmp126 = ($R_1 | 0) == 0;
    if ($cmp126) {
      label = 42;
      break;
    } else {
      label = 32;
      break;
    }
   case 32:
    $29 = $R_1;
    $30 = HEAP32[94] | 0;
    $cmp130 = $29 >>> 0 < $30 >>> 0;
    if ($cmp130) {
      label = 41;
      break;
    } else {
      label = 33;
      break;
    }
   case 33:
    $parent135 = $R_1 + 24 | 0;
    HEAP32[$parent135 >> 2] = $9;
    $arrayidx137 = $v_0 + 16 | 0;
    $31 = HEAP32[$arrayidx137 >> 2] | 0;
    $cmp138 = ($31 | 0) == 0;
    if ($cmp138) {
      label = 37;
      break;
    } else {
      label = 34;
      break;
    }
   case 34:
    $32 = $31;
    $33 = HEAP32[94] | 0;
    $cmp142 = $32 >>> 0 < $33 >>> 0;
    if ($cmp142) {
      label = 36;
      break;
    } else {
      label = 35;
      break;
    }
   case 35:
    $arrayidx148 = $R_1 + 16 | 0;
    HEAP32[$arrayidx148 >> 2] = $31;
    $parent149 = $31 + 24 | 0;
    HEAP32[$parent149 >> 2] = $R_1;
    label = 37;
    break;
   case 36:
    _abort();
    return 0;
    return 0;
   case 37:
    $arrayidx154 = $v_0 + 20 | 0;
    $34 = HEAP32[$arrayidx154 >> 2] | 0;
    $cmp155 = ($34 | 0) == 0;
    if ($cmp155) {
      label = 42;
      break;
    } else {
      label = 38;
      break;
    }
   case 38:
    $35 = $34;
    $36 = HEAP32[94] | 0;
    $cmp159 = $35 >>> 0 < $36 >>> 0;
    if ($cmp159) {
      label = 40;
      break;
    } else {
      label = 39;
      break;
    }
   case 39:
    $arrayidx165 = $R_1 + 20 | 0;
    HEAP32[$arrayidx165 >> 2] = $34;
    $parent166 = $34 + 24 | 0;
    HEAP32[$parent166 >> 2] = $R_1;
    label = 42;
    break;
   case 40:
    _abort();
    return 0;
    return 0;
   case 41:
    _abort();
    return 0;
    return 0;
   case 42:
    $cmp174 = $rsize_0 >>> 0 < 16;
    if ($cmp174) {
      label = 43;
      break;
    } else {
      label = 44;
      break;
    }
   case 43:
    $add177 = $rsize_0 + $nb | 0;
    $or178 = $add177 | 3;
    $head179 = $v_0 + 4 | 0;
    HEAP32[$head179 >> 2] = $or178;
    $add_ptr181_sum = $add177 + 4 | 0;
    $head182 = $6 + $add_ptr181_sum | 0;
    $37 = $head182;
    $38 = HEAP32[$37 >> 2] | 0;
    $or183 = $38 | 1;
    HEAP32[$37 >> 2] = $or183;
    label = 51;
    break;
   case 44:
    $or186 = $nb | 3;
    $head187 = $v_0 + 4 | 0;
    HEAP32[$head187 >> 2] = $or186;
    $or188 = $rsize_0 | 1;
    $add_ptr_sum = $nb + 4 | 0;
    $head189 = $6 + $add_ptr_sum | 0;
    $39 = $head189;
    HEAP32[$39 >> 2] = $or188;
    $add_ptr_sum1 = $rsize_0 + $nb | 0;
    $add_ptr190 = $6 + $add_ptr_sum1 | 0;
    $prev_foot = $add_ptr190;
    HEAP32[$prev_foot >> 2] = $rsize_0;
    $40 = HEAP32[92] | 0;
    $cmp191 = ($40 | 0) == 0;
    if ($cmp191) {
      label = 50;
      break;
    } else {
      label = 45;
      break;
    }
   case 45:
    $41 = HEAP32[95] | 0;
    $shr194 = $40 >>> 3;
    $shl195 = $shr194 << 1;
    $arrayidx196 = 400 + ($shl195 << 2) | 0;
    $42 = $arrayidx196;
    $43 = HEAP32[90] | 0;
    $shl198 = 1 << $shr194;
    $and199 = $43 & $shl198;
    $tobool200 = ($and199 | 0) == 0;
    if ($tobool200) {
      label = 46;
      break;
    } else {
      label = 47;
      break;
    }
   case 46:
    $or204 = $43 | $shl198;
    HEAP32[90] = $or204;
    $F197_0 = $42;
    label = 49;
    break;
   case 47:
    $arrayidx196_sum2 = $shl195 + 2 | 0;
    $44 = 400 + ($arrayidx196_sum2 << 2) | 0;
    $45 = HEAP32[$44 >> 2] | 0;
    $46 = $45;
    $47 = HEAP32[94] | 0;
    $cmp208 = $46 >>> 0 < $47 >>> 0;
    if ($cmp208) {
      label = 48;
      break;
    } else {
      $F197_0 = $45;
      label = 49;
      break;
    }
   case 48:
    _abort();
    return 0;
    return 0;
   case 49:
    $arrayidx196_sum = $shl195 + 2 | 0;
    $48 = 400 + ($arrayidx196_sum << 2) | 0;
    HEAP32[$48 >> 2] = $41;
    $bk218 = $F197_0 + 12 | 0;
    HEAP32[$bk218 >> 2] = $41;
    $fd219 = $41 + 8 | 0;
    HEAP32[$fd219 >> 2] = $F197_0;
    $bk220 = $41 + 12 | 0;
    HEAP32[$bk220 >> 2] = $42;
    label = 50;
    break;
   case 50:
    HEAP32[92] = $rsize_0;
    HEAP32[95] = $8;
    label = 51;
    break;
   case 51:
    $add_ptr225 = $v_0 + 8 | 0;
    $49 = $add_ptr225;
    return $49 | 0;
   case 52:
    _abort();
    return 0;
    return 0;
  }
  return 0;
}
function _tmalloc_large($nb) {
  $nb = $nb | 0;
  var $sub = 0, $shr = 0, $cmp = 0, $cmp1 = 0, $sub4 = 0, $shr5 = 0, $and = 0, $shl = 0, $sub6 = 0, $shr7 = 0, $and8 = 0, $add = 0, $shl9 = 0, $sub10 = 0, $shr11 = 0, $and12 = 0, $add13 = 0, $sub14 = 0, $shl15 = 0, $shr16 = 0, $add17 = 0, $shl18 = 0, $add19 = 0, $shr20 = 0, $and21 = 0, $add22 = 0, $idx_0 = 0, $arrayidx = 0, $0 = 0, $cmp24 = 0, $cmp26 = 0, $shr27 = 0, $sub30 = 0, $cond = 0, $shl31 = 0, $rst_0 = 0, $sizebits_0 = 0, $t_0 = 0, $rsize_0 = 0, $v_0 = 0, $head = 0, $1 = 0, $and32 = 0, $sub33 = 0, $cmp34 = 0, $cmp36 = 0, $rsize_1 = 0, $v_1 = 0, $arrayidx40 = 0, $2 = 0, $shr41 = 0, $arrayidx44 = 0, $3 = 0, $cmp45 = 0, $cmp46 = 0, $or_cond = 0, $rst_1 = 0, $cmp49 = 0, $shl52 = 0, $t_1 = 0, $rsize_2 = 0, $v_2 = 0, $cmp54 = 0, $cmp56 = 0, $or_cond18 = 0, $shl59 = 0, $sub62 = 0, $or = 0, $4 = 0, $and63 = 0, $cmp64 = 0, $sub66 = 0, $and67 = 0, $sub69 = 0, $shr71 = 0, $and72 = 0, $shr74 = 0, $shr75 = 0, $and76 = 0, $add77 = 0, $shr78 = 0, $shr79 = 0, $and80 = 0, $add81 = 0, $shr82 = 0, $shr83 = 0, $and84 = 0, $add85 = 0, $shr86 = 0, $shr87 = 0, $and88 = 0, $add89 = 0, $shr90 = 0, $add91 = 0, $arrayidx93 = 0, $5 = 0, $t_2_ph = 0, $cmp9623 = 0, $v_326 = 0, $rsize_325 = 0, $t_224 = 0, $head98 = 0, $6 = 0, $and99 = 0, $sub100 = 0, $cmp101 = 0, $sub100_rsize_3 = 0, $t_2_v_3 = 0, $arrayidx105 = 0, $7 = 0, $cmp106 = 0, $arrayidx112 = 0, $8 = 0, $cmp96 = 0, $v_3_lcssa = 0, $rsize_3_lcssa = 0, $cmp115 = 0, $9 = 0, $sub117 = 0, $cmp118 = 0, $10 = 0, $11 = 0, $cmp120 = 0, $add_ptr = 0, $12 = 0, $cmp122 = 0, $parent = 0, $13 = 0, $bk = 0, $14 = 0, $cmp127 = 0, $fd = 0, $15 = 0, $16 = 0, $cmp132 = 0, $bk135 = 0, $17 = 0, $cmp136 = 0, $fd138 = 0, $18 = 0, $cmp139 = 0, $arrayidx150 = 0, $19 = 0, $cmp151 = 0, $arrayidx154 = 0, $20 = 0, $cmp155 = 0, $RP_0 = 0, $R_0 = 0, $arrayidx160 = 0, $21 = 0, $cmp161 = 0, $arrayidx164 = 0, $22 = 0, $cmp165 = 0, $CP_0 = 0, $23 = 0, $24 = 0, $25 = 0, $cmp170 = 0, $R_1 = 0, $cmp179 = 0, $index = 0, $26 = 0, $arrayidx183 = 0, $27 = 0, $cmp184 = 0, $cond20 = 0, $28 = 0, $shl191 = 0, $neg = 0, $29 = 0, $and193 = 0, $30 = 0, $31 = 0, $cmp197 = 0, $arrayidx203 = 0, $32 = 0, $cmp204 = 0, $arrayidx211 = 0, $cmp216 = 0, $33 = 0, $34 = 0, $cmp220 = 0, $parent225 = 0, $arrayidx227 = 0, $35 = 0, $cmp228 = 0, $36 = 0, $37 = 0, $cmp232 = 0, $arrayidx238 = 0, $parent239 = 0, $arrayidx244 = 0, $38 = 0, $cmp245 = 0, $39 = 0, $40 = 0, $cmp249 = 0, $arrayidx255 = 0, $parent256 = 0, $cmp264 = 0, $add267 = 0, $or269 = 0, $head270 = 0, $add_ptr272_sum = 0, $head273 = 0, $41 = 0, $42 = 0, $or274 = 0, $or277 = 0, $head278 = 0, $or279 = 0, $add_ptr_sum = 0, $head280 = 0, $43 = 0, $add_ptr_sum1 = 0, $add_ptr281 = 0, $prev_foot = 0, $shr282 = 0, $cmp283 = 0, $shl287 = 0, $arrayidx288 = 0, $44 = 0, $45 = 0, $shl290 = 0, $and291 = 0, $tobool292 = 0, $or296 = 0, $arrayidx288_sum16 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $cmp300 = 0, $F289_0 = 0, $arrayidx288_sum = 0, $50 = 0, $bk310 = 0, $add_ptr_sum14 = 0, $fd311 = 0, $51 = 0, $add_ptr_sum15 = 0, $bk312 = 0, $52 = 0, $53 = 0, $shr317 = 0, $cmp318 = 0, $cmp322 = 0, $sub328 = 0, $shr329 = 0, $and330 = 0, $shl332 = 0, $sub333 = 0, $shr334 = 0, $and335 = 0, $add336 = 0, $shl337 = 0, $sub338 = 0, $shr339 = 0, $and340 = 0, $add341 = 0, $sub342 = 0, $shl343 = 0, $shr344 = 0, $add345 = 0, $shl346 = 0, $add347 = 0, $shr348 = 0, $and349 = 0, $add350 = 0, $I315_0 = 0, $arrayidx354 = 0, $add_ptr_sum2 = 0, $index355 = 0, $54 = 0, $add_ptr_sum3 = 0, $child356 = 0, $child356_sum = 0, $arrayidx357 = 0, $55 = 0, $arrayidx359 = 0, $56 = 0, $shl361 = 0, $and362 = 0, $tobool363 = 0, $or367 = 0, $57 = 0, $add_ptr_sum4 = 0, $parent368 = 0, $58 = 0, $add_ptr_sum5 = 0, $bk369 = 0, $59 = 0, $add_ptr_sum6 = 0, $fd370 = 0, $60 = 0, $61 = 0, $cmp373 = 0, $shr377 = 0, $sub380 = 0, $cond382 = 0, $shl383 = 0, $T_0 = 0, $K372_0 = 0, $head385 = 0, $62 = 0, $and386 = 0, $cmp387 = 0, $shr390 = 0, $arrayidx393 = 0, $63 = 0, $cmp395 = 0, $shl394 = 0, $64 = 0, $65 = 0, $cmp400 = 0, $add_ptr_sum11 = 0, $parent405 = 0, $66 = 0, $add_ptr_sum12 = 0, $bk406 = 0, $67 = 0, $add_ptr_sum13 = 0, $fd407 = 0, $68 = 0, $fd412 = 0, $69 = 0, $70 = 0, $71 = 0, $cmp414 = 0, $72 = 0, $cmp418 = 0, $bk425 = 0, $add_ptr_sum8 = 0, $fd427 = 0, $73 = 0, $add_ptr_sum9 = 0, $bk428 = 0, $74 = 0, $add_ptr_sum10 = 0, $parent429 = 0, $75 = 0, $add_ptr436 = 0, $76 = 0, $retval_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $sub = -$nb | 0;
    $shr = $nb >>> 8;
    $cmp = ($shr | 0) == 0;
    if ($cmp) {
      $idx_0 = 0;
      label = 5;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $cmp1 = $nb >>> 0 > 16777215;
    if ($cmp1) {
      $idx_0 = 31;
      label = 5;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $sub4 = $shr + 1048320 | 0;
    $shr5 = $sub4 >>> 16;
    $and = $shr5 & 8;
    $shl = $shr << $and;
    $sub6 = $shl + 520192 | 0;
    $shr7 = $sub6 >>> 16;
    $and8 = $shr7 & 4;
    $add = $and8 | $and;
    $shl9 = $shl << $and8;
    $sub10 = $shl9 + 245760 | 0;
    $shr11 = $sub10 >>> 16;
    $and12 = $shr11 & 2;
    $add13 = $add | $and12;
    $sub14 = 14 - $add13 | 0;
    $shl15 = $shl9 << $and12;
    $shr16 = $shl15 >>> 15;
    $add17 = $sub14 + $shr16 | 0;
    $shl18 = $add17 << 1;
    $add19 = $add17 + 7 | 0;
    $shr20 = $nb >>> ($add19 >>> 0);
    $and21 = $shr20 & 1;
    $add22 = $and21 | $shl18;
    $idx_0 = $add22;
    label = 5;
    break;
   case 5:
    $arrayidx = 664 + ($idx_0 << 2) | 0;
    $0 = HEAP32[$arrayidx >> 2] | 0;
    $cmp24 = ($0 | 0) == 0;
    if ($cmp24) {
      $v_2 = 0;
      $rsize_2 = $sub;
      $t_1 = 0;
      label = 12;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $cmp26 = ($idx_0 | 0) == 31;
    if ($cmp26) {
      $cond = 0;
      label = 8;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $shr27 = $idx_0 >>> 1;
    $sub30 = 25 - $shr27 | 0;
    $cond = $sub30;
    label = 8;
    break;
   case 8:
    $shl31 = $nb << $cond;
    $v_0 = 0;
    $rsize_0 = $sub;
    $t_0 = $0;
    $sizebits_0 = $shl31;
    $rst_0 = 0;
    label = 9;
    break;
   case 9:
    $head = $t_0 + 4 | 0;
    $1 = HEAP32[$head >> 2] | 0;
    $and32 = $1 & -8;
    $sub33 = $and32 - $nb | 0;
    $cmp34 = $sub33 >>> 0 < $rsize_0 >>> 0;
    if ($cmp34) {
      label = 10;
      break;
    } else {
      $v_1 = $v_0;
      $rsize_1 = $rsize_0;
      label = 11;
      break;
    }
   case 10:
    $cmp36 = ($and32 | 0) == ($nb | 0);
    if ($cmp36) {
      $v_2 = $t_0;
      $rsize_2 = $sub33;
      $t_1 = $t_0;
      label = 12;
      break;
    } else {
      $v_1 = $t_0;
      $rsize_1 = $sub33;
      label = 11;
      break;
    }
   case 11:
    $arrayidx40 = $t_0 + 20 | 0;
    $2 = HEAP32[$arrayidx40 >> 2] | 0;
    $shr41 = $sizebits_0 >>> 31;
    $arrayidx44 = $t_0 + 16 + ($shr41 << 2) | 0;
    $3 = HEAP32[$arrayidx44 >> 2] | 0;
    $cmp45 = ($2 | 0) == 0;
    $cmp46 = ($2 | 0) == ($3 | 0);
    $or_cond = $cmp45 | $cmp46;
    $rst_1 = $or_cond ? $rst_0 : $2;
    $cmp49 = ($3 | 0) == 0;
    $shl52 = $sizebits_0 << 1;
    if ($cmp49) {
      $v_2 = $v_1;
      $rsize_2 = $rsize_1;
      $t_1 = $rst_1;
      label = 12;
      break;
    } else {
      $v_0 = $v_1;
      $rsize_0 = $rsize_1;
      $t_0 = $3;
      $sizebits_0 = $shl52;
      $rst_0 = $rst_1;
      label = 9;
      break;
    }
   case 12:
    $cmp54 = ($t_1 | 0) == 0;
    $cmp56 = ($v_2 | 0) == 0;
    $or_cond18 = $cmp54 & $cmp56;
    if ($or_cond18) {
      label = 13;
      break;
    } else {
      $t_2_ph = $t_1;
      label = 15;
      break;
    }
   case 13:
    $shl59 = 2 << $idx_0;
    $sub62 = -$shl59 | 0;
    $or = $shl59 | $sub62;
    $4 = HEAP32[91] | 0;
    $and63 = $4 & $or;
    $cmp64 = ($and63 | 0) == 0;
    if ($cmp64) {
      $t_2_ph = $t_1;
      label = 15;
      break;
    } else {
      label = 14;
      break;
    }
   case 14:
    $sub66 = -$and63 | 0;
    $and67 = $and63 & $sub66;
    $sub69 = $and67 - 1 | 0;
    $shr71 = $sub69 >>> 12;
    $and72 = $shr71 & 16;
    $shr74 = $sub69 >>> ($and72 >>> 0);
    $shr75 = $shr74 >>> 5;
    $and76 = $shr75 & 8;
    $add77 = $and76 | $and72;
    $shr78 = $shr74 >>> ($and76 >>> 0);
    $shr79 = $shr78 >>> 2;
    $and80 = $shr79 & 4;
    $add81 = $add77 | $and80;
    $shr82 = $shr78 >>> ($and80 >>> 0);
    $shr83 = $shr82 >>> 1;
    $and84 = $shr83 & 2;
    $add85 = $add81 | $and84;
    $shr86 = $shr82 >>> ($and84 >>> 0);
    $shr87 = $shr86 >>> 1;
    $and88 = $shr87 & 1;
    $add89 = $add85 | $and88;
    $shr90 = $shr86 >>> ($and88 >>> 0);
    $add91 = $add89 + $shr90 | 0;
    $arrayidx93 = 664 + ($add91 << 2) | 0;
    $5 = HEAP32[$arrayidx93 >> 2] | 0;
    $t_2_ph = $5;
    label = 15;
    break;
   case 15:
    $cmp9623 = ($t_2_ph | 0) == 0;
    if ($cmp9623) {
      $rsize_3_lcssa = $rsize_2;
      $v_3_lcssa = $v_2;
      label = 18;
      break;
    } else {
      $t_224 = $t_2_ph;
      $rsize_325 = $rsize_2;
      $v_326 = $v_2;
      label = 16;
      break;
    }
   case 16:
    $head98 = $t_224 + 4 | 0;
    $6 = HEAP32[$head98 >> 2] | 0;
    $and99 = $6 & -8;
    $sub100 = $and99 - $nb | 0;
    $cmp101 = $sub100 >>> 0 < $rsize_325 >>> 0;
    $sub100_rsize_3 = $cmp101 ? $sub100 : $rsize_325;
    $t_2_v_3 = $cmp101 ? $t_224 : $v_326;
    $arrayidx105 = $t_224 + 16 | 0;
    $7 = HEAP32[$arrayidx105 >> 2] | 0;
    $cmp106 = ($7 | 0) == 0;
    if ($cmp106) {
      label = 17;
      break;
    } else {
      $t_224 = $7;
      $rsize_325 = $sub100_rsize_3;
      $v_326 = $t_2_v_3;
      label = 16;
      break;
    }
   case 17:
    $arrayidx112 = $t_224 + 20 | 0;
    $8 = HEAP32[$arrayidx112 >> 2] | 0;
    $cmp96 = ($8 | 0) == 0;
    if ($cmp96) {
      $rsize_3_lcssa = $sub100_rsize_3;
      $v_3_lcssa = $t_2_v_3;
      label = 18;
      break;
    } else {
      $t_224 = $8;
      $rsize_325 = $sub100_rsize_3;
      $v_326 = $t_2_v_3;
      label = 16;
      break;
    }
   case 18:
    $cmp115 = ($v_3_lcssa | 0) == 0;
    if ($cmp115) {
      $retval_0 = 0;
      label = 83;
      break;
    } else {
      label = 19;
      break;
    }
   case 19:
    $9 = HEAP32[92] | 0;
    $sub117 = $9 - $nb | 0;
    $cmp118 = $rsize_3_lcssa >>> 0 < $sub117 >>> 0;
    if ($cmp118) {
      label = 20;
      break;
    } else {
      $retval_0 = 0;
      label = 83;
      break;
    }
   case 20:
    $10 = $v_3_lcssa;
    $11 = HEAP32[94] | 0;
    $cmp120 = $10 >>> 0 < $11 >>> 0;
    if ($cmp120) {
      label = 82;
      break;
    } else {
      label = 21;
      break;
    }
   case 21:
    $add_ptr = $10 + $nb | 0;
    $12 = $add_ptr;
    $cmp122 = $10 >>> 0 < $add_ptr >>> 0;
    if ($cmp122) {
      label = 22;
      break;
    } else {
      label = 82;
      break;
    }
   case 22:
    $parent = $v_3_lcssa + 24 | 0;
    $13 = HEAP32[$parent >> 2] | 0;
    $bk = $v_3_lcssa + 12 | 0;
    $14 = HEAP32[$bk >> 2] | 0;
    $cmp127 = ($14 | 0) == ($v_3_lcssa | 0);
    if ($cmp127) {
      label = 28;
      break;
    } else {
      label = 23;
      break;
    }
   case 23:
    $fd = $v_3_lcssa + 8 | 0;
    $15 = HEAP32[$fd >> 2] | 0;
    $16 = $15;
    $cmp132 = $16 >>> 0 < $11 >>> 0;
    if ($cmp132) {
      label = 27;
      break;
    } else {
      label = 24;
      break;
    }
   case 24:
    $bk135 = $15 + 12 | 0;
    $17 = HEAP32[$bk135 >> 2] | 0;
    $cmp136 = ($17 | 0) == ($v_3_lcssa | 0);
    if ($cmp136) {
      label = 25;
      break;
    } else {
      label = 27;
      break;
    }
   case 25:
    $fd138 = $14 + 8 | 0;
    $18 = HEAP32[$fd138 >> 2] | 0;
    $cmp139 = ($18 | 0) == ($v_3_lcssa | 0);
    if ($cmp139) {
      label = 26;
      break;
    } else {
      label = 27;
      break;
    }
   case 26:
    HEAP32[$bk135 >> 2] = $14;
    HEAP32[$fd138 >> 2] = $15;
    $R_1 = $14;
    label = 36;
    break;
   case 27:
    _abort();
    return 0;
    return 0;
   case 28:
    $arrayidx150 = $v_3_lcssa + 20 | 0;
    $19 = HEAP32[$arrayidx150 >> 2] | 0;
    $cmp151 = ($19 | 0) == 0;
    if ($cmp151) {
      label = 29;
      break;
    } else {
      $R_0 = $19;
      $RP_0 = $arrayidx150;
      label = 30;
      break;
    }
   case 29:
    $arrayidx154 = $v_3_lcssa + 16 | 0;
    $20 = HEAP32[$arrayidx154 >> 2] | 0;
    $cmp155 = ($20 | 0) == 0;
    if ($cmp155) {
      $R_1 = 0;
      label = 36;
      break;
    } else {
      $R_0 = $20;
      $RP_0 = $arrayidx154;
      label = 30;
      break;
    }
   case 30:
    $arrayidx160 = $R_0 + 20 | 0;
    $21 = HEAP32[$arrayidx160 >> 2] | 0;
    $cmp161 = ($21 | 0) == 0;
    if ($cmp161) {
      label = 31;
      break;
    } else {
      $CP_0 = $arrayidx160;
      label = 32;
      break;
    }
   case 31:
    $arrayidx164 = $R_0 + 16 | 0;
    $22 = HEAP32[$arrayidx164 >> 2] | 0;
    $cmp165 = ($22 | 0) == 0;
    if ($cmp165) {
      label = 33;
      break;
    } else {
      $CP_0 = $arrayidx164;
      label = 32;
      break;
    }
   case 32:
    $23 = HEAP32[$CP_0 >> 2] | 0;
    $R_0 = $23;
    $RP_0 = $CP_0;
    label = 30;
    break;
   case 33:
    $24 = $RP_0;
    $25 = HEAP32[94] | 0;
    $cmp170 = $24 >>> 0 < $25 >>> 0;
    if ($cmp170) {
      label = 35;
      break;
    } else {
      label = 34;
      break;
    }
   case 34:
    HEAP32[$RP_0 >> 2] = 0;
    $R_1 = $R_0;
    label = 36;
    break;
   case 35:
    _abort();
    return 0;
    return 0;
   case 36:
    $cmp179 = ($13 | 0) == 0;
    if ($cmp179) {
      label = 56;
      break;
    } else {
      label = 37;
      break;
    }
   case 37:
    $index = $v_3_lcssa + 28 | 0;
    $26 = HEAP32[$index >> 2] | 0;
    $arrayidx183 = 664 + ($26 << 2) | 0;
    $27 = HEAP32[$arrayidx183 >> 2] | 0;
    $cmp184 = ($v_3_lcssa | 0) == ($27 | 0);
    if ($cmp184) {
      label = 38;
      break;
    } else {
      label = 40;
      break;
    }
   case 38:
    HEAP32[$arrayidx183 >> 2] = $R_1;
    $cond20 = ($R_1 | 0) == 0;
    if ($cond20) {
      label = 39;
      break;
    } else {
      label = 46;
      break;
    }
   case 39:
    $28 = HEAP32[$index >> 2] | 0;
    $shl191 = 1 << $28;
    $neg = $shl191 ^ -1;
    $29 = HEAP32[91] | 0;
    $and193 = $29 & $neg;
    HEAP32[91] = $and193;
    label = 56;
    break;
   case 40:
    $30 = $13;
    $31 = HEAP32[94] | 0;
    $cmp197 = $30 >>> 0 < $31 >>> 0;
    if ($cmp197) {
      label = 44;
      break;
    } else {
      label = 41;
      break;
    }
   case 41:
    $arrayidx203 = $13 + 16 | 0;
    $32 = HEAP32[$arrayidx203 >> 2] | 0;
    $cmp204 = ($32 | 0) == ($v_3_lcssa | 0);
    if ($cmp204) {
      label = 42;
      break;
    } else {
      label = 43;
      break;
    }
   case 42:
    HEAP32[$arrayidx203 >> 2] = $R_1;
    label = 45;
    break;
   case 43:
    $arrayidx211 = $13 + 20 | 0;
    HEAP32[$arrayidx211 >> 2] = $R_1;
    label = 45;
    break;
   case 44:
    _abort();
    return 0;
    return 0;
   case 45:
    $cmp216 = ($R_1 | 0) == 0;
    if ($cmp216) {
      label = 56;
      break;
    } else {
      label = 46;
      break;
    }
   case 46:
    $33 = $R_1;
    $34 = HEAP32[94] | 0;
    $cmp220 = $33 >>> 0 < $34 >>> 0;
    if ($cmp220) {
      label = 55;
      break;
    } else {
      label = 47;
      break;
    }
   case 47:
    $parent225 = $R_1 + 24 | 0;
    HEAP32[$parent225 >> 2] = $13;
    $arrayidx227 = $v_3_lcssa + 16 | 0;
    $35 = HEAP32[$arrayidx227 >> 2] | 0;
    $cmp228 = ($35 | 0) == 0;
    if ($cmp228) {
      label = 51;
      break;
    } else {
      label = 48;
      break;
    }
   case 48:
    $36 = $35;
    $37 = HEAP32[94] | 0;
    $cmp232 = $36 >>> 0 < $37 >>> 0;
    if ($cmp232) {
      label = 50;
      break;
    } else {
      label = 49;
      break;
    }
   case 49:
    $arrayidx238 = $R_1 + 16 | 0;
    HEAP32[$arrayidx238 >> 2] = $35;
    $parent239 = $35 + 24 | 0;
    HEAP32[$parent239 >> 2] = $R_1;
    label = 51;
    break;
   case 50:
    _abort();
    return 0;
    return 0;
   case 51:
    $arrayidx244 = $v_3_lcssa + 20 | 0;
    $38 = HEAP32[$arrayidx244 >> 2] | 0;
    $cmp245 = ($38 | 0) == 0;
    if ($cmp245) {
      label = 56;
      break;
    } else {
      label = 52;
      break;
    }
   case 52:
    $39 = $38;
    $40 = HEAP32[94] | 0;
    $cmp249 = $39 >>> 0 < $40 >>> 0;
    if ($cmp249) {
      label = 54;
      break;
    } else {
      label = 53;
      break;
    }
   case 53:
    $arrayidx255 = $R_1 + 20 | 0;
    HEAP32[$arrayidx255 >> 2] = $38;
    $parent256 = $38 + 24 | 0;
    HEAP32[$parent256 >> 2] = $R_1;
    label = 56;
    break;
   case 54:
    _abort();
    return 0;
    return 0;
   case 55:
    _abort();
    return 0;
    return 0;
   case 56:
    $cmp264 = $rsize_3_lcssa >>> 0 < 16;
    if ($cmp264) {
      label = 57;
      break;
    } else {
      label = 58;
      break;
    }
   case 57:
    $add267 = $rsize_3_lcssa + $nb | 0;
    $or269 = $add267 | 3;
    $head270 = $v_3_lcssa + 4 | 0;
    HEAP32[$head270 >> 2] = $or269;
    $add_ptr272_sum = $add267 + 4 | 0;
    $head273 = $10 + $add_ptr272_sum | 0;
    $41 = $head273;
    $42 = HEAP32[$41 >> 2] | 0;
    $or274 = $42 | 1;
    HEAP32[$41 >> 2] = $or274;
    label = 81;
    break;
   case 58:
    $or277 = $nb | 3;
    $head278 = $v_3_lcssa + 4 | 0;
    HEAP32[$head278 >> 2] = $or277;
    $or279 = $rsize_3_lcssa | 1;
    $add_ptr_sum = $nb + 4 | 0;
    $head280 = $10 + $add_ptr_sum | 0;
    $43 = $head280;
    HEAP32[$43 >> 2] = $or279;
    $add_ptr_sum1 = $rsize_3_lcssa + $nb | 0;
    $add_ptr281 = $10 + $add_ptr_sum1 | 0;
    $prev_foot = $add_ptr281;
    HEAP32[$prev_foot >> 2] = $rsize_3_lcssa;
    $shr282 = $rsize_3_lcssa >>> 3;
    $cmp283 = $rsize_3_lcssa >>> 0 < 256;
    if ($cmp283) {
      label = 59;
      break;
    } else {
      label = 64;
      break;
    }
   case 59:
    $shl287 = $shr282 << 1;
    $arrayidx288 = 400 + ($shl287 << 2) | 0;
    $44 = $arrayidx288;
    $45 = HEAP32[90] | 0;
    $shl290 = 1 << $shr282;
    $and291 = $45 & $shl290;
    $tobool292 = ($and291 | 0) == 0;
    if ($tobool292) {
      label = 60;
      break;
    } else {
      label = 61;
      break;
    }
   case 60:
    $or296 = $45 | $shl290;
    HEAP32[90] = $or296;
    $F289_0 = $44;
    label = 63;
    break;
   case 61:
    $arrayidx288_sum16 = $shl287 + 2 | 0;
    $46 = 400 + ($arrayidx288_sum16 << 2) | 0;
    $47 = HEAP32[$46 >> 2] | 0;
    $48 = $47;
    $49 = HEAP32[94] | 0;
    $cmp300 = $48 >>> 0 < $49 >>> 0;
    if ($cmp300) {
      label = 62;
      break;
    } else {
      $F289_0 = $47;
      label = 63;
      break;
    }
   case 62:
    _abort();
    return 0;
    return 0;
   case 63:
    $arrayidx288_sum = $shl287 + 2 | 0;
    $50 = 400 + ($arrayidx288_sum << 2) | 0;
    HEAP32[$50 >> 2] = $12;
    $bk310 = $F289_0 + 12 | 0;
    HEAP32[$bk310 >> 2] = $12;
    $add_ptr_sum14 = $nb + 8 | 0;
    $fd311 = $10 + $add_ptr_sum14 | 0;
    $51 = $fd311;
    HEAP32[$51 >> 2] = $F289_0;
    $add_ptr_sum15 = $nb + 12 | 0;
    $bk312 = $10 + $add_ptr_sum15 | 0;
    $52 = $bk312;
    HEAP32[$52 >> 2] = $44;
    label = 81;
    break;
   case 64:
    $53 = $add_ptr;
    $shr317 = $rsize_3_lcssa >>> 8;
    $cmp318 = ($shr317 | 0) == 0;
    if ($cmp318) {
      $I315_0 = 0;
      label = 67;
      break;
    } else {
      label = 65;
      break;
    }
   case 65:
    $cmp322 = $rsize_3_lcssa >>> 0 > 16777215;
    if ($cmp322) {
      $I315_0 = 31;
      label = 67;
      break;
    } else {
      label = 66;
      break;
    }
   case 66:
    $sub328 = $shr317 + 1048320 | 0;
    $shr329 = $sub328 >>> 16;
    $and330 = $shr329 & 8;
    $shl332 = $shr317 << $and330;
    $sub333 = $shl332 + 520192 | 0;
    $shr334 = $sub333 >>> 16;
    $and335 = $shr334 & 4;
    $add336 = $and335 | $and330;
    $shl337 = $shl332 << $and335;
    $sub338 = $shl337 + 245760 | 0;
    $shr339 = $sub338 >>> 16;
    $and340 = $shr339 & 2;
    $add341 = $add336 | $and340;
    $sub342 = 14 - $add341 | 0;
    $shl343 = $shl337 << $and340;
    $shr344 = $shl343 >>> 15;
    $add345 = $sub342 + $shr344 | 0;
    $shl346 = $add345 << 1;
    $add347 = $add345 + 7 | 0;
    $shr348 = $rsize_3_lcssa >>> ($add347 >>> 0);
    $and349 = $shr348 & 1;
    $add350 = $and349 | $shl346;
    $I315_0 = $add350;
    label = 67;
    break;
   case 67:
    $arrayidx354 = 664 + ($I315_0 << 2) | 0;
    $add_ptr_sum2 = $nb + 28 | 0;
    $index355 = $10 + $add_ptr_sum2 | 0;
    $54 = $index355;
    HEAP32[$54 >> 2] = $I315_0;
    $add_ptr_sum3 = $nb + 16 | 0;
    $child356 = $10 + $add_ptr_sum3 | 0;
    $child356_sum = $nb + 20 | 0;
    $arrayidx357 = $10 + $child356_sum | 0;
    $55 = $arrayidx357;
    HEAP32[$55 >> 2] = 0;
    $arrayidx359 = $child356;
    HEAP32[$arrayidx359 >> 2] = 0;
    $56 = HEAP32[91] | 0;
    $shl361 = 1 << $I315_0;
    $and362 = $56 & $shl361;
    $tobool363 = ($and362 | 0) == 0;
    if ($tobool363) {
      label = 68;
      break;
    } else {
      label = 69;
      break;
    }
   case 68:
    $or367 = $56 | $shl361;
    HEAP32[91] = $or367;
    HEAP32[$arrayidx354 >> 2] = $53;
    $57 = $arrayidx354;
    $add_ptr_sum4 = $nb + 24 | 0;
    $parent368 = $10 + $add_ptr_sum4 | 0;
    $58 = $parent368;
    HEAP32[$58 >> 2] = $57;
    $add_ptr_sum5 = $nb + 12 | 0;
    $bk369 = $10 + $add_ptr_sum5 | 0;
    $59 = $bk369;
    HEAP32[$59 >> 2] = $53;
    $add_ptr_sum6 = $nb + 8 | 0;
    $fd370 = $10 + $add_ptr_sum6 | 0;
    $60 = $fd370;
    HEAP32[$60 >> 2] = $53;
    label = 81;
    break;
   case 69:
    $61 = HEAP32[$arrayidx354 >> 2] | 0;
    $cmp373 = ($I315_0 | 0) == 31;
    if ($cmp373) {
      $cond382 = 0;
      label = 71;
      break;
    } else {
      label = 70;
      break;
    }
   case 70:
    $shr377 = $I315_0 >>> 1;
    $sub380 = 25 - $shr377 | 0;
    $cond382 = $sub380;
    label = 71;
    break;
   case 71:
    $shl383 = $rsize_3_lcssa << $cond382;
    $K372_0 = $shl383;
    $T_0 = $61;
    label = 72;
    break;
   case 72:
    $head385 = $T_0 + 4 | 0;
    $62 = HEAP32[$head385 >> 2] | 0;
    $and386 = $62 & -8;
    $cmp387 = ($and386 | 0) == ($rsize_3_lcssa | 0);
    if ($cmp387) {
      label = 77;
      break;
    } else {
      label = 73;
      break;
    }
   case 73:
    $shr390 = $K372_0 >>> 31;
    $arrayidx393 = $T_0 + 16 + ($shr390 << 2) | 0;
    $63 = HEAP32[$arrayidx393 >> 2] | 0;
    $cmp395 = ($63 | 0) == 0;
    $shl394 = $K372_0 << 1;
    if ($cmp395) {
      label = 74;
      break;
    } else {
      $K372_0 = $shl394;
      $T_0 = $63;
      label = 72;
      break;
    }
   case 74:
    $64 = $arrayidx393;
    $65 = HEAP32[94] | 0;
    $cmp400 = $64 >>> 0 < $65 >>> 0;
    if ($cmp400) {
      label = 76;
      break;
    } else {
      label = 75;
      break;
    }
   case 75:
    HEAP32[$arrayidx393 >> 2] = $53;
    $add_ptr_sum11 = $nb + 24 | 0;
    $parent405 = $10 + $add_ptr_sum11 | 0;
    $66 = $parent405;
    HEAP32[$66 >> 2] = $T_0;
    $add_ptr_sum12 = $nb + 12 | 0;
    $bk406 = $10 + $add_ptr_sum12 | 0;
    $67 = $bk406;
    HEAP32[$67 >> 2] = $53;
    $add_ptr_sum13 = $nb + 8 | 0;
    $fd407 = $10 + $add_ptr_sum13 | 0;
    $68 = $fd407;
    HEAP32[$68 >> 2] = $53;
    label = 81;
    break;
   case 76:
    _abort();
    return 0;
    return 0;
   case 77:
    $fd412 = $T_0 + 8 | 0;
    $69 = HEAP32[$fd412 >> 2] | 0;
    $70 = $T_0;
    $71 = HEAP32[94] | 0;
    $cmp414 = $70 >>> 0 < $71 >>> 0;
    if ($cmp414) {
      label = 80;
      break;
    } else {
      label = 78;
      break;
    }
   case 78:
    $72 = $69;
    $cmp418 = $72 >>> 0 < $71 >>> 0;
    if ($cmp418) {
      label = 80;
      break;
    } else {
      label = 79;
      break;
    }
   case 79:
    $bk425 = $69 + 12 | 0;
    HEAP32[$bk425 >> 2] = $53;
    HEAP32[$fd412 >> 2] = $53;
    $add_ptr_sum8 = $nb + 8 | 0;
    $fd427 = $10 + $add_ptr_sum8 | 0;
    $73 = $fd427;
    HEAP32[$73 >> 2] = $69;
    $add_ptr_sum9 = $nb + 12 | 0;
    $bk428 = $10 + $add_ptr_sum9 | 0;
    $74 = $bk428;
    HEAP32[$74 >> 2] = $T_0;
    $add_ptr_sum10 = $nb + 24 | 0;
    $parent429 = $10 + $add_ptr_sum10 | 0;
    $75 = $parent429;
    HEAP32[$75 >> 2] = 0;
    label = 81;
    break;
   case 80:
    _abort();
    return 0;
    return 0;
   case 81:
    $add_ptr436 = $v_3_lcssa + 8 | 0;
    $76 = $add_ptr436;
    $retval_0 = $76;
    label = 83;
    break;
   case 82:
    _abort();
    return 0;
    return 0;
   case 83:
    return $retval_0 | 0;
  }
  return 0;
}
function _sys_alloc($nb) {
  $nb = $nb | 0;
  var $0 = 0, $cmp = 0, $add = 0, $1 = 0, $sub = 0, $add9 = 0, $neg = 0, $and11 = 0, $cmp12 = 0, $2 = 0, $cmp15 = 0, $3 = 0, $add17 = 0, $cmp19 = 0, $cmp21 = 0, $or_cond1 = 0, $4 = 0, $and26 = 0, $tobool27 = 0, $5 = 0, $cmp29 = 0, $6 = 0, $call31 = 0, $cmp32 = 0, $call34 = 0, $cmp35 = 0, $7 = 0, $8 = 0, $sub38 = 0, $and39 = 0, $cmp40 = 0, $add43 = 0, $neg45 = 0, $and46 = 0, $sub47 = 0, $add48 = 0, $ssize_0 = 0, $9 = 0, $add51 = 0, $cmp52 = 0, $cmp54 = 0, $or_cond = 0, $10 = 0, $cmp57 = 0, $cmp60 = 0, $cmp63 = 0, $or_cond2 = 0, $call65 = 0, $cmp66 = 0, $ssize_0_ = 0, $call34_ = 0, $11 = 0, $12 = 0, $sub71 = 0, $sub73 = 0, $add74 = 0, $neg76 = 0, $and77 = 0, $cmp78 = 0, $call80 = 0, $base81 = 0, $13 = 0, $size = 0, $14 = 0, $add_ptr = 0, $cmp82 = 0, $and77_ = 0, $call80_ = 0, $ssize_1 = 0, $br_0 = 0, $tsize_0 = 0, $tbase_0 = 0, $sub109 = 0, $cmp86 = 0, $cmp88 = 0, $cmp90 = 0, $or_cond3 = 0, $cmp93 = 0, $or_cond4 = 0, $15 = 0, $sub97 = 0, $sub96 = 0, $add98 = 0, $neg100 = 0, $and101 = 0, $cmp102 = 0, $call104 = 0, $cmp105 = 0, $add107 = 0, $call110 = 0, $ssize_2 = 0, $cmp115 = 0, $tsize_0132123 = 0, $16 = 0, $or = 0, $tsize_1 = 0, $cmp124 = 0, $call128 = 0, $call129 = 0, $notlhs = 0, $notrhs = 0, $or_cond6_not = 0, $cmp134 = 0, $or_cond7 = 0, $sub_ptr_lhs_cast = 0, $sub_ptr_rhs_cast = 0, $sub_ptr_sub = 0, $add137 = 0, $cmp138 = 0, $sub_ptr_sub_tsize_1 = 0, $call128_tbase_1 = 0, $cmp144 = 0, $tbase_230 = 0, $tsize_229 = 0, $17 = 0, $add147 = 0, $18 = 0, $cmp148 = 0, $19 = 0, $cmp154 = 0, $20 = 0, $cmp156 = 0, $cmp159 = 0, $or_cond8 = 0, $21 = 0, $22 = 0, $sub169 = 0, $sp_038 = 0, $base184 = 0, $23 = 0, $size185 = 0, $24 = 0, $add_ptr186 = 0, $cmp187 = 0, $next = 0, $25 = 0, $cmp183 = 0, $sflags190 = 0, $26 = 0, $and191 = 0, $tobool192 = 0, $27 = 0, $28 = 0, $cmp200 = 0, $cmp206 = 0, $or_cond31 = 0, $add209 = 0, $29 = 0, $30 = 0, $add212 = 0, $31 = 0, $cmp215 = 0, $add_ptr224 = 0, $sp_134 = 0, $base223 = 0, $32 = 0, $cmp225 = 0, $next228 = 0, $33 = 0, $cmp221 = 0, $sflags232 = 0, $34 = 0, $and233 = 0, $tobool234 = 0, $size242 = 0, $35 = 0, $add243 = 0, $call244 = 0, $36 = 0, $cmp250 = 0, $sub253 = 0, $37 = 0, $38 = 0, $add_ptr255 = 0, $39 = 0, $or257 = 0, $add_ptr255_sum = 0, $head258 = 0, $40 = 0, $or260 = 0, $head261 = 0, $add_ptr262 = 0, $41 = 0, $call265 = 0, $retval_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = HEAP32[2] | 0;
    $cmp = ($0 | 0) == 0;
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    _init_mparams();
    label = 4;
    break;
   case 4:
    $add = $nb + 48 | 0;
    $1 = HEAP32[4] | 0;
    $sub = $nb + 47 | 0;
    $add9 = $sub + $1 | 0;
    $neg = -$1 | 0;
    $and11 = $add9 & $neg;
    $cmp12 = $and11 >>> 0 > $nb >>> 0;
    if ($cmp12) {
      label = 5;
      break;
    } else {
      $retval_0 = 0;
      label = 52;
      break;
    }
   case 5:
    $2 = HEAP32[200] | 0;
    $cmp15 = ($2 | 0) == 0;
    if ($cmp15) {
      label = 7;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $3 = HEAP32[198] | 0;
    $add17 = $3 + $and11 | 0;
    $cmp19 = $add17 >>> 0 <= $3 >>> 0;
    $cmp21 = $add17 >>> 0 > $2 >>> 0;
    $or_cond1 = $cmp19 | $cmp21;
    if ($or_cond1) {
      $retval_0 = 0;
      label = 52;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $4 = HEAP32[201] | 0;
    $and26 = $4 & 4;
    $tobool27 = ($and26 | 0) == 0;
    if ($tobool27) {
      label = 8;
      break;
    } else {
      $tsize_1 = 0;
      label = 27;
      break;
    }
   case 8:
    $5 = HEAP32[96] | 0;
    $cmp29 = ($5 | 0) == 0;
    if ($cmp29) {
      label = 10;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $6 = $5;
    $call31 = _segment_holding($6) | 0;
    $cmp32 = ($call31 | 0) == 0;
    if ($cmp32) {
      label = 10;
      break;
    } else {
      label = 17;
      break;
    }
   case 10:
    $call34 = _sbrk(0) | 0;
    $cmp35 = ($call34 | 0) == -1;
    if ($cmp35) {
      $tsize_0132123 = 0;
      label = 26;
      break;
    } else {
      label = 11;
      break;
    }
   case 11:
    $7 = $call34;
    $8 = HEAP32[3] | 0;
    $sub38 = $8 - 1 | 0;
    $and39 = $sub38 & $7;
    $cmp40 = ($and39 | 0) == 0;
    if ($cmp40) {
      $ssize_0 = $and11;
      label = 13;
      break;
    } else {
      label = 12;
      break;
    }
   case 12:
    $add43 = $sub38 + $7 | 0;
    $neg45 = -$8 | 0;
    $and46 = $add43 & $neg45;
    $sub47 = $and11 - $7 | 0;
    $add48 = $sub47 + $and46 | 0;
    $ssize_0 = $add48;
    label = 13;
    break;
   case 13:
    $9 = HEAP32[198] | 0;
    $add51 = $9 + $ssize_0 | 0;
    $cmp52 = $ssize_0 >>> 0 > $nb >>> 0;
    $cmp54 = $ssize_0 >>> 0 < 2147483647;
    $or_cond = $cmp52 & $cmp54;
    if ($or_cond) {
      label = 14;
      break;
    } else {
      $tsize_0132123 = 0;
      label = 26;
      break;
    }
   case 14:
    $10 = HEAP32[200] | 0;
    $cmp57 = ($10 | 0) == 0;
    if ($cmp57) {
      label = 16;
      break;
    } else {
      label = 15;
      break;
    }
   case 15:
    $cmp60 = $add51 >>> 0 <= $9 >>> 0;
    $cmp63 = $add51 >>> 0 > $10 >>> 0;
    $or_cond2 = $cmp60 | $cmp63;
    if ($or_cond2) {
      $tsize_0132123 = 0;
      label = 26;
      break;
    } else {
      label = 16;
      break;
    }
   case 16:
    $call65 = _sbrk($ssize_0 | 0) | 0;
    $cmp66 = ($call65 | 0) == ($call34 | 0);
    $ssize_0_ = $cmp66 ? $ssize_0 : 0;
    $call34_ = $cmp66 ? $call34 : -1;
    $tbase_0 = $call34_;
    $tsize_0 = $ssize_0_;
    $br_0 = $call65;
    $ssize_1 = $ssize_0;
    label = 19;
    break;
   case 17:
    $11 = HEAP32[93] | 0;
    $12 = HEAP32[4] | 0;
    $sub71 = $nb + 47 | 0;
    $sub73 = $sub71 - $11 | 0;
    $add74 = $sub73 + $12 | 0;
    $neg76 = -$12 | 0;
    $and77 = $add74 & $neg76;
    $cmp78 = $and77 >>> 0 < 2147483647;
    if ($cmp78) {
      label = 18;
      break;
    } else {
      $tsize_0132123 = 0;
      label = 26;
      break;
    }
   case 18:
    $call80 = _sbrk($and77 | 0) | 0;
    $base81 = $call31 | 0;
    $13 = HEAP32[$base81 >> 2] | 0;
    $size = $call31 + 4 | 0;
    $14 = HEAP32[$size >> 2] | 0;
    $add_ptr = $13 + $14 | 0;
    $cmp82 = ($call80 | 0) == ($add_ptr | 0);
    $and77_ = $cmp82 ? $and77 : 0;
    $call80_ = $cmp82 ? $call80 : -1;
    $tbase_0 = $call80_;
    $tsize_0 = $and77_;
    $br_0 = $call80;
    $ssize_1 = $and77;
    label = 19;
    break;
   case 19:
    $sub109 = -$ssize_1 | 0;
    $cmp86 = ($tbase_0 | 0) == -1;
    if ($cmp86) {
      label = 20;
      break;
    } else {
      $tsize_229 = $tsize_0;
      $tbase_230 = $tbase_0;
      label = 30;
      break;
    }
   case 20:
    $cmp88 = ($br_0 | 0) != -1;
    $cmp90 = $ssize_1 >>> 0 < 2147483647;
    $or_cond3 = $cmp88 & $cmp90;
    $cmp93 = $ssize_1 >>> 0 < $add >>> 0;
    $or_cond4 = $or_cond3 & $cmp93;
    if ($or_cond4) {
      label = 21;
      break;
    } else {
      $ssize_2 = $ssize_1;
      label = 25;
      break;
    }
   case 21:
    $15 = HEAP32[4] | 0;
    $sub97 = $nb + 47 | 0;
    $sub96 = $sub97 - $ssize_1 | 0;
    $add98 = $sub96 + $15 | 0;
    $neg100 = -$15 | 0;
    $and101 = $add98 & $neg100;
    $cmp102 = $and101 >>> 0 < 2147483647;
    if ($cmp102) {
      label = 22;
      break;
    } else {
      $ssize_2 = $ssize_1;
      label = 25;
      break;
    }
   case 22:
    $call104 = _sbrk($and101 | 0) | 0;
    $cmp105 = ($call104 | 0) == -1;
    if ($cmp105) {
      label = 24;
      break;
    } else {
      label = 23;
      break;
    }
   case 23:
    $add107 = $and101 + $ssize_1 | 0;
    $ssize_2 = $add107;
    label = 25;
    break;
   case 24:
    $call110 = _sbrk($sub109 | 0) | 0;
    $tsize_0132123 = $tsize_0;
    label = 26;
    break;
   case 25:
    $cmp115 = ($br_0 | 0) == -1;
    if ($cmp115) {
      $tsize_0132123 = $tsize_0;
      label = 26;
      break;
    } else {
      $tsize_229 = $ssize_2;
      $tbase_230 = $br_0;
      label = 30;
      break;
    }
   case 26:
    $16 = HEAP32[201] | 0;
    $or = $16 | 4;
    HEAP32[201] = $or;
    $tsize_1 = $tsize_0132123;
    label = 27;
    break;
   case 27:
    $cmp124 = $and11 >>> 0 < 2147483647;
    if ($cmp124) {
      label = 28;
      break;
    } else {
      label = 51;
      break;
    }
   case 28:
    $call128 = _sbrk($and11 | 0) | 0;
    $call129 = _sbrk(0) | 0;
    $notlhs = ($call128 | 0) != -1;
    $notrhs = ($call129 | 0) != -1;
    $or_cond6_not = $notrhs & $notlhs;
    $cmp134 = $call128 >>> 0 < $call129 >>> 0;
    $or_cond7 = $or_cond6_not & $cmp134;
    if ($or_cond7) {
      label = 29;
      break;
    } else {
      label = 51;
      break;
    }
   case 29:
    $sub_ptr_lhs_cast = $call129;
    $sub_ptr_rhs_cast = $call128;
    $sub_ptr_sub = $sub_ptr_lhs_cast - $sub_ptr_rhs_cast | 0;
    $add137 = $nb + 40 | 0;
    $cmp138 = $sub_ptr_sub >>> 0 > $add137 >>> 0;
    $sub_ptr_sub_tsize_1 = $cmp138 ? $sub_ptr_sub : $tsize_1;
    $call128_tbase_1 = $cmp138 ? $call128 : -1;
    $cmp144 = ($call128_tbase_1 | 0) == -1;
    if ($cmp144) {
      label = 51;
      break;
    } else {
      $tsize_229 = $sub_ptr_sub_tsize_1;
      $tbase_230 = $call128_tbase_1;
      label = 30;
      break;
    }
   case 30:
    $17 = HEAP32[198] | 0;
    $add147 = $17 + $tsize_229 | 0;
    HEAP32[198] = $add147;
    $18 = HEAP32[199] | 0;
    $cmp148 = $add147 >>> 0 > $18 >>> 0;
    if ($cmp148) {
      label = 31;
      break;
    } else {
      label = 32;
      break;
    }
   case 31:
    HEAP32[199] = $add147;
    label = 32;
    break;
   case 32:
    $19 = HEAP32[96] | 0;
    $cmp154 = ($19 | 0) == 0;
    if ($cmp154) {
      label = 33;
      break;
    } else {
      $sp_038 = 808;
      label = 36;
      break;
    }
   case 33:
    $20 = HEAP32[94] | 0;
    $cmp156 = ($20 | 0) == 0;
    $cmp159 = $tbase_230 >>> 0 < $20 >>> 0;
    $or_cond8 = $cmp156 | $cmp159;
    if ($or_cond8) {
      label = 34;
      break;
    } else {
      label = 35;
      break;
    }
   case 34:
    HEAP32[94] = $tbase_230;
    label = 35;
    break;
   case 35:
    HEAP32[202] = $tbase_230;
    HEAP32[203] = $tsize_229;
    HEAP32[205] = 0;
    $21 = HEAP32[2] | 0;
    HEAP32[99] = $21;
    HEAP32[98] = -1;
    _init_bins();
    $22 = $tbase_230;
    $sub169 = $tsize_229 - 40 | 0;
    _init_top($22, $sub169);
    label = 49;
    break;
   case 36:
    $base184 = $sp_038 | 0;
    $23 = HEAP32[$base184 >> 2] | 0;
    $size185 = $sp_038 + 4 | 0;
    $24 = HEAP32[$size185 >> 2] | 0;
    $add_ptr186 = $23 + $24 | 0;
    $cmp187 = ($tbase_230 | 0) == ($add_ptr186 | 0);
    if ($cmp187) {
      label = 38;
      break;
    } else {
      label = 37;
      break;
    }
   case 37:
    $next = $sp_038 + 8 | 0;
    $25 = HEAP32[$next >> 2] | 0;
    $cmp183 = ($25 | 0) == 0;
    if ($cmp183) {
      label = 41;
      break;
    } else {
      $sp_038 = $25;
      label = 36;
      break;
    }
   case 38:
    $sflags190 = $sp_038 + 12 | 0;
    $26 = HEAP32[$sflags190 >> 2] | 0;
    $and191 = $26 & 8;
    $tobool192 = ($and191 | 0) == 0;
    if ($tobool192) {
      label = 39;
      break;
    } else {
      label = 41;
      break;
    }
   case 39:
    $27 = HEAP32[96] | 0;
    $28 = $27;
    $cmp200 = $28 >>> 0 >= $23 >>> 0;
    $cmp206 = $28 >>> 0 < $add_ptr186 >>> 0;
    $or_cond31 = $cmp200 & $cmp206;
    if ($or_cond31) {
      label = 40;
      break;
    } else {
      label = 41;
      break;
    }
   case 40:
    $add209 = $24 + $tsize_229 | 0;
    HEAP32[$size185 >> 2] = $add209;
    $29 = HEAP32[96] | 0;
    $30 = HEAP32[93] | 0;
    $add212 = $30 + $tsize_229 | 0;
    _init_top($29, $add212);
    label = 49;
    break;
   case 41:
    $31 = HEAP32[94] | 0;
    $cmp215 = $tbase_230 >>> 0 < $31 >>> 0;
    if ($cmp215) {
      label = 42;
      break;
    } else {
      label = 43;
      break;
    }
   case 42:
    HEAP32[94] = $tbase_230;
    label = 43;
    break;
   case 43:
    $add_ptr224 = $tbase_230 + $tsize_229 | 0;
    $sp_134 = 808;
    label = 44;
    break;
   case 44:
    $base223 = $sp_134 | 0;
    $32 = HEAP32[$base223 >> 2] | 0;
    $cmp225 = ($32 | 0) == ($add_ptr224 | 0);
    if ($cmp225) {
      label = 46;
      break;
    } else {
      label = 45;
      break;
    }
   case 45:
    $next228 = $sp_134 + 8 | 0;
    $33 = HEAP32[$next228 >> 2] | 0;
    $cmp221 = ($33 | 0) == 0;
    if ($cmp221) {
      label = 48;
      break;
    } else {
      $sp_134 = $33;
      label = 44;
      break;
    }
   case 46:
    $sflags232 = $sp_134 + 12 | 0;
    $34 = HEAP32[$sflags232 >> 2] | 0;
    $and233 = $34 & 8;
    $tobool234 = ($and233 | 0) == 0;
    if ($tobool234) {
      label = 47;
      break;
    } else {
      label = 48;
      break;
    }
   case 47:
    HEAP32[$base223 >> 2] = $tbase_230;
    $size242 = $sp_134 + 4 | 0;
    $35 = HEAP32[$size242 >> 2] | 0;
    $add243 = $35 + $tsize_229 | 0;
    HEAP32[$size242 >> 2] = $add243;
    $call244 = _prepend_alloc($tbase_230, $32, $nb) | 0;
    $retval_0 = $call244;
    label = 52;
    break;
   case 48:
    _add_segment($tbase_230, $tsize_229);
    label = 49;
    break;
   case 49:
    $36 = HEAP32[93] | 0;
    $cmp250 = $36 >>> 0 > $nb >>> 0;
    if ($cmp250) {
      label = 50;
      break;
    } else {
      label = 51;
      break;
    }
   case 50:
    $sub253 = $36 - $nb | 0;
    HEAP32[93] = $sub253;
    $37 = HEAP32[96] | 0;
    $38 = $37;
    $add_ptr255 = $38 + $nb | 0;
    $39 = $add_ptr255;
    HEAP32[96] = $39;
    $or257 = $sub253 | 1;
    $add_ptr255_sum = $nb + 4 | 0;
    $head258 = $38 + $add_ptr255_sum | 0;
    $40 = $head258;
    HEAP32[$40 >> 2] = $or257;
    $or260 = $nb | 3;
    $head261 = $37 + 4 | 0;
    HEAP32[$head261 >> 2] = $or260;
    $add_ptr262 = $37 + 8 | 0;
    $41 = $add_ptr262;
    $retval_0 = $41;
    label = 52;
    break;
   case 51:
    $call265 = ___errno_location() | 0;
    HEAP32[$call265 >> 2] = 12;
    $retval_0 = 0;
    label = 52;
    break;
   case 52:
    return $retval_0 | 0;
  }
  return 0;
}
function _free($mem) {
  $mem = $mem | 0;
  var $cmp = 0, $add_ptr = 0, $0 = 0, $1 = 0, $cmp1 = 0, $head = 0, $2 = 0, $3 = 0, $and = 0, $cmp2 = 0, $and5 = 0, $add_ptr_sum = 0, $add_ptr6 = 0, $4 = 0, $and8 = 0, $tobool9 = 0, $prev_foot = 0, $5 = 0, $cmp13 = 0, $add_ptr_sum232 = 0, $add_ptr16 = 0, $6 = 0, $add17 = 0, $cmp18 = 0, $7 = 0, $cmp22 = 0, $shr = 0, $cmp25 = 0, $add_ptr16_sum269 = 0, $fd = 0, $8 = 0, $9 = 0, $add_ptr16_sum270 = 0, $bk = 0, $10 = 0, $11 = 0, $shl = 0, $arrayidx = 0, $12 = 0, $cmp29 = 0, $13 = 0, $cmp31 = 0, $bk34 = 0, $14 = 0, $cmp35 = 0, $cmp42 = 0, $shl45 = 0, $neg = 0, $15 = 0, $and46 = 0, $cmp50 = 0, $16 = 0, $17 = 0, $cmp53 = 0, $fd56 = 0, $18 = 0, $cmp57 = 0, $bk66 = 0, $fd67 = 0, $19 = 0, $add_ptr16_sum261 = 0, $parent = 0, $20 = 0, $21 = 0, $add_ptr16_sum262 = 0, $bk73 = 0, $22 = 0, $23 = 0, $cmp74 = 0, $add_ptr16_sum266 = 0, $fd78 = 0, $24 = 0, $25 = 0, $26 = 0, $cmp80 = 0, $bk82 = 0, $27 = 0, $cmp83 = 0, $fd86 = 0, $28 = 0, $cmp87 = 0, $child_sum = 0, $arrayidx99 = 0, $29 = 0, $30 = 0, $cmp100 = 0, $add_ptr16_sum263 = 0, $child = 0, $arrayidx103 = 0, $31 = 0, $cmp104 = 0, $RP_0 = 0, $R_0 = 0, $arrayidx108 = 0, $32 = 0, $cmp109 = 0, $arrayidx113 = 0, $33 = 0, $cmp114 = 0, $CP_0 = 0, $34 = 0, $35 = 0, $36 = 0, $cmp118 = 0, $R_1 = 0, $cmp127 = 0, $add_ptr16_sum264 = 0, $index = 0, $37 = 0, $38 = 0, $arrayidx130 = 0, $39 = 0, $cmp131 = 0, $cond279 = 0, $40 = 0, $shl138 = 0, $neg139 = 0, $41 = 0, $and140 = 0, $42 = 0, $43 = 0, $cmp143 = 0, $arrayidx149 = 0, $44 = 0, $cmp150 = 0, $arrayidx157 = 0, $cmp162 = 0, $45 = 0, $46 = 0, $cmp165 = 0, $parent170 = 0, $add_ptr16_sum265 = 0, $child171 = 0, $arrayidx172 = 0, $47 = 0, $cmp173 = 0, $48 = 0, $49 = 0, $cmp176 = 0, $arrayidx182 = 0, $parent183 = 0, $child171_sum = 0, $arrayidx188 = 0, $50 = 0, $51 = 0, $cmp189 = 0, $52 = 0, $53 = 0, $cmp192 = 0, $arrayidx198 = 0, $parent199 = 0, $add_ptr6_sum = 0, $head209 = 0, $54 = 0, $55 = 0, $and210 = 0, $cmp211 = 0, $56 = 0, $and215 = 0, $or = 0, $add_ptr16_sum = 0, $head216 = 0, $57 = 0, $prev_foot218 = 0, $psize_0 = 0, $p_0 = 0, $58 = 0, $cmp225 = 0, $add_ptr6_sum259 = 0, $head228 = 0, $59 = 0, $60 = 0, $and229 = 0, $phitmp = 0, $and237 = 0, $tobool238 = 0, $61 = 0, $cmp240 = 0, $62 = 0, $add243 = 0, $or244 = 0, $head245 = 0, $63 = 0, $cmp246 = 0, $64 = 0, $cmp250 = 0, $65 = 0, $66 = 0, $cmp255 = 0, $67 = 0, $add258 = 0, $or259 = 0, $head260 = 0, $add_ptr261 = 0, $prev_foot262 = 0, $and265 = 0, $add266 = 0, $shr267 = 0, $cmp268 = 0, $fd272 = 0, $68 = 0, $69 = 0, $add_ptr6_sum253254 = 0, $bk274 = 0, $70 = 0, $71 = 0, $shl277 = 0, $arrayidx278 = 0, $72 = 0, $cmp279 = 0, $73 = 0, $74 = 0, $cmp282 = 0, $bk285 = 0, $75 = 0, $cmp286 = 0, $cmp295 = 0, $shl298 = 0, $neg299 = 0, $76 = 0, $and300 = 0, $cmp304 = 0, $77 = 0, $78 = 0, $cmp307 = 0, $fd310 = 0, $79 = 0, $cmp311 = 0, $bk320 = 0, $fd321 = 0, $80 = 0, $add_ptr6_sum234 = 0, $parent330 = 0, $81 = 0, $82 = 0, $add_ptr6_sum235236 = 0, $bk332 = 0, $83 = 0, $84 = 0, $cmp333 = 0, $fd337 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $cmp339 = 0, $bk342 = 0, $89 = 0, $cmp343 = 0, $fd346 = 0, $90 = 0, $cmp347 = 0, $child360_sum = 0, $arrayidx361 = 0, $91 = 0, $92 = 0, $cmp362 = 0, $add_ptr6_sum237 = 0, $child360 = 0, $arrayidx366 = 0, $93 = 0, $cmp367 = 0, $RP359_0 = 0, $R331_0 = 0, $arrayidx373 = 0, $94 = 0, $cmp374 = 0, $arrayidx378 = 0, $95 = 0, $cmp379 = 0, $CP370_0 = 0, $96 = 0, $97 = 0, $98 = 0, $cmp385 = 0, $R331_1 = 0, $cmp394 = 0, $add_ptr6_sum247 = 0, $index398 = 0, $99 = 0, $100 = 0, $arrayidx399 = 0, $101 = 0, $cmp400 = 0, $cond280 = 0, $102 = 0, $shl407 = 0, $neg408 = 0, $103 = 0, $and409 = 0, $104 = 0, $105 = 0, $cmp412 = 0, $arrayidx418 = 0, $106 = 0, $cmp419 = 0, $arrayidx426 = 0, $cmp431 = 0, $107 = 0, $108 = 0, $cmp434 = 0, $parent441 = 0, $add_ptr6_sum248 = 0, $child442 = 0, $arrayidx443 = 0, $109 = 0, $cmp444 = 0, $110 = 0, $111 = 0, $cmp447 = 0, $arrayidx453 = 0, $parent454 = 0, $child442_sum = 0, $arrayidx459 = 0, $112 = 0, $113 = 0, $cmp460 = 0, $114 = 0, $115 = 0, $cmp463 = 0, $arrayidx469 = 0, $parent470 = 0, $or479 = 0, $head480 = 0, $add_ptr481 = 0, $prev_foot482 = 0, $116 = 0, $cmp483 = 0, $and491 = 0, $or492 = 0, $head493 = 0, $add_ptr494 = 0, $prev_foot495 = 0, $psize_1 = 0, $shr497 = 0, $cmp498 = 0, $shl504 = 0, $arrayidx505 = 0, $117 = 0, $118 = 0, $shl507 = 0, $and508 = 0, $tobool509 = 0, $or512 = 0, $arrayidx505_sum246 = 0, $119 = 0, $120 = 0, $121 = 0, $122 = 0, $cmp515 = 0, $F506_0 = 0, $arrayidx505_sum = 0, $123 = 0, $bk525 = 0, $fd526 = 0, $bk527 = 0, $124 = 0, $shr531 = 0, $cmp532 = 0, $cmp536 = 0, $sub = 0, $shr540 = 0, $and541 = 0, $shl542 = 0, $sub543 = 0, $shr544 = 0, $and545 = 0, $add546 = 0, $shl547 = 0, $sub548 = 0, $shr549 = 0, $and550 = 0, $add551 = 0, $sub552 = 0, $shl553 = 0, $shr554 = 0, $add555 = 0, $shl556 = 0, $add557 = 0, $shr558 = 0, $and559 = 0, $add560 = 0, $I530_0 = 0, $arrayidx563 = 0, $index564 = 0, $I530_0_c = 0, $arrayidx566 = 0, $125 = 0, $126 = 0, $shl569 = 0, $and570 = 0, $tobool571 = 0, $or574 = 0, $parent575 = 0, $_c = 0, $bk576 = 0, $fd577 = 0, $127 = 0, $cmp580 = 0, $shr582 = 0, $sub585 = 0, $cond = 0, $shl586 = 0, $T_0 = 0, $K579_0 = 0, $head587 = 0, $128 = 0, $and588 = 0, $cmp589 = 0, $shr592 = 0, $arrayidx595 = 0, $129 = 0, $cmp597 = 0, $shl596 = 0, $130 = 0, $131 = 0, $cmp601 = 0, $parent606 = 0, $T_0_c243 = 0, $bk607 = 0, $fd608 = 0, $fd613 = 0, $132 = 0, $133 = 0, $134 = 0, $cmp614 = 0, $135 = 0, $cmp617 = 0, $bk624 = 0, $fd626 = 0, $_c242 = 0, $bk627 = 0, $T_0_c = 0, $parent628 = 0, $136 = 0, $dec = 0, $cmp632 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $cmp = ($mem | 0) == 0;
    if ($cmp) {
      label = 142;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $add_ptr = $mem - 8 | 0;
    $0 = $add_ptr;
    $1 = HEAP32[94] | 0;
    $cmp1 = $add_ptr >>> 0 < $1 >>> 0;
    if ($cmp1) {
      label = 141;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $head = $mem - 4 | 0;
    $2 = $head;
    $3 = HEAP32[$2 >> 2] | 0;
    $and = $3 & 3;
    $cmp2 = ($and | 0) == 1;
    if ($cmp2) {
      label = 141;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $and5 = $3 & -8;
    $add_ptr_sum = $and5 - 8 | 0;
    $add_ptr6 = $mem + $add_ptr_sum | 0;
    $4 = $add_ptr6;
    $and8 = $3 & 1;
    $tobool9 = ($and8 | 0) == 0;
    if ($tobool9) {
      label = 6;
      break;
    } else {
      $p_0 = $0;
      $psize_0 = $and5;
      label = 57;
      break;
    }
   case 6:
    $prev_foot = $add_ptr;
    $5 = HEAP32[$prev_foot >> 2] | 0;
    $cmp13 = ($and | 0) == 0;
    if ($cmp13) {
      label = 142;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $add_ptr_sum232 = -8 - $5 | 0;
    $add_ptr16 = $mem + $add_ptr_sum232 | 0;
    $6 = $add_ptr16;
    $add17 = $5 + $and5 | 0;
    $cmp18 = $add_ptr16 >>> 0 < $1 >>> 0;
    if ($cmp18) {
      label = 141;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $7 = HEAP32[95] | 0;
    $cmp22 = ($6 | 0) == ($7 | 0);
    if ($cmp22) {
      label = 55;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $shr = $5 >>> 3;
    $cmp25 = $5 >>> 0 < 256;
    if ($cmp25) {
      label = 10;
      break;
    } else {
      label = 21;
      break;
    }
   case 10:
    $add_ptr16_sum269 = $add_ptr_sum232 + 8 | 0;
    $fd = $mem + $add_ptr16_sum269 | 0;
    $8 = $fd;
    $9 = HEAP32[$8 >> 2] | 0;
    $add_ptr16_sum270 = $add_ptr_sum232 + 12 | 0;
    $bk = $mem + $add_ptr16_sum270 | 0;
    $10 = $bk;
    $11 = HEAP32[$10 >> 2] | 0;
    $shl = $shr << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $12 = $arrayidx;
    $cmp29 = ($9 | 0) == ($12 | 0);
    if ($cmp29) {
      label = 13;
      break;
    } else {
      label = 11;
      break;
    }
   case 11:
    $13 = $9;
    $cmp31 = $13 >>> 0 < $1 >>> 0;
    if ($cmp31) {
      label = 20;
      break;
    } else {
      label = 12;
      break;
    }
   case 12:
    $bk34 = $9 + 12 | 0;
    $14 = HEAP32[$bk34 >> 2] | 0;
    $cmp35 = ($14 | 0) == ($6 | 0);
    if ($cmp35) {
      label = 13;
      break;
    } else {
      label = 20;
      break;
    }
   case 13:
    $cmp42 = ($11 | 0) == ($9 | 0);
    if ($cmp42) {
      label = 14;
      break;
    } else {
      label = 15;
      break;
    }
   case 14:
    $shl45 = 1 << $shr;
    $neg = $shl45 ^ -1;
    $15 = HEAP32[90] | 0;
    $and46 = $15 & $neg;
    HEAP32[90] = $and46;
    $p_0 = $6;
    $psize_0 = $add17;
    label = 57;
    break;
   case 15:
    $cmp50 = ($11 | 0) == ($12 | 0);
    if ($cmp50) {
      label = 18;
      break;
    } else {
      label = 16;
      break;
    }
   case 16:
    $16 = $11;
    $17 = HEAP32[94] | 0;
    $cmp53 = $16 >>> 0 < $17 >>> 0;
    if ($cmp53) {
      label = 19;
      break;
    } else {
      label = 17;
      break;
    }
   case 17:
    $fd56 = $11 + 8 | 0;
    $18 = HEAP32[$fd56 >> 2] | 0;
    $cmp57 = ($18 | 0) == ($6 | 0);
    if ($cmp57) {
      label = 18;
      break;
    } else {
      label = 19;
      break;
    }
   case 18:
    $bk66 = $9 + 12 | 0;
    HEAP32[$bk66 >> 2] = $11;
    $fd67 = $11 + 8 | 0;
    HEAP32[$fd67 >> 2] = $9;
    $p_0 = $6;
    $psize_0 = $add17;
    label = 57;
    break;
   case 19:
    _abort();
   case 20:
    _abort();
   case 21:
    $19 = $add_ptr16;
    $add_ptr16_sum261 = $add_ptr_sum232 + 24 | 0;
    $parent = $mem + $add_ptr16_sum261 | 0;
    $20 = $parent;
    $21 = HEAP32[$20 >> 2] | 0;
    $add_ptr16_sum262 = $add_ptr_sum232 + 12 | 0;
    $bk73 = $mem + $add_ptr16_sum262 | 0;
    $22 = $bk73;
    $23 = HEAP32[$22 >> 2] | 0;
    $cmp74 = ($23 | 0) == ($19 | 0);
    if ($cmp74) {
      label = 27;
      break;
    } else {
      label = 22;
      break;
    }
   case 22:
    $add_ptr16_sum266 = $add_ptr_sum232 + 8 | 0;
    $fd78 = $mem + $add_ptr16_sum266 | 0;
    $24 = $fd78;
    $25 = HEAP32[$24 >> 2] | 0;
    $26 = $25;
    $cmp80 = $26 >>> 0 < $1 >>> 0;
    if ($cmp80) {
      label = 26;
      break;
    } else {
      label = 23;
      break;
    }
   case 23:
    $bk82 = $25 + 12 | 0;
    $27 = HEAP32[$bk82 >> 2] | 0;
    $cmp83 = ($27 | 0) == ($19 | 0);
    if ($cmp83) {
      label = 24;
      break;
    } else {
      label = 26;
      break;
    }
   case 24:
    $fd86 = $23 + 8 | 0;
    $28 = HEAP32[$fd86 >> 2] | 0;
    $cmp87 = ($28 | 0) == ($19 | 0);
    if ($cmp87) {
      label = 25;
      break;
    } else {
      label = 26;
      break;
    }
   case 25:
    HEAP32[$bk82 >> 2] = $23;
    HEAP32[$fd86 >> 2] = $25;
    $R_1 = $23;
    label = 35;
    break;
   case 26:
    _abort();
   case 27:
    $child_sum = $add_ptr_sum232 + 20 | 0;
    $arrayidx99 = $mem + $child_sum | 0;
    $29 = $arrayidx99;
    $30 = HEAP32[$29 >> 2] | 0;
    $cmp100 = ($30 | 0) == 0;
    if ($cmp100) {
      label = 28;
      break;
    } else {
      $R_0 = $30;
      $RP_0 = $29;
      label = 29;
      break;
    }
   case 28:
    $add_ptr16_sum263 = $add_ptr_sum232 + 16 | 0;
    $child = $mem + $add_ptr16_sum263 | 0;
    $arrayidx103 = $child;
    $31 = HEAP32[$arrayidx103 >> 2] | 0;
    $cmp104 = ($31 | 0) == 0;
    if ($cmp104) {
      $R_1 = 0;
      label = 35;
      break;
    } else {
      $R_0 = $31;
      $RP_0 = $arrayidx103;
      label = 29;
      break;
    }
   case 29:
    $arrayidx108 = $R_0 + 20 | 0;
    $32 = HEAP32[$arrayidx108 >> 2] | 0;
    $cmp109 = ($32 | 0) == 0;
    if ($cmp109) {
      label = 30;
      break;
    } else {
      $CP_0 = $arrayidx108;
      label = 31;
      break;
    }
   case 30:
    $arrayidx113 = $R_0 + 16 | 0;
    $33 = HEAP32[$arrayidx113 >> 2] | 0;
    $cmp114 = ($33 | 0) == 0;
    if ($cmp114) {
      label = 32;
      break;
    } else {
      $CP_0 = $arrayidx113;
      label = 31;
      break;
    }
   case 31:
    $34 = HEAP32[$CP_0 >> 2] | 0;
    $R_0 = $34;
    $RP_0 = $CP_0;
    label = 29;
    break;
   case 32:
    $35 = $RP_0;
    $36 = HEAP32[94] | 0;
    $cmp118 = $35 >>> 0 < $36 >>> 0;
    if ($cmp118) {
      label = 34;
      break;
    } else {
      label = 33;
      break;
    }
   case 33:
    HEAP32[$RP_0 >> 2] = 0;
    $R_1 = $R_0;
    label = 35;
    break;
   case 34:
    _abort();
   case 35:
    $cmp127 = ($21 | 0) == 0;
    if ($cmp127) {
      $p_0 = $6;
      $psize_0 = $add17;
      label = 57;
      break;
    } else {
      label = 36;
      break;
    }
   case 36:
    $add_ptr16_sum264 = $add_ptr_sum232 + 28 | 0;
    $index = $mem + $add_ptr16_sum264 | 0;
    $37 = $index;
    $38 = HEAP32[$37 >> 2] | 0;
    $arrayidx130 = 664 + ($38 << 2) | 0;
    $39 = HEAP32[$arrayidx130 >> 2] | 0;
    $cmp131 = ($19 | 0) == ($39 | 0);
    if ($cmp131) {
      label = 37;
      break;
    } else {
      label = 39;
      break;
    }
   case 37:
    HEAP32[$arrayidx130 >> 2] = $R_1;
    $cond279 = ($R_1 | 0) == 0;
    if ($cond279) {
      label = 38;
      break;
    } else {
      label = 45;
      break;
    }
   case 38:
    $40 = HEAP32[$37 >> 2] | 0;
    $shl138 = 1 << $40;
    $neg139 = $shl138 ^ -1;
    $41 = HEAP32[91] | 0;
    $and140 = $41 & $neg139;
    HEAP32[91] = $and140;
    $p_0 = $6;
    $psize_0 = $add17;
    label = 57;
    break;
   case 39:
    $42 = $21;
    $43 = HEAP32[94] | 0;
    $cmp143 = $42 >>> 0 < $43 >>> 0;
    if ($cmp143) {
      label = 43;
      break;
    } else {
      label = 40;
      break;
    }
   case 40:
    $arrayidx149 = $21 + 16 | 0;
    $44 = HEAP32[$arrayidx149 >> 2] | 0;
    $cmp150 = ($44 | 0) == ($19 | 0);
    if ($cmp150) {
      label = 41;
      break;
    } else {
      label = 42;
      break;
    }
   case 41:
    HEAP32[$arrayidx149 >> 2] = $R_1;
    label = 44;
    break;
   case 42:
    $arrayidx157 = $21 + 20 | 0;
    HEAP32[$arrayidx157 >> 2] = $R_1;
    label = 44;
    break;
   case 43:
    _abort();
   case 44:
    $cmp162 = ($R_1 | 0) == 0;
    if ($cmp162) {
      $p_0 = $6;
      $psize_0 = $add17;
      label = 57;
      break;
    } else {
      label = 45;
      break;
    }
   case 45:
    $45 = $R_1;
    $46 = HEAP32[94] | 0;
    $cmp165 = $45 >>> 0 < $46 >>> 0;
    if ($cmp165) {
      label = 54;
      break;
    } else {
      label = 46;
      break;
    }
   case 46:
    $parent170 = $R_1 + 24 | 0;
    HEAP32[$parent170 >> 2] = $21;
    $add_ptr16_sum265 = $add_ptr_sum232 + 16 | 0;
    $child171 = $mem + $add_ptr16_sum265 | 0;
    $arrayidx172 = $child171;
    $47 = HEAP32[$arrayidx172 >> 2] | 0;
    $cmp173 = ($47 | 0) == 0;
    if ($cmp173) {
      label = 50;
      break;
    } else {
      label = 47;
      break;
    }
   case 47:
    $48 = $47;
    $49 = HEAP32[94] | 0;
    $cmp176 = $48 >>> 0 < $49 >>> 0;
    if ($cmp176) {
      label = 49;
      break;
    } else {
      label = 48;
      break;
    }
   case 48:
    $arrayidx182 = $R_1 + 16 | 0;
    HEAP32[$arrayidx182 >> 2] = $47;
    $parent183 = $47 + 24 | 0;
    HEAP32[$parent183 >> 2] = $R_1;
    label = 50;
    break;
   case 49:
    _abort();
   case 50:
    $child171_sum = $add_ptr_sum232 + 20 | 0;
    $arrayidx188 = $mem + $child171_sum | 0;
    $50 = $arrayidx188;
    $51 = HEAP32[$50 >> 2] | 0;
    $cmp189 = ($51 | 0) == 0;
    if ($cmp189) {
      $p_0 = $6;
      $psize_0 = $add17;
      label = 57;
      break;
    } else {
      label = 51;
      break;
    }
   case 51:
    $52 = $51;
    $53 = HEAP32[94] | 0;
    $cmp192 = $52 >>> 0 < $53 >>> 0;
    if ($cmp192) {
      label = 53;
      break;
    } else {
      label = 52;
      break;
    }
   case 52:
    $arrayidx198 = $R_1 + 20 | 0;
    HEAP32[$arrayidx198 >> 2] = $51;
    $parent199 = $51 + 24 | 0;
    HEAP32[$parent199 >> 2] = $R_1;
    $p_0 = $6;
    $psize_0 = $add17;
    label = 57;
    break;
   case 53:
    _abort();
   case 54:
    _abort();
   case 55:
    $add_ptr6_sum = $and5 - 4 | 0;
    $head209 = $mem + $add_ptr6_sum | 0;
    $54 = $head209;
    $55 = HEAP32[$54 >> 2] | 0;
    $and210 = $55 & 3;
    $cmp211 = ($and210 | 0) == 3;
    if ($cmp211) {
      label = 56;
      break;
    } else {
      $p_0 = $6;
      $psize_0 = $add17;
      label = 57;
      break;
    }
   case 56:
    HEAP32[92] = $add17;
    $56 = HEAP32[$54 >> 2] | 0;
    $and215 = $56 & -2;
    HEAP32[$54 >> 2] = $and215;
    $or = $add17 | 1;
    $add_ptr16_sum = $add_ptr_sum232 + 4 | 0;
    $head216 = $mem + $add_ptr16_sum | 0;
    $57 = $head216;
    HEAP32[$57 >> 2] = $or;
    $prev_foot218 = $add_ptr6;
    HEAP32[$prev_foot218 >> 2] = $add17;
    label = 142;
    break;
   case 57:
    $58 = $p_0;
    $cmp225 = $58 >>> 0 < $add_ptr6 >>> 0;
    if ($cmp225) {
      label = 58;
      break;
    } else {
      label = 141;
      break;
    }
   case 58:
    $add_ptr6_sum259 = $and5 - 4 | 0;
    $head228 = $mem + $add_ptr6_sum259 | 0;
    $59 = $head228;
    $60 = HEAP32[$59 >> 2] | 0;
    $and229 = $60 & 1;
    $phitmp = ($and229 | 0) == 0;
    if ($phitmp) {
      label = 141;
      break;
    } else {
      label = 59;
      break;
    }
   case 59:
    $and237 = $60 & 2;
    $tobool238 = ($and237 | 0) == 0;
    if ($tobool238) {
      label = 60;
      break;
    } else {
      label = 115;
      break;
    }
   case 60:
    $61 = HEAP32[96] | 0;
    $cmp240 = ($4 | 0) == ($61 | 0);
    if ($cmp240) {
      label = 61;
      break;
    } else {
      label = 65;
      break;
    }
   case 61:
    $62 = HEAP32[93] | 0;
    $add243 = $62 + $psize_0 | 0;
    HEAP32[93] = $add243;
    HEAP32[96] = $p_0;
    $or244 = $add243 | 1;
    $head245 = $p_0 + 4 | 0;
    HEAP32[$head245 >> 2] = $or244;
    $63 = HEAP32[95] | 0;
    $cmp246 = ($p_0 | 0) == ($63 | 0);
    if ($cmp246) {
      label = 62;
      break;
    } else {
      label = 63;
      break;
    }
   case 62:
    HEAP32[95] = 0;
    HEAP32[92] = 0;
    label = 63;
    break;
   case 63:
    $64 = HEAP32[97] | 0;
    $cmp250 = $add243 >>> 0 > $64 >>> 0;
    if ($cmp250) {
      label = 64;
      break;
    } else {
      label = 142;
      break;
    }
   case 64:
    $65 = _sys_trim(0) | 0;
    label = 142;
    break;
   case 65:
    $66 = HEAP32[95] | 0;
    $cmp255 = ($4 | 0) == ($66 | 0);
    if ($cmp255) {
      label = 66;
      break;
    } else {
      label = 67;
      break;
    }
   case 66:
    $67 = HEAP32[92] | 0;
    $add258 = $67 + $psize_0 | 0;
    HEAP32[92] = $add258;
    HEAP32[95] = $p_0;
    $or259 = $add258 | 1;
    $head260 = $p_0 + 4 | 0;
    HEAP32[$head260 >> 2] = $or259;
    $add_ptr261 = $58 + $add258 | 0;
    $prev_foot262 = $add_ptr261;
    HEAP32[$prev_foot262 >> 2] = $add258;
    label = 142;
    break;
   case 67:
    $and265 = $60 & -8;
    $add266 = $and265 + $psize_0 | 0;
    $shr267 = $60 >>> 3;
    $cmp268 = $60 >>> 0 < 256;
    if ($cmp268) {
      label = 68;
      break;
    } else {
      label = 79;
      break;
    }
   case 68:
    $fd272 = $mem + $and5 | 0;
    $68 = $fd272;
    $69 = HEAP32[$68 >> 2] | 0;
    $add_ptr6_sum253254 = $and5 | 4;
    $bk274 = $mem + $add_ptr6_sum253254 | 0;
    $70 = $bk274;
    $71 = HEAP32[$70 >> 2] | 0;
    $shl277 = $shr267 << 1;
    $arrayidx278 = 400 + ($shl277 << 2) | 0;
    $72 = $arrayidx278;
    $cmp279 = ($69 | 0) == ($72 | 0);
    if ($cmp279) {
      label = 71;
      break;
    } else {
      label = 69;
      break;
    }
   case 69:
    $73 = $69;
    $74 = HEAP32[94] | 0;
    $cmp282 = $73 >>> 0 < $74 >>> 0;
    if ($cmp282) {
      label = 78;
      break;
    } else {
      label = 70;
      break;
    }
   case 70:
    $bk285 = $69 + 12 | 0;
    $75 = HEAP32[$bk285 >> 2] | 0;
    $cmp286 = ($75 | 0) == ($4 | 0);
    if ($cmp286) {
      label = 71;
      break;
    } else {
      label = 78;
      break;
    }
   case 71:
    $cmp295 = ($71 | 0) == ($69 | 0);
    if ($cmp295) {
      label = 72;
      break;
    } else {
      label = 73;
      break;
    }
   case 72:
    $shl298 = 1 << $shr267;
    $neg299 = $shl298 ^ -1;
    $76 = HEAP32[90] | 0;
    $and300 = $76 & $neg299;
    HEAP32[90] = $and300;
    label = 113;
    break;
   case 73:
    $cmp304 = ($71 | 0) == ($72 | 0);
    if ($cmp304) {
      label = 76;
      break;
    } else {
      label = 74;
      break;
    }
   case 74:
    $77 = $71;
    $78 = HEAP32[94] | 0;
    $cmp307 = $77 >>> 0 < $78 >>> 0;
    if ($cmp307) {
      label = 77;
      break;
    } else {
      label = 75;
      break;
    }
   case 75:
    $fd310 = $71 + 8 | 0;
    $79 = HEAP32[$fd310 >> 2] | 0;
    $cmp311 = ($79 | 0) == ($4 | 0);
    if ($cmp311) {
      label = 76;
      break;
    } else {
      label = 77;
      break;
    }
   case 76:
    $bk320 = $69 + 12 | 0;
    HEAP32[$bk320 >> 2] = $71;
    $fd321 = $71 + 8 | 0;
    HEAP32[$fd321 >> 2] = $69;
    label = 113;
    break;
   case 77:
    _abort();
   case 78:
    _abort();
   case 79:
    $80 = $add_ptr6;
    $add_ptr6_sum234 = $and5 + 16 | 0;
    $parent330 = $mem + $add_ptr6_sum234 | 0;
    $81 = $parent330;
    $82 = HEAP32[$81 >> 2] | 0;
    $add_ptr6_sum235236 = $and5 | 4;
    $bk332 = $mem + $add_ptr6_sum235236 | 0;
    $83 = $bk332;
    $84 = HEAP32[$83 >> 2] | 0;
    $cmp333 = ($84 | 0) == ($80 | 0);
    if ($cmp333) {
      label = 85;
      break;
    } else {
      label = 80;
      break;
    }
   case 80:
    $fd337 = $mem + $and5 | 0;
    $85 = $fd337;
    $86 = HEAP32[$85 >> 2] | 0;
    $87 = $86;
    $88 = HEAP32[94] | 0;
    $cmp339 = $87 >>> 0 < $88 >>> 0;
    if ($cmp339) {
      label = 84;
      break;
    } else {
      label = 81;
      break;
    }
   case 81:
    $bk342 = $86 + 12 | 0;
    $89 = HEAP32[$bk342 >> 2] | 0;
    $cmp343 = ($89 | 0) == ($80 | 0);
    if ($cmp343) {
      label = 82;
      break;
    } else {
      label = 84;
      break;
    }
   case 82:
    $fd346 = $84 + 8 | 0;
    $90 = HEAP32[$fd346 >> 2] | 0;
    $cmp347 = ($90 | 0) == ($80 | 0);
    if ($cmp347) {
      label = 83;
      break;
    } else {
      label = 84;
      break;
    }
   case 83:
    HEAP32[$bk342 >> 2] = $84;
    HEAP32[$fd346 >> 2] = $86;
    $R331_1 = $84;
    label = 93;
    break;
   case 84:
    _abort();
   case 85:
    $child360_sum = $and5 + 12 | 0;
    $arrayidx361 = $mem + $child360_sum | 0;
    $91 = $arrayidx361;
    $92 = HEAP32[$91 >> 2] | 0;
    $cmp362 = ($92 | 0) == 0;
    if ($cmp362) {
      label = 86;
      break;
    } else {
      $R331_0 = $92;
      $RP359_0 = $91;
      label = 87;
      break;
    }
   case 86:
    $add_ptr6_sum237 = $and5 + 8 | 0;
    $child360 = $mem + $add_ptr6_sum237 | 0;
    $arrayidx366 = $child360;
    $93 = HEAP32[$arrayidx366 >> 2] | 0;
    $cmp367 = ($93 | 0) == 0;
    if ($cmp367) {
      $R331_1 = 0;
      label = 93;
      break;
    } else {
      $R331_0 = $93;
      $RP359_0 = $arrayidx366;
      label = 87;
      break;
    }
   case 87:
    $arrayidx373 = $R331_0 + 20 | 0;
    $94 = HEAP32[$arrayidx373 >> 2] | 0;
    $cmp374 = ($94 | 0) == 0;
    if ($cmp374) {
      label = 88;
      break;
    } else {
      $CP370_0 = $arrayidx373;
      label = 89;
      break;
    }
   case 88:
    $arrayidx378 = $R331_0 + 16 | 0;
    $95 = HEAP32[$arrayidx378 >> 2] | 0;
    $cmp379 = ($95 | 0) == 0;
    if ($cmp379) {
      label = 90;
      break;
    } else {
      $CP370_0 = $arrayidx378;
      label = 89;
      break;
    }
   case 89:
    $96 = HEAP32[$CP370_0 >> 2] | 0;
    $R331_0 = $96;
    $RP359_0 = $CP370_0;
    label = 87;
    break;
   case 90:
    $97 = $RP359_0;
    $98 = HEAP32[94] | 0;
    $cmp385 = $97 >>> 0 < $98 >>> 0;
    if ($cmp385) {
      label = 92;
      break;
    } else {
      label = 91;
      break;
    }
   case 91:
    HEAP32[$RP359_0 >> 2] = 0;
    $R331_1 = $R331_0;
    label = 93;
    break;
   case 92:
    _abort();
   case 93:
    $cmp394 = ($82 | 0) == 0;
    if ($cmp394) {
      label = 113;
      break;
    } else {
      label = 94;
      break;
    }
   case 94:
    $add_ptr6_sum247 = $and5 + 20 | 0;
    $index398 = $mem + $add_ptr6_sum247 | 0;
    $99 = $index398;
    $100 = HEAP32[$99 >> 2] | 0;
    $arrayidx399 = 664 + ($100 << 2) | 0;
    $101 = HEAP32[$arrayidx399 >> 2] | 0;
    $cmp400 = ($80 | 0) == ($101 | 0);
    if ($cmp400) {
      label = 95;
      break;
    } else {
      label = 97;
      break;
    }
   case 95:
    HEAP32[$arrayidx399 >> 2] = $R331_1;
    $cond280 = ($R331_1 | 0) == 0;
    if ($cond280) {
      label = 96;
      break;
    } else {
      label = 103;
      break;
    }
   case 96:
    $102 = HEAP32[$99 >> 2] | 0;
    $shl407 = 1 << $102;
    $neg408 = $shl407 ^ -1;
    $103 = HEAP32[91] | 0;
    $and409 = $103 & $neg408;
    HEAP32[91] = $and409;
    label = 113;
    break;
   case 97:
    $104 = $82;
    $105 = HEAP32[94] | 0;
    $cmp412 = $104 >>> 0 < $105 >>> 0;
    if ($cmp412) {
      label = 101;
      break;
    } else {
      label = 98;
      break;
    }
   case 98:
    $arrayidx418 = $82 + 16 | 0;
    $106 = HEAP32[$arrayidx418 >> 2] | 0;
    $cmp419 = ($106 | 0) == ($80 | 0);
    if ($cmp419) {
      label = 99;
      break;
    } else {
      label = 100;
      break;
    }
   case 99:
    HEAP32[$arrayidx418 >> 2] = $R331_1;
    label = 102;
    break;
   case 100:
    $arrayidx426 = $82 + 20 | 0;
    HEAP32[$arrayidx426 >> 2] = $R331_1;
    label = 102;
    break;
   case 101:
    _abort();
   case 102:
    $cmp431 = ($R331_1 | 0) == 0;
    if ($cmp431) {
      label = 113;
      break;
    } else {
      label = 103;
      break;
    }
   case 103:
    $107 = $R331_1;
    $108 = HEAP32[94] | 0;
    $cmp434 = $107 >>> 0 < $108 >>> 0;
    if ($cmp434) {
      label = 112;
      break;
    } else {
      label = 104;
      break;
    }
   case 104:
    $parent441 = $R331_1 + 24 | 0;
    HEAP32[$parent441 >> 2] = $82;
    $add_ptr6_sum248 = $and5 + 8 | 0;
    $child442 = $mem + $add_ptr6_sum248 | 0;
    $arrayidx443 = $child442;
    $109 = HEAP32[$arrayidx443 >> 2] | 0;
    $cmp444 = ($109 | 0) == 0;
    if ($cmp444) {
      label = 108;
      break;
    } else {
      label = 105;
      break;
    }
   case 105:
    $110 = $109;
    $111 = HEAP32[94] | 0;
    $cmp447 = $110 >>> 0 < $111 >>> 0;
    if ($cmp447) {
      label = 107;
      break;
    } else {
      label = 106;
      break;
    }
   case 106:
    $arrayidx453 = $R331_1 + 16 | 0;
    HEAP32[$arrayidx453 >> 2] = $109;
    $parent454 = $109 + 24 | 0;
    HEAP32[$parent454 >> 2] = $R331_1;
    label = 108;
    break;
   case 107:
    _abort();
   case 108:
    $child442_sum = $and5 + 12 | 0;
    $arrayidx459 = $mem + $child442_sum | 0;
    $112 = $arrayidx459;
    $113 = HEAP32[$112 >> 2] | 0;
    $cmp460 = ($113 | 0) == 0;
    if ($cmp460) {
      label = 113;
      break;
    } else {
      label = 109;
      break;
    }
   case 109:
    $114 = $113;
    $115 = HEAP32[94] | 0;
    $cmp463 = $114 >>> 0 < $115 >>> 0;
    if ($cmp463) {
      label = 111;
      break;
    } else {
      label = 110;
      break;
    }
   case 110:
    $arrayidx469 = $R331_1 + 20 | 0;
    HEAP32[$arrayidx469 >> 2] = $113;
    $parent470 = $113 + 24 | 0;
    HEAP32[$parent470 >> 2] = $R331_1;
    label = 113;
    break;
   case 111:
    _abort();
   case 112:
    _abort();
   case 113:
    $or479 = $add266 | 1;
    $head480 = $p_0 + 4 | 0;
    HEAP32[$head480 >> 2] = $or479;
    $add_ptr481 = $58 + $add266 | 0;
    $prev_foot482 = $add_ptr481;
    HEAP32[$prev_foot482 >> 2] = $add266;
    $116 = HEAP32[95] | 0;
    $cmp483 = ($p_0 | 0) == ($116 | 0);
    if ($cmp483) {
      label = 114;
      break;
    } else {
      $psize_1 = $add266;
      label = 116;
      break;
    }
   case 114:
    HEAP32[92] = $add266;
    label = 142;
    break;
   case 115:
    $and491 = $60 & -2;
    HEAP32[$59 >> 2] = $and491;
    $or492 = $psize_0 | 1;
    $head493 = $p_0 + 4 | 0;
    HEAP32[$head493 >> 2] = $or492;
    $add_ptr494 = $58 + $psize_0 | 0;
    $prev_foot495 = $add_ptr494;
    HEAP32[$prev_foot495 >> 2] = $psize_0;
    $psize_1 = $psize_0;
    label = 116;
    break;
   case 116:
    $shr497 = $psize_1 >>> 3;
    $cmp498 = $psize_1 >>> 0 < 256;
    if ($cmp498) {
      label = 117;
      break;
    } else {
      label = 122;
      break;
    }
   case 117:
    $shl504 = $shr497 << 1;
    $arrayidx505 = 400 + ($shl504 << 2) | 0;
    $117 = $arrayidx505;
    $118 = HEAP32[90] | 0;
    $shl507 = 1 << $shr497;
    $and508 = $118 & $shl507;
    $tobool509 = ($and508 | 0) == 0;
    if ($tobool509) {
      label = 118;
      break;
    } else {
      label = 119;
      break;
    }
   case 118:
    $or512 = $118 | $shl507;
    HEAP32[90] = $or512;
    $F506_0 = $117;
    label = 121;
    break;
   case 119:
    $arrayidx505_sum246 = $shl504 + 2 | 0;
    $119 = 400 + ($arrayidx505_sum246 << 2) | 0;
    $120 = HEAP32[$119 >> 2] | 0;
    $121 = $120;
    $122 = HEAP32[94] | 0;
    $cmp515 = $121 >>> 0 < $122 >>> 0;
    if ($cmp515) {
      label = 120;
      break;
    } else {
      $F506_0 = $120;
      label = 121;
      break;
    }
   case 120:
    _abort();
   case 121:
    $arrayidx505_sum = $shl504 + 2 | 0;
    $123 = 400 + ($arrayidx505_sum << 2) | 0;
    HEAP32[$123 >> 2] = $p_0;
    $bk525 = $F506_0 + 12 | 0;
    HEAP32[$bk525 >> 2] = $p_0;
    $fd526 = $p_0 + 8 | 0;
    HEAP32[$fd526 >> 2] = $F506_0;
    $bk527 = $p_0 + 12 | 0;
    HEAP32[$bk527 >> 2] = $117;
    label = 142;
    break;
   case 122:
    $124 = $p_0;
    $shr531 = $psize_1 >>> 8;
    $cmp532 = ($shr531 | 0) == 0;
    if ($cmp532) {
      $I530_0 = 0;
      label = 125;
      break;
    } else {
      label = 123;
      break;
    }
   case 123:
    $cmp536 = $psize_1 >>> 0 > 16777215;
    if ($cmp536) {
      $I530_0 = 31;
      label = 125;
      break;
    } else {
      label = 124;
      break;
    }
   case 124:
    $sub = $shr531 + 1048320 | 0;
    $shr540 = $sub >>> 16;
    $and541 = $shr540 & 8;
    $shl542 = $shr531 << $and541;
    $sub543 = $shl542 + 520192 | 0;
    $shr544 = $sub543 >>> 16;
    $and545 = $shr544 & 4;
    $add546 = $and545 | $and541;
    $shl547 = $shl542 << $and545;
    $sub548 = $shl547 + 245760 | 0;
    $shr549 = $sub548 >>> 16;
    $and550 = $shr549 & 2;
    $add551 = $add546 | $and550;
    $sub552 = 14 - $add551 | 0;
    $shl553 = $shl547 << $and550;
    $shr554 = $shl553 >>> 15;
    $add555 = $sub552 + $shr554 | 0;
    $shl556 = $add555 << 1;
    $add557 = $add555 + 7 | 0;
    $shr558 = $psize_1 >>> ($add557 >>> 0);
    $and559 = $shr558 & 1;
    $add560 = $and559 | $shl556;
    $I530_0 = $add560;
    label = 125;
    break;
   case 125:
    $arrayidx563 = 664 + ($I530_0 << 2) | 0;
    $index564 = $p_0 + 28 | 0;
    $I530_0_c = $I530_0;
    HEAP32[$index564 >> 2] = $I530_0_c;
    $arrayidx566 = $p_0 + 20 | 0;
    HEAP32[$arrayidx566 >> 2] = 0;
    $125 = $p_0 + 16 | 0;
    HEAP32[$125 >> 2] = 0;
    $126 = HEAP32[91] | 0;
    $shl569 = 1 << $I530_0;
    $and570 = $126 & $shl569;
    $tobool571 = ($and570 | 0) == 0;
    if ($tobool571) {
      label = 126;
      break;
    } else {
      label = 127;
      break;
    }
   case 126:
    $or574 = $126 | $shl569;
    HEAP32[91] = $or574;
    HEAP32[$arrayidx563 >> 2] = $124;
    $parent575 = $p_0 + 24 | 0;
    $_c = $arrayidx563;
    HEAP32[$parent575 >> 2] = $_c;
    $bk576 = $p_0 + 12 | 0;
    HEAP32[$bk576 >> 2] = $p_0;
    $fd577 = $p_0 + 8 | 0;
    HEAP32[$fd577 >> 2] = $p_0;
    label = 139;
    break;
   case 127:
    $127 = HEAP32[$arrayidx563 >> 2] | 0;
    $cmp580 = ($I530_0 | 0) == 31;
    if ($cmp580) {
      $cond = 0;
      label = 129;
      break;
    } else {
      label = 128;
      break;
    }
   case 128:
    $shr582 = $I530_0 >>> 1;
    $sub585 = 25 - $shr582 | 0;
    $cond = $sub585;
    label = 129;
    break;
   case 129:
    $shl586 = $psize_1 << $cond;
    $K579_0 = $shl586;
    $T_0 = $127;
    label = 130;
    break;
   case 130:
    $head587 = $T_0 + 4 | 0;
    $128 = HEAP32[$head587 >> 2] | 0;
    $and588 = $128 & -8;
    $cmp589 = ($and588 | 0) == ($psize_1 | 0);
    if ($cmp589) {
      label = 135;
      break;
    } else {
      label = 131;
      break;
    }
   case 131:
    $shr592 = $K579_0 >>> 31;
    $arrayidx595 = $T_0 + 16 + ($shr592 << 2) | 0;
    $129 = HEAP32[$arrayidx595 >> 2] | 0;
    $cmp597 = ($129 | 0) == 0;
    $shl596 = $K579_0 << 1;
    if ($cmp597) {
      label = 132;
      break;
    } else {
      $K579_0 = $shl596;
      $T_0 = $129;
      label = 130;
      break;
    }
   case 132:
    $130 = $arrayidx595;
    $131 = HEAP32[94] | 0;
    $cmp601 = $130 >>> 0 < $131 >>> 0;
    if ($cmp601) {
      label = 134;
      break;
    } else {
      label = 133;
      break;
    }
   case 133:
    HEAP32[$arrayidx595 >> 2] = $124;
    $parent606 = $p_0 + 24 | 0;
    $T_0_c243 = $T_0;
    HEAP32[$parent606 >> 2] = $T_0_c243;
    $bk607 = $p_0 + 12 | 0;
    HEAP32[$bk607 >> 2] = $p_0;
    $fd608 = $p_0 + 8 | 0;
    HEAP32[$fd608 >> 2] = $p_0;
    label = 139;
    break;
   case 134:
    _abort();
   case 135:
    $fd613 = $T_0 + 8 | 0;
    $132 = HEAP32[$fd613 >> 2] | 0;
    $133 = $T_0;
    $134 = HEAP32[94] | 0;
    $cmp614 = $133 >>> 0 < $134 >>> 0;
    if ($cmp614) {
      label = 138;
      break;
    } else {
      label = 136;
      break;
    }
   case 136:
    $135 = $132;
    $cmp617 = $135 >>> 0 < $134 >>> 0;
    if ($cmp617) {
      label = 138;
      break;
    } else {
      label = 137;
      break;
    }
   case 137:
    $bk624 = $132 + 12 | 0;
    HEAP32[$bk624 >> 2] = $124;
    HEAP32[$fd613 >> 2] = $124;
    $fd626 = $p_0 + 8 | 0;
    $_c242 = $132;
    HEAP32[$fd626 >> 2] = $_c242;
    $bk627 = $p_0 + 12 | 0;
    $T_0_c = $T_0;
    HEAP32[$bk627 >> 2] = $T_0_c;
    $parent628 = $p_0 + 24 | 0;
    HEAP32[$parent628 >> 2] = 0;
    label = 139;
    break;
   case 138:
    _abort();
   case 139:
    $136 = HEAP32[98] | 0;
    $dec = $136 - 1 | 0;
    HEAP32[98] = $dec;
    $cmp632 = ($dec | 0) == 0;
    if ($cmp632) {
      label = 140;
      break;
    } else {
      label = 142;
      break;
    }
   case 140:
    _release_unused_segments();
    label = 142;
    break;
   case 141:
    _abort();
   case 142:
    return;
  }
}
function _release_unused_segments() {
  var $sp_0_in = 0, $sp_0 = 0, $cmp = 0, $next4 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $sp_0_in = 816;
    label = 3;
    break;
   case 3:
    $sp_0 = HEAP32[$sp_0_in >> 2] | 0;
    $cmp = ($sp_0 | 0) == 0;
    $next4 = $sp_0 + 8 | 0;
    if ($cmp) {
      label = 4;
      break;
    } else {
      $sp_0_in = $next4;
      label = 3;
      break;
    }
   case 4:
    HEAP32[98] = -1;
    return;
  }
}
function _sys_trim($pad) {
  $pad = $pad | 0;
  var $0 = 0, $cmp = 0, $cmp1 = 0, $1 = 0, $cmp2 = 0, $add = 0, $2 = 0, $cmp3 = 0, $3 = 0, $add_neg = 0, $sub6 = 0, $sub = 0, $add7 = 0, $div = 0, $sub8 = 0, $mul = 0, $4 = 0, $call10 = 0, $sflags = 0, $5 = 0, $and = 0, $tobool11 = 0, $call20 = 0, $base = 0, $6 = 0, $size = 0, $7 = 0, $add_ptr = 0, $cmp21 = 0, $sub19 = 0, $cmp17 = 0, $sub19_mul = 0, $sub23 = 0, $call24 = 0, $call25 = 0, $cmp26 = 0, $cmp28 = 0, $or_cond = 0, $sub_ptr_lhs_cast = 0, $sub_ptr_rhs_cast = 0, $sub_ptr_sub = 0, $cmp34 = 0, $size36 = 0, $8 = 0, $sub37 = 0, $9 = 0, $sub38 = 0, $10 = 0, $11 = 0, $sub41 = 0, $phitmp = 0, $phitmp4 = 0, $12 = 0, $13 = 0, $cmp47 = 0, $released_2 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = HEAP32[2] | 0;
    $cmp = ($0 | 0) == 0;
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    _init_mparams();
    label = 4;
    break;
   case 4:
    $cmp1 = $pad >>> 0 < 4294967232;
    if ($cmp1) {
      label = 5;
      break;
    } else {
      $released_2 = 0;
      label = 14;
      break;
    }
   case 5:
    $1 = HEAP32[96] | 0;
    $cmp2 = ($1 | 0) == 0;
    if ($cmp2) {
      $released_2 = 0;
      label = 14;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $add = $pad + 40 | 0;
    $2 = HEAP32[93] | 0;
    $cmp3 = $2 >>> 0 > $add >>> 0;
    if ($cmp3) {
      label = 7;
      break;
    } else {
      label = 12;
      break;
    }
   case 7:
    $3 = HEAP32[4] | 0;
    $add_neg = -40 - $pad | 0;
    $sub6 = $add_neg - 1 | 0;
    $sub = $sub6 + $2 | 0;
    $add7 = $sub + $3 | 0;
    $div = ($add7 >>> 0) / ($3 >>> 0) >>> 0;
    $sub8 = $div - 1 | 0;
    $mul = Math_imul($sub8, $3);
    $4 = $1;
    $call10 = _segment_holding($4) | 0;
    $sflags = $call10 + 12 | 0;
    $5 = HEAP32[$sflags >> 2] | 0;
    $and = $5 & 8;
    $tobool11 = ($and | 0) == 0;
    if ($tobool11) {
      label = 8;
      break;
    } else {
      label = 12;
      break;
    }
   case 8:
    $call20 = _sbrk(0) | 0;
    $base = $call10 | 0;
    $6 = HEAP32[$base >> 2] | 0;
    $size = $call10 + 4 | 0;
    $7 = HEAP32[$size >> 2] | 0;
    $add_ptr = $6 + $7 | 0;
    $cmp21 = ($call20 | 0) == ($add_ptr | 0);
    if ($cmp21) {
      label = 9;
      break;
    } else {
      label = 12;
      break;
    }
   case 9:
    $sub19 = -2147483648 - $3 | 0;
    $cmp17 = $mul >>> 0 > 2147483646;
    $sub19_mul = $cmp17 ? $sub19 : $mul;
    $sub23 = -$sub19_mul | 0;
    $call24 = _sbrk($sub23 | 0) | 0;
    $call25 = _sbrk(0) | 0;
    $cmp26 = ($call24 | 0) != -1;
    $cmp28 = $call25 >>> 0 < $call20 >>> 0;
    $or_cond = $cmp26 & $cmp28;
    if ($or_cond) {
      label = 10;
      break;
    } else {
      label = 12;
      break;
    }
   case 10:
    $sub_ptr_lhs_cast = $call20;
    $sub_ptr_rhs_cast = $call25;
    $sub_ptr_sub = $sub_ptr_lhs_cast - $sub_ptr_rhs_cast | 0;
    $cmp34 = ($call20 | 0) == ($call25 | 0);
    if ($cmp34) {
      label = 12;
      break;
    } else {
      label = 11;
      break;
    }
   case 11:
    $size36 = $call10 + 4 | 0;
    $8 = HEAP32[$size36 >> 2] | 0;
    $sub37 = $8 - $sub_ptr_sub | 0;
    HEAP32[$size36 >> 2] = $sub37;
    $9 = HEAP32[198] | 0;
    $sub38 = $9 - $sub_ptr_sub | 0;
    HEAP32[198] = $sub38;
    $10 = HEAP32[96] | 0;
    $11 = HEAP32[93] | 0;
    $sub41 = $11 - $sub_ptr_sub | 0;
    _init_top($10, $sub41);
    $phitmp = ($call20 | 0) != ($call25 | 0);
    $phitmp4 = $phitmp & 1;
    $released_2 = $phitmp4;
    label = 14;
    break;
   case 12:
    $12 = HEAP32[93] | 0;
    $13 = HEAP32[97] | 0;
    $cmp47 = $12 >>> 0 > $13 >>> 0;
    if ($cmp47) {
      label = 13;
      break;
    } else {
      $released_2 = 0;
      label = 14;
      break;
    }
   case 13:
    HEAP32[97] = -1;
    $released_2 = 0;
    label = 14;
    break;
   case 14:
    return $released_2 | 0;
  }
  return 0;
}
function _realloc($oldmem, $bytes) {
  $oldmem = $oldmem | 0;
  $bytes = $bytes | 0;
  var $cmp = 0, $call = 0, $cmp1 = 0, $call3 = 0, $cmp5 = 0, $add6 = 0, $and = 0, $cond = 0, $add_ptr = 0, $0 = 0, $call7 = 0, $cmp8 = 0, $add_ptr10 = 0, $1 = 0, $call12 = 0, $cmp13 = 0, $head = 0, $2 = 0, $3 = 0, $and15 = 0, $and17 = 0, $cmp18 = 0, $cond19 = 0, $sub = 0, $cmp20 = 0, $cond24 = 0, $mem_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $cmp = ($oldmem | 0) == 0;
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 3:
    $call = _malloc($bytes) | 0;
    $mem_0 = $call;
    label = 12;
    break;
   case 4:
    $cmp1 = $bytes >>> 0 > 4294967231;
    if ($cmp1) {
      label = 5;
      break;
    } else {
      label = 6;
      break;
    }
   case 5:
    $call3 = ___errno_location() | 0;
    HEAP32[$call3 >> 2] = 12;
    $mem_0 = 0;
    label = 12;
    break;
   case 6:
    $cmp5 = $bytes >>> 0 < 11;
    if ($cmp5) {
      $cond = 16;
      label = 8;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $add6 = $bytes + 11 | 0;
    $and = $add6 & -8;
    $cond = $and;
    label = 8;
    break;
   case 8:
    $add_ptr = $oldmem - 8 | 0;
    $0 = $add_ptr;
    $call7 = _try_realloc_chunk($0, $cond) | 0;
    $cmp8 = ($call7 | 0) == 0;
    if ($cmp8) {
      label = 10;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $add_ptr10 = $call7 + 8 | 0;
    $1 = $add_ptr10;
    $mem_0 = $1;
    label = 12;
    break;
   case 10:
    $call12 = _malloc($bytes) | 0;
    $cmp13 = ($call12 | 0) == 0;
    if ($cmp13) {
      $mem_0 = 0;
      label = 12;
      break;
    } else {
      label = 11;
      break;
    }
   case 11:
    $head = $oldmem - 4 | 0;
    $2 = $head;
    $3 = HEAP32[$2 >> 2] | 0;
    $and15 = $3 & -8;
    $and17 = $3 & 3;
    $cmp18 = ($and17 | 0) == 0;
    $cond19 = $cmp18 ? 8 : 4;
    $sub = $and15 - $cond19 | 0;
    $cmp20 = $sub >>> 0 < $bytes >>> 0;
    $cond24 = $cmp20 ? $sub : $bytes;
    _memcpy($call12 | 0, $oldmem | 0, $cond24);
    _free($oldmem);
    $mem_0 = $call12;
    label = 12;
    break;
   case 12:
    return $mem_0 | 0;
  }
  return 0;
}
function _try_realloc_chunk($p, $nb) {
  $p = $p | 0;
  $nb = $nb | 0;
  var $head = 0, $0 = 0, $and = 0, $1 = 0, $add_ptr = 0, $2 = 0, $3 = 0, $cmp = 0, $and2 = 0, $cmp3 = 0, $cmp5 = 0, $or_cond = 0, $add_ptr_sum2122 = 0, $head6 = 0, $4 = 0, $5 = 0, $and7 = 0, $phitmp = 0, $cmp11 = 0, $call = 0, $cmp13 = 0, $sub = 0, $cmp15 = 0, $add_ptr17 = 0, $6 = 0, $and19 = 0, $or = 0, $or20 = 0, $add_ptr17_sum = 0, $head23 = 0, $7 = 0, $or28 = 0, $8 = 0, $or32 = 0, $9 = 0, $cmp34 = 0, $10 = 0, $add = 0, $cmp36 = 0, $sub40 = 0, $add_ptr41 = 0, $11 = 0, $and43 = 0, $or44 = 0, $or45 = 0, $add_ptr41_sum = 0, $head48 = 0, $12 = 0, $or50 = 0, $13 = 0, $cmp56 = 0, $14 = 0, $add58 = 0, $cmp59 = 0, $sub62 = 0, $cmp63 = 0, $add_ptr66 = 0, $15 = 0, $add_ptr67 = 0, $and69 = 0, $or70 = 0, $or71 = 0, $add_ptr66_sum = 0, $head74 = 0, $16 = 0, $or76 = 0, $prev_foot = 0, $add_ptr67_sum = 0, $head79 = 0, $17 = 0, $18 = 0, $and80 = 0, $and87 = 0, $or88 = 0, $or89 = 0, $add_ptr91_sum = 0, $head92 = 0, $19 = 0, $20 = 0, $or93 = 0, $storemerge18 = 0, $storemerge = 0, $and100 = 0, $tobool101 = 0, $and104 = 0, $add105 = 0, $cmp106 = 0, $sub110 = 0, $shr = 0, $cmp111 = 0, $add_ptr_sum12 = 0, $fd = 0, $21 = 0, $22 = 0, $add_ptr_sum13 = 0, $bk = 0, $23 = 0, $24 = 0, $shl = 0, $arrayidx = 0, $25 = 0, $cmp114 = 0, $26 = 0, $cmp116 = 0, $bk118 = 0, $27 = 0, $cmp119 = 0, $cmp125 = 0, $shl127 = 0, $neg = 0, $28 = 0, $and128 = 0, $cmp133 = 0, $29 = 0, $30 = 0, $cmp136 = 0, $fd138 = 0, $31 = 0, $cmp139 = 0, $bk147 = 0, $fd148 = 0, $32 = 0, $add_ptr_sum = 0, $parent = 0, $33 = 0, $34 = 0, $add_ptr_sum2 = 0, $bk155 = 0, $35 = 0, $36 = 0, $cmp156 = 0, $add_ptr_sum9 = 0, $fd159 = 0, $37 = 0, $38 = 0, $39 = 0, $cmp162 = 0, $bk164 = 0, $40 = 0, $cmp165 = 0, $fd167 = 0, $41 = 0, $cmp168 = 0, $child_sum = 0, $arrayidx179 = 0, $42 = 0, $43 = 0, $cmp180 = 0, $add_ptr_sum3 = 0, $child = 0, $arrayidx182 = 0, $44 = 0, $cmp183 = 0, $RP_0 = 0, $R_0 = 0, $arrayidx186 = 0, $45 = 0, $cmp187 = 0, $arrayidx190 = 0, $46 = 0, $cmp191 = 0, $CP_0 = 0, $47 = 0, $48 = 0, $49 = 0, $cmp195 = 0, $R_1 = 0, $cmp203 = 0, $add_ptr_sum7 = 0, $index = 0, $50 = 0, $51 = 0, $arrayidx206 = 0, $52 = 0, $cmp207 = 0, $cond = 0, $53 = 0, $shl214 = 0, $neg215 = 0, $54 = 0, $and216 = 0, $55 = 0, $56 = 0, $cmp220 = 0, $arrayidx226 = 0, $57 = 0, $cmp227 = 0, $arrayidx234 = 0, $cmp239 = 0, $58 = 0, $59 = 0, $cmp243 = 0, $parent248 = 0, $add_ptr_sum8 = 0, $child249 = 0, $arrayidx250 = 0, $60 = 0, $cmp251 = 0, $61 = 0, $62 = 0, $cmp255 = 0, $arrayidx261 = 0, $parent262 = 0, $child249_sum = 0, $arrayidx267 = 0, $63 = 0, $64 = 0, $cmp268 = 0, $65 = 0, $66 = 0, $cmp272 = 0, $arrayidx278 = 0, $parent279 = 0, $cmp288 = 0, $67 = 0, $and294 = 0, $or295 = 0, $or296 = 0, $add_ptr298_sum6 = 0, $head299 = 0, $68 = 0, $69 = 0, $or300 = 0, $add_ptr303 = 0, $70 = 0, $71 = 0, $and305 = 0, $or306 = 0, $or307 = 0, $add_ptr303_sum = 0, $head310 = 0, $72 = 0, $or315 = 0, $add_ptr317_sum5 = 0, $head318 = 0, $73 = 0, $74 = 0, $or319 = 0, $newp_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $head = $p + 4 | 0;
    $0 = HEAP32[$head >> 2] | 0;
    $and = $0 & -8;
    $1 = $p;
    $add_ptr = $1 + $and | 0;
    $2 = $add_ptr;
    $3 = HEAP32[94] | 0;
    $cmp = $1 >>> 0 < $3 >>> 0;
    if ($cmp) {
      label = 70;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $and2 = $0 & 3;
    $cmp3 = ($and2 | 0) != 1;
    $cmp5 = $1 >>> 0 < $add_ptr >>> 0;
    $or_cond = $cmp3 & $cmp5;
    if ($or_cond) {
      label = 4;
      break;
    } else {
      label = 70;
      break;
    }
   case 4:
    $add_ptr_sum2122 = $and | 4;
    $head6 = $1 + $add_ptr_sum2122 | 0;
    $4 = $head6;
    $5 = HEAP32[$4 >> 2] | 0;
    $and7 = $5 & 1;
    $phitmp = ($and7 | 0) == 0;
    if ($phitmp) {
      label = 70;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $cmp11 = ($and2 | 0) == 0;
    if ($cmp11) {
      label = 6;
      break;
    } else {
      label = 7;
      break;
    }
   case 6:
    $call = _mmap_resize($p, $nb) | 0;
    $newp_0 = $call;
    label = 71;
    break;
   case 7:
    $cmp13 = $and >>> 0 < $nb >>> 0;
    if ($cmp13) {
      label = 10;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $sub = $and - $nb | 0;
    $cmp15 = $sub >>> 0 > 15;
    if ($cmp15) {
      label = 9;
      break;
    } else {
      $newp_0 = $p;
      label = 71;
      break;
    }
   case 9:
    $add_ptr17 = $1 + $nb | 0;
    $6 = $add_ptr17;
    $and19 = $0 & 1;
    $or = $and19 | $nb;
    $or20 = $or | 2;
    HEAP32[$head >> 2] = $or20;
    $add_ptr17_sum = $nb + 4 | 0;
    $head23 = $1 + $add_ptr17_sum | 0;
    $7 = $head23;
    $or28 = $sub | 3;
    HEAP32[$7 >> 2] = $or28;
    $8 = HEAP32[$4 >> 2] | 0;
    $or32 = $8 | 1;
    HEAP32[$4 >> 2] = $or32;
    _dispose_chunk($6, $sub);
    $newp_0 = $p;
    label = 71;
    break;
   case 10:
    $9 = HEAP32[96] | 0;
    $cmp34 = ($2 | 0) == ($9 | 0);
    if ($cmp34) {
      label = 11;
      break;
    } else {
      label = 13;
      break;
    }
   case 11:
    $10 = HEAP32[93] | 0;
    $add = $10 + $and | 0;
    $cmp36 = $add >>> 0 > $nb >>> 0;
    if ($cmp36) {
      label = 12;
      break;
    } else {
      $newp_0 = 0;
      label = 71;
      break;
    }
   case 12:
    $sub40 = $add - $nb | 0;
    $add_ptr41 = $1 + $nb | 0;
    $11 = $add_ptr41;
    $and43 = $0 & 1;
    $or44 = $and43 | $nb;
    $or45 = $or44 | 2;
    HEAP32[$head >> 2] = $or45;
    $add_ptr41_sum = $nb + 4 | 0;
    $head48 = $1 + $add_ptr41_sum | 0;
    $12 = $head48;
    $or50 = $sub40 | 1;
    HEAP32[$12 >> 2] = $or50;
    HEAP32[96] = $11;
    HEAP32[93] = $sub40;
    $newp_0 = $p;
    label = 71;
    break;
   case 13:
    $13 = HEAP32[95] | 0;
    $cmp56 = ($2 | 0) == ($13 | 0);
    if ($cmp56) {
      label = 14;
      break;
    } else {
      label = 19;
      break;
    }
   case 14:
    $14 = HEAP32[92] | 0;
    $add58 = $14 + $and | 0;
    $cmp59 = $add58 >>> 0 < $nb >>> 0;
    if ($cmp59) {
      $newp_0 = 0;
      label = 71;
      break;
    } else {
      label = 15;
      break;
    }
   case 15:
    $sub62 = $add58 - $nb | 0;
    $cmp63 = $sub62 >>> 0 > 15;
    if ($cmp63) {
      label = 16;
      break;
    } else {
      label = 17;
      break;
    }
   case 16:
    $add_ptr66 = $1 + $nb | 0;
    $15 = $add_ptr66;
    $add_ptr67 = $1 + $add58 | 0;
    $and69 = $0 & 1;
    $or70 = $and69 | $nb;
    $or71 = $or70 | 2;
    HEAP32[$head >> 2] = $or71;
    $add_ptr66_sum = $nb + 4 | 0;
    $head74 = $1 + $add_ptr66_sum | 0;
    $16 = $head74;
    $or76 = $sub62 | 1;
    HEAP32[$16 >> 2] = $or76;
    $prev_foot = $add_ptr67;
    HEAP32[$prev_foot >> 2] = $sub62;
    $add_ptr67_sum = $add58 + 4 | 0;
    $head79 = $1 + $add_ptr67_sum | 0;
    $17 = $head79;
    $18 = HEAP32[$17 >> 2] | 0;
    $and80 = $18 & -2;
    HEAP32[$17 >> 2] = $and80;
    $storemerge = $15;
    $storemerge18 = $sub62;
    label = 18;
    break;
   case 17:
    $and87 = $0 & 1;
    $or88 = $and87 | $add58;
    $or89 = $or88 | 2;
    HEAP32[$head >> 2] = $or89;
    $add_ptr91_sum = $add58 + 4 | 0;
    $head92 = $1 + $add_ptr91_sum | 0;
    $19 = $head92;
    $20 = HEAP32[$19 >> 2] | 0;
    $or93 = $20 | 1;
    HEAP32[$19 >> 2] = $or93;
    $storemerge = 0;
    $storemerge18 = 0;
    label = 18;
    break;
   case 18:
    HEAP32[92] = $storemerge18;
    HEAP32[95] = $storemerge;
    $newp_0 = $p;
    label = 71;
    break;
   case 19:
    $and100 = $5 & 2;
    $tobool101 = ($and100 | 0) == 0;
    if ($tobool101) {
      label = 20;
      break;
    } else {
      $newp_0 = 0;
      label = 71;
      break;
    }
   case 20:
    $and104 = $5 & -8;
    $add105 = $and104 + $and | 0;
    $cmp106 = $add105 >>> 0 < $nb >>> 0;
    if ($cmp106) {
      $newp_0 = 0;
      label = 71;
      break;
    } else {
      label = 21;
      break;
    }
   case 21:
    $sub110 = $add105 - $nb | 0;
    $shr = $5 >>> 3;
    $cmp111 = $5 >>> 0 < 256;
    if ($cmp111) {
      label = 22;
      break;
    } else {
      label = 33;
      break;
    }
   case 22:
    $add_ptr_sum12 = $and + 8 | 0;
    $fd = $1 + $add_ptr_sum12 | 0;
    $21 = $fd;
    $22 = HEAP32[$21 >> 2] | 0;
    $add_ptr_sum13 = $and + 12 | 0;
    $bk = $1 + $add_ptr_sum13 | 0;
    $23 = $bk;
    $24 = HEAP32[$23 >> 2] | 0;
    $shl = $shr << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $25 = $arrayidx;
    $cmp114 = ($22 | 0) == ($25 | 0);
    if ($cmp114) {
      label = 25;
      break;
    } else {
      label = 23;
      break;
    }
   case 23:
    $26 = $22;
    $cmp116 = $26 >>> 0 < $3 >>> 0;
    if ($cmp116) {
      label = 32;
      break;
    } else {
      label = 24;
      break;
    }
   case 24:
    $bk118 = $22 + 12 | 0;
    $27 = HEAP32[$bk118 >> 2] | 0;
    $cmp119 = ($27 | 0) == ($2 | 0);
    if ($cmp119) {
      label = 25;
      break;
    } else {
      label = 32;
      break;
    }
   case 25:
    $cmp125 = ($24 | 0) == ($22 | 0);
    if ($cmp125) {
      label = 26;
      break;
    } else {
      label = 27;
      break;
    }
   case 26:
    $shl127 = 1 << $shr;
    $neg = $shl127 ^ -1;
    $28 = HEAP32[90] | 0;
    $and128 = $28 & $neg;
    HEAP32[90] = $and128;
    label = 67;
    break;
   case 27:
    $cmp133 = ($24 | 0) == ($25 | 0);
    if ($cmp133) {
      label = 30;
      break;
    } else {
      label = 28;
      break;
    }
   case 28:
    $29 = $24;
    $30 = HEAP32[94] | 0;
    $cmp136 = $29 >>> 0 < $30 >>> 0;
    if ($cmp136) {
      label = 31;
      break;
    } else {
      label = 29;
      break;
    }
   case 29:
    $fd138 = $24 + 8 | 0;
    $31 = HEAP32[$fd138 >> 2] | 0;
    $cmp139 = ($31 | 0) == ($2 | 0);
    if ($cmp139) {
      label = 30;
      break;
    } else {
      label = 31;
      break;
    }
   case 30:
    $bk147 = $22 + 12 | 0;
    HEAP32[$bk147 >> 2] = $24;
    $fd148 = $24 + 8 | 0;
    HEAP32[$fd148 >> 2] = $22;
    label = 67;
    break;
   case 31:
    _abort();
    return 0;
    return 0;
   case 32:
    _abort();
    return 0;
    return 0;
   case 33:
    $32 = $add_ptr;
    $add_ptr_sum = $and + 24 | 0;
    $parent = $1 + $add_ptr_sum | 0;
    $33 = $parent;
    $34 = HEAP32[$33 >> 2] | 0;
    $add_ptr_sum2 = $and + 12 | 0;
    $bk155 = $1 + $add_ptr_sum2 | 0;
    $35 = $bk155;
    $36 = HEAP32[$35 >> 2] | 0;
    $cmp156 = ($36 | 0) == ($32 | 0);
    if ($cmp156) {
      label = 39;
      break;
    } else {
      label = 34;
      break;
    }
   case 34:
    $add_ptr_sum9 = $and + 8 | 0;
    $fd159 = $1 + $add_ptr_sum9 | 0;
    $37 = $fd159;
    $38 = HEAP32[$37 >> 2] | 0;
    $39 = $38;
    $cmp162 = $39 >>> 0 < $3 >>> 0;
    if ($cmp162) {
      label = 38;
      break;
    } else {
      label = 35;
      break;
    }
   case 35:
    $bk164 = $38 + 12 | 0;
    $40 = HEAP32[$bk164 >> 2] | 0;
    $cmp165 = ($40 | 0) == ($32 | 0);
    if ($cmp165) {
      label = 36;
      break;
    } else {
      label = 38;
      break;
    }
   case 36:
    $fd167 = $36 + 8 | 0;
    $41 = HEAP32[$fd167 >> 2] | 0;
    $cmp168 = ($41 | 0) == ($32 | 0);
    if ($cmp168) {
      label = 37;
      break;
    } else {
      label = 38;
      break;
    }
   case 37:
    HEAP32[$bk164 >> 2] = $36;
    HEAP32[$fd167 >> 2] = $38;
    $R_1 = $36;
    label = 47;
    break;
   case 38:
    _abort();
    return 0;
    return 0;
   case 39:
    $child_sum = $and + 20 | 0;
    $arrayidx179 = $1 + $child_sum | 0;
    $42 = $arrayidx179;
    $43 = HEAP32[$42 >> 2] | 0;
    $cmp180 = ($43 | 0) == 0;
    if ($cmp180) {
      label = 40;
      break;
    } else {
      $R_0 = $43;
      $RP_0 = $42;
      label = 41;
      break;
    }
   case 40:
    $add_ptr_sum3 = $and + 16 | 0;
    $child = $1 + $add_ptr_sum3 | 0;
    $arrayidx182 = $child;
    $44 = HEAP32[$arrayidx182 >> 2] | 0;
    $cmp183 = ($44 | 0) == 0;
    if ($cmp183) {
      $R_1 = 0;
      label = 47;
      break;
    } else {
      $R_0 = $44;
      $RP_0 = $arrayidx182;
      label = 41;
      break;
    }
   case 41:
    $arrayidx186 = $R_0 + 20 | 0;
    $45 = HEAP32[$arrayidx186 >> 2] | 0;
    $cmp187 = ($45 | 0) == 0;
    if ($cmp187) {
      label = 42;
      break;
    } else {
      $CP_0 = $arrayidx186;
      label = 43;
      break;
    }
   case 42:
    $arrayidx190 = $R_0 + 16 | 0;
    $46 = HEAP32[$arrayidx190 >> 2] | 0;
    $cmp191 = ($46 | 0) == 0;
    if ($cmp191) {
      label = 44;
      break;
    } else {
      $CP_0 = $arrayidx190;
      label = 43;
      break;
    }
   case 43:
    $47 = HEAP32[$CP_0 >> 2] | 0;
    $R_0 = $47;
    $RP_0 = $CP_0;
    label = 41;
    break;
   case 44:
    $48 = $RP_0;
    $49 = HEAP32[94] | 0;
    $cmp195 = $48 >>> 0 < $49 >>> 0;
    if ($cmp195) {
      label = 46;
      break;
    } else {
      label = 45;
      break;
    }
   case 45:
    HEAP32[$RP_0 >> 2] = 0;
    $R_1 = $R_0;
    label = 47;
    break;
   case 46:
    _abort();
    return 0;
    return 0;
   case 47:
    $cmp203 = ($34 | 0) == 0;
    if ($cmp203) {
      label = 67;
      break;
    } else {
      label = 48;
      break;
    }
   case 48:
    $add_ptr_sum7 = $and + 28 | 0;
    $index = $1 + $add_ptr_sum7 | 0;
    $50 = $index;
    $51 = HEAP32[$50 >> 2] | 0;
    $arrayidx206 = 664 + ($51 << 2) | 0;
    $52 = HEAP32[$arrayidx206 >> 2] | 0;
    $cmp207 = ($32 | 0) == ($52 | 0);
    if ($cmp207) {
      label = 49;
      break;
    } else {
      label = 51;
      break;
    }
   case 49:
    HEAP32[$arrayidx206 >> 2] = $R_1;
    $cond = ($R_1 | 0) == 0;
    if ($cond) {
      label = 50;
      break;
    } else {
      label = 57;
      break;
    }
   case 50:
    $53 = HEAP32[$50 >> 2] | 0;
    $shl214 = 1 << $53;
    $neg215 = $shl214 ^ -1;
    $54 = HEAP32[91] | 0;
    $and216 = $54 & $neg215;
    HEAP32[91] = $and216;
    label = 67;
    break;
   case 51:
    $55 = $34;
    $56 = HEAP32[94] | 0;
    $cmp220 = $55 >>> 0 < $56 >>> 0;
    if ($cmp220) {
      label = 55;
      break;
    } else {
      label = 52;
      break;
    }
   case 52:
    $arrayidx226 = $34 + 16 | 0;
    $57 = HEAP32[$arrayidx226 >> 2] | 0;
    $cmp227 = ($57 | 0) == ($32 | 0);
    if ($cmp227) {
      label = 53;
      break;
    } else {
      label = 54;
      break;
    }
   case 53:
    HEAP32[$arrayidx226 >> 2] = $R_1;
    label = 56;
    break;
   case 54:
    $arrayidx234 = $34 + 20 | 0;
    HEAP32[$arrayidx234 >> 2] = $R_1;
    label = 56;
    break;
   case 55:
    _abort();
    return 0;
    return 0;
   case 56:
    $cmp239 = ($R_1 | 0) == 0;
    if ($cmp239) {
      label = 67;
      break;
    } else {
      label = 57;
      break;
    }
   case 57:
    $58 = $R_1;
    $59 = HEAP32[94] | 0;
    $cmp243 = $58 >>> 0 < $59 >>> 0;
    if ($cmp243) {
      label = 66;
      break;
    } else {
      label = 58;
      break;
    }
   case 58:
    $parent248 = $R_1 + 24 | 0;
    HEAP32[$parent248 >> 2] = $34;
    $add_ptr_sum8 = $and + 16 | 0;
    $child249 = $1 + $add_ptr_sum8 | 0;
    $arrayidx250 = $child249;
    $60 = HEAP32[$arrayidx250 >> 2] | 0;
    $cmp251 = ($60 | 0) == 0;
    if ($cmp251) {
      label = 62;
      break;
    } else {
      label = 59;
      break;
    }
   case 59:
    $61 = $60;
    $62 = HEAP32[94] | 0;
    $cmp255 = $61 >>> 0 < $62 >>> 0;
    if ($cmp255) {
      label = 61;
      break;
    } else {
      label = 60;
      break;
    }
   case 60:
    $arrayidx261 = $R_1 + 16 | 0;
    HEAP32[$arrayidx261 >> 2] = $60;
    $parent262 = $60 + 24 | 0;
    HEAP32[$parent262 >> 2] = $R_1;
    label = 62;
    break;
   case 61:
    _abort();
    return 0;
    return 0;
   case 62:
    $child249_sum = $and + 20 | 0;
    $arrayidx267 = $1 + $child249_sum | 0;
    $63 = $arrayidx267;
    $64 = HEAP32[$63 >> 2] | 0;
    $cmp268 = ($64 | 0) == 0;
    if ($cmp268) {
      label = 67;
      break;
    } else {
      label = 63;
      break;
    }
   case 63:
    $65 = $64;
    $66 = HEAP32[94] | 0;
    $cmp272 = $65 >>> 0 < $66 >>> 0;
    if ($cmp272) {
      label = 65;
      break;
    } else {
      label = 64;
      break;
    }
   case 64:
    $arrayidx278 = $R_1 + 20 | 0;
    HEAP32[$arrayidx278 >> 2] = $64;
    $parent279 = $64 + 24 | 0;
    HEAP32[$parent279 >> 2] = $R_1;
    label = 67;
    break;
   case 65:
    _abort();
    return 0;
    return 0;
   case 66:
    _abort();
    return 0;
    return 0;
   case 67:
    $cmp288 = $sub110 >>> 0 < 16;
    if ($cmp288) {
      label = 68;
      break;
    } else {
      label = 69;
      break;
    }
   case 68:
    $67 = HEAP32[$head >> 2] | 0;
    $and294 = $67 & 1;
    $or295 = $add105 | $and294;
    $or296 = $or295 | 2;
    HEAP32[$head >> 2] = $or296;
    $add_ptr298_sum6 = $add105 | 4;
    $head299 = $1 + $add_ptr298_sum6 | 0;
    $68 = $head299;
    $69 = HEAP32[$68 >> 2] | 0;
    $or300 = $69 | 1;
    HEAP32[$68 >> 2] = $or300;
    $newp_0 = $p;
    label = 71;
    break;
   case 69:
    $add_ptr303 = $1 + $nb | 0;
    $70 = $add_ptr303;
    $71 = HEAP32[$head >> 2] | 0;
    $and305 = $71 & 1;
    $or306 = $and305 | $nb;
    $or307 = $or306 | 2;
    HEAP32[$head >> 2] = $or307;
    $add_ptr303_sum = $nb + 4 | 0;
    $head310 = $1 + $add_ptr303_sum | 0;
    $72 = $head310;
    $or315 = $sub110 | 3;
    HEAP32[$72 >> 2] = $or315;
    $add_ptr317_sum5 = $add105 | 4;
    $head318 = $1 + $add_ptr317_sum5 | 0;
    $73 = $head318;
    $74 = HEAP32[$73 >> 2] | 0;
    $or319 = $74 | 1;
    HEAP32[$73 >> 2] = $or319;
    _dispose_chunk($70, $sub110);
    $newp_0 = $p;
    label = 71;
    break;
   case 70:
    _abort();
    return 0;
    return 0;
   case 71:
    return $newp_0 | 0;
  }
  return 0;
}
function _init_mparams() {
  var $0 = 0, $cmp = 0, $call = 0, $sub = 0, $and = 0, $cmp1 = 0, $call6 = 0, $xor = 0, $and7 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = HEAP32[2] | 0;
    $cmp = ($0 | 0) == 0;
    if ($cmp) {
      label = 3;
      break;
    } else {
      label = 6;
      break;
    }
   case 3:
    $call = _sysconf(8) | 0;
    $sub = $call - 1 | 0;
    $and = $sub & $call;
    $cmp1 = ($and | 0) == 0;
    if ($cmp1) {
      label = 5;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    _abort();
   case 5:
    HEAP32[4] = $call;
    HEAP32[3] = $call;
    HEAP32[5] = -1;
    HEAP32[6] = 2097152;
    HEAP32[7] = 0;
    HEAP32[201] = 0;
    $call6 = _time(0) | 0;
    $xor = $call6 & -16;
    $and7 = $xor ^ 1431655768;
    HEAP32[2] = $and7;
    label = 6;
    break;
   case 6:
    return;
  }
}
function _mmap_resize($oldp, $nb) {
  $oldp = $oldp | 0;
  $nb = $nb | 0;
  var $head = 0, $0 = 0, $and = 0, $cmp = 0, $add = 0, $cmp1 = 0, $sub = 0, $1 = 0, $shl = 0, $cmp2 = 0, $retval_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $head = $oldp + 4 | 0;
    $0 = HEAP32[$head >> 2] | 0;
    $and = $0 & -8;
    $cmp = $nb >>> 0 < 256;
    if ($cmp) {
      $retval_0 = 0;
      label = 6;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $add = $nb + 4 | 0;
    $cmp1 = $and >>> 0 < $add >>> 0;
    if ($cmp1) {
      label = 5;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $sub = $and - $nb | 0;
    $1 = HEAP32[4] | 0;
    $shl = $1 << 1;
    $cmp2 = $sub >>> 0 > $shl >>> 0;
    if ($cmp2) {
      label = 5;
      break;
    } else {
      $retval_0 = $oldp;
      label = 6;
      break;
    }
   case 5:
    $retval_0 = 0;
    label = 6;
    break;
   case 6:
    return $retval_0 | 0;
  }
  return 0;
}
function _segment_holding($addr) {
  $addr = $addr | 0;
  var $sp_0 = 0, $base = 0, $0 = 0, $cmp = 0, $size = 0, $1 = 0, $add_ptr = 0, $cmp2 = 0, $next = 0, $2 = 0, $cmp3 = 0, $retval_0 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $sp_0 = 808;
    label = 3;
    break;
   case 3:
    $base = $sp_0 | 0;
    $0 = HEAP32[$base >> 2] | 0;
    $cmp = $0 >>> 0 > $addr >>> 0;
    if ($cmp) {
      label = 5;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $size = $sp_0 + 4 | 0;
    $1 = HEAP32[$size >> 2] | 0;
    $add_ptr = $0 + $1 | 0;
    $cmp2 = $add_ptr >>> 0 > $addr >>> 0;
    if ($cmp2) {
      $retval_0 = $sp_0;
      label = 6;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $next = $sp_0 + 8 | 0;
    $2 = HEAP32[$next >> 2] | 0;
    $cmp3 = ($2 | 0) == 0;
    if ($cmp3) {
      $retval_0 = 0;
      label = 6;
      break;
    } else {
      $sp_0 = $2;
      label = 3;
      break;
    }
   case 6:
    return $retval_0 | 0;
  }
  return 0;
}
function _dispose_chunk($p, $psize) {
  $p = $p | 0;
  $psize = $psize | 0;
  var $0 = 0, $add_ptr = 0, $1 = 0, $head = 0, $2 = 0, $and = 0, $tobool = 0, $prev_foot = 0, $3 = 0, $and2 = 0, $cmp = 0, $idx_neg = 0, $add_ptr5 = 0, $4 = 0, $add6 = 0, $5 = 0, $cmp7 = 0, $6 = 0, $cmp10 = 0, $shr = 0, $cmp13 = 0, $add_ptr5_sum29 = 0, $fd = 0, $7 = 0, $8 = 0, $add_ptr5_sum30 = 0, $bk = 0, $9 = 0, $10 = 0, $shl = 0, $arrayidx = 0, $11 = 0, $cmp17 = 0, $12 = 0, $cmp20 = 0, $bk22 = 0, $13 = 0, $cmp23 = 0, $cmp28 = 0, $shl31 = 0, $neg = 0, $14 = 0, $and32 = 0, $cmp36 = 0, $15 = 0, $16 = 0, $cmp40 = 0, $fd43 = 0, $17 = 0, $cmp44 = 0, $bk52 = 0, $fd53 = 0, $18 = 0, $add_ptr5_sum22 = 0, $parent = 0, $19 = 0, $20 = 0, $add_ptr5_sum23 = 0, $bk60 = 0, $21 = 0, $22 = 0, $cmp61 = 0, $add_ptr5_sum27 = 0, $fd65 = 0, $23 = 0, $24 = 0, $25 = 0, $cmp68 = 0, $bk70 = 0, $26 = 0, $cmp71 = 0, $fd74 = 0, $27 = 0, $cmp75 = 0, $add_ptr5_sum24 = 0, $child_sum = 0, $arrayidx86 = 0, $28 = 0, $29 = 0, $cmp87 = 0, $child = 0, $arrayidx90 = 0, $30 = 0, $cmp91 = 0, $RP_0 = 0, $R_0 = 0, $arrayidx95 = 0, $31 = 0, $cmp96 = 0, $arrayidx100 = 0, $32 = 0, $cmp101 = 0, $CP_0 = 0, $33 = 0, $34 = 0, $35 = 0, $cmp106 = 0, $R_1 = 0, $cmp115 = 0, $add_ptr5_sum25 = 0, $index = 0, $36 = 0, $37 = 0, $arrayidx118 = 0, $38 = 0, $cmp119 = 0, $cond36 = 0, $39 = 0, $shl126 = 0, $neg127 = 0, $40 = 0, $and128 = 0, $41 = 0, $42 = 0, $cmp132 = 0, $arrayidx138 = 0, $43 = 0, $cmp139 = 0, $arrayidx146 = 0, $cmp151 = 0, $44 = 0, $45 = 0, $cmp155 = 0, $parent160 = 0, $add_ptr5_sum26 = 0, $child161 = 0, $arrayidx162 = 0, $46 = 0, $cmp163 = 0, $47 = 0, $48 = 0, $cmp167 = 0, $arrayidx173 = 0, $parent174 = 0, $child161_sum = 0, $arrayidx179 = 0, $49 = 0, $50 = 0, $cmp180 = 0, $51 = 0, $52 = 0, $cmp184 = 0, $arrayidx190 = 0, $parent191 = 0, $add_ptr_sum = 0, $head201 = 0, $53 = 0, $54 = 0, $and202 = 0, $cmp203 = 0, $55 = 0, $and207 = 0, $or = 0, $add_ptr5_sum = 0, $head208 = 0, $56 = 0, $prev_foot210 = 0, $psize_addr_0 = 0, $p_addr_0 = 0, $57 = 0, $cmp217 = 0, $add_ptr_sum1 = 0, $head222 = 0, $58 = 0, $59 = 0, $and223 = 0, $tobool224 = 0, $60 = 0, $cmp226 = 0, $61 = 0, $add229 = 0, $or231 = 0, $head232 = 0, $62 = 0, $cmp234 = 0, $63 = 0, $cmp242 = 0, $64 = 0, $add246 = 0, $or248 = 0, $head249 = 0, $65 = 0, $add_ptr250 = 0, $prev_foot251 = 0, $and254 = 0, $add255 = 0, $shr256 = 0, $cmp257 = 0, $add_ptr_sum17 = 0, $fd261 = 0, $66 = 0, $67 = 0, $add_ptr_sum18 = 0, $bk263 = 0, $68 = 0, $69 = 0, $shl266 = 0, $arrayidx268 = 0, $70 = 0, $cmp269 = 0, $71 = 0, $cmp273 = 0, $bk276 = 0, $72 = 0, $cmp277 = 0, $cmp286 = 0, $shl289 = 0, $neg290 = 0, $73 = 0, $and292 = 0, $cmp297 = 0, $74 = 0, $75 = 0, $cmp301 = 0, $fd304 = 0, $76 = 0, $cmp305 = 0, $bk314 = 0, $fd315 = 0, $77 = 0, $add_ptr_sum2 = 0, $parent324 = 0, $78 = 0, $79 = 0, $add_ptr_sum3 = 0, $bk326 = 0, $80 = 0, $81 = 0, $cmp327 = 0, $add_ptr_sum15 = 0, $fd331 = 0, $82 = 0, $83 = 0, $84 = 0, $cmp334 = 0, $bk337 = 0, $85 = 0, $cmp338 = 0, $fd341 = 0, $86 = 0, $cmp342 = 0, $child355_sum = 0, $arrayidx356 = 0, $87 = 0, $88 = 0, $cmp357 = 0, $add_ptr_sum4 = 0, $child355 = 0, $arrayidx361 = 0, $89 = 0, $cmp362 = 0, $RP354_0 = 0, $R325_0 = 0, $arrayidx368 = 0, $90 = 0, $cmp369 = 0, $arrayidx373 = 0, $91 = 0, $cmp374 = 0, $CP365_0 = 0, $92 = 0, $93 = 0, $94 = 0, $cmp381 = 0, $R325_1 = 0, $cmp390 = 0, $add_ptr_sum13 = 0, $index394 = 0, $95 = 0, $96 = 0, $arrayidx396 = 0, $97 = 0, $cmp397 = 0, $cond37 = 0, $98 = 0, $shl404 = 0, $neg405 = 0, $99 = 0, $and407 = 0, $100 = 0, $101 = 0, $cmp411 = 0, $arrayidx417 = 0, $102 = 0, $cmp418 = 0, $arrayidx425 = 0, $cmp430 = 0, $103 = 0, $104 = 0, $cmp434 = 0, $parent441 = 0, $add_ptr_sum14 = 0, $child442 = 0, $arrayidx443 = 0, $105 = 0, $cmp444 = 0, $106 = 0, $107 = 0, $cmp448 = 0, $arrayidx454 = 0, $parent455 = 0, $child442_sum = 0, $arrayidx460 = 0, $108 = 0, $109 = 0, $cmp461 = 0, $110 = 0, $111 = 0, $cmp465 = 0, $arrayidx471 = 0, $parent472 = 0, $or481 = 0, $head482 = 0, $112 = 0, $add_ptr483 = 0, $prev_foot484 = 0, $113 = 0, $cmp486 = 0, $and495 = 0, $or496 = 0, $head497 = 0, $114 = 0, $add_ptr498 = 0, $prev_foot499 = 0, $psize_addr_1 = 0, $shr501 = 0, $cmp502 = 0, $shl508 = 0, $arrayidx510 = 0, $115 = 0, $116 = 0, $shl513 = 0, $and514 = 0, $tobool515 = 0, $or519 = 0, $arrayidx510_sum12 = 0, $117 = 0, $118 = 0, $119 = 0, $120 = 0, $cmp523 = 0, $F511_0 = 0, $arrayidx510_sum = 0, $121 = 0, $bk533 = 0, $fd534 = 0, $bk535 = 0, $122 = 0, $shr540 = 0, $cmp541 = 0, $cmp545 = 0, $sub = 0, $shr549 = 0, $and550 = 0, $shl551 = 0, $sub552 = 0, $shr553 = 0, $and554 = 0, $add555 = 0, $shl556 = 0, $sub557 = 0, $shr558 = 0, $and559 = 0, $add560 = 0, $sub561 = 0, $shl562 = 0, $shr563 = 0, $add564 = 0, $shl565 = 0, $add566 = 0, $shr567 = 0, $and568 = 0, $add569 = 0, $I539_0 = 0, $arrayidx573 = 0, $index574 = 0, $I539_0_c = 0, $arrayidx576 = 0, $123 = 0, $124 = 0, $shl580 = 0, $and581 = 0, $tobool582 = 0, $or586 = 0, $parent587 = 0, $_c = 0, $bk588 = 0, $fd589 = 0, $125 = 0, $cmp592 = 0, $shr594 = 0, $sub597 = 0, $cond = 0, $shl598 = 0, $T_0 = 0, $K591_0 = 0, $head599 = 0, $126 = 0, $and600 = 0, $cmp601 = 0, $shr604 = 0, $arrayidx607 = 0, $127 = 0, $cmp609 = 0, $shl608 = 0, $128 = 0, $129 = 0, $cmp614 = 0, $parent619 = 0, $T_0_c9 = 0, $bk620 = 0, $fd621 = 0, $fd626 = 0, $130 = 0, $131 = 0, $132 = 0, $cmp628 = 0, $133 = 0, $cmp632 = 0, $bk639 = 0, $fd641 = 0, $_c8 = 0, $bk642 = 0, $T_0_c = 0, $parent643 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = $p;
    $add_ptr = $0 + $psize | 0;
    $1 = $add_ptr;
    $head = $p + 4 | 0;
    $2 = HEAP32[$head >> 2] | 0;
    $and = $2 & 1;
    $tobool = ($and | 0) == 0;
    if ($tobool) {
      label = 3;
      break;
    } else {
      $p_addr_0 = $p;
      $psize_addr_0 = $psize;
      label = 55;
      break;
    }
   case 3:
    $prev_foot = $p | 0;
    $3 = HEAP32[$prev_foot >> 2] | 0;
    $and2 = $2 & 3;
    $cmp = ($and2 | 0) == 0;
    if ($cmp) {
      label = 135;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    $idx_neg = -$3 | 0;
    $add_ptr5 = $0 + $idx_neg | 0;
    $4 = $add_ptr5;
    $add6 = $3 + $psize | 0;
    $5 = HEAP32[94] | 0;
    $cmp7 = $add_ptr5 >>> 0 < $5 >>> 0;
    if ($cmp7) {
      label = 54;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $6 = HEAP32[95] | 0;
    $cmp10 = ($4 | 0) == ($6 | 0);
    if ($cmp10) {
      label = 52;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $shr = $3 >>> 3;
    $cmp13 = $3 >>> 0 < 256;
    if ($cmp13) {
      label = 7;
      break;
    } else {
      label = 18;
      break;
    }
   case 7:
    $add_ptr5_sum29 = 8 - $3 | 0;
    $fd = $0 + $add_ptr5_sum29 | 0;
    $7 = $fd;
    $8 = HEAP32[$7 >> 2] | 0;
    $add_ptr5_sum30 = 12 - $3 | 0;
    $bk = $0 + $add_ptr5_sum30 | 0;
    $9 = $bk;
    $10 = HEAP32[$9 >> 2] | 0;
    $shl = $shr << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $11 = $arrayidx;
    $cmp17 = ($8 | 0) == ($11 | 0);
    if ($cmp17) {
      label = 10;
      break;
    } else {
      label = 8;
      break;
    }
   case 8:
    $12 = $8;
    $cmp20 = $12 >>> 0 < $5 >>> 0;
    if ($cmp20) {
      label = 17;
      break;
    } else {
      label = 9;
      break;
    }
   case 9:
    $bk22 = $8 + 12 | 0;
    $13 = HEAP32[$bk22 >> 2] | 0;
    $cmp23 = ($13 | 0) == ($4 | 0);
    if ($cmp23) {
      label = 10;
      break;
    } else {
      label = 17;
      break;
    }
   case 10:
    $cmp28 = ($10 | 0) == ($8 | 0);
    if ($cmp28) {
      label = 11;
      break;
    } else {
      label = 12;
      break;
    }
   case 11:
    $shl31 = 1 << $shr;
    $neg = $shl31 ^ -1;
    $14 = HEAP32[90] | 0;
    $and32 = $14 & $neg;
    HEAP32[90] = $and32;
    $p_addr_0 = $4;
    $psize_addr_0 = $add6;
    label = 55;
    break;
   case 12:
    $cmp36 = ($10 | 0) == ($11 | 0);
    if ($cmp36) {
      label = 15;
      break;
    } else {
      label = 13;
      break;
    }
   case 13:
    $15 = $10;
    $16 = HEAP32[94] | 0;
    $cmp40 = $15 >>> 0 < $16 >>> 0;
    if ($cmp40) {
      label = 16;
      break;
    } else {
      label = 14;
      break;
    }
   case 14:
    $fd43 = $10 + 8 | 0;
    $17 = HEAP32[$fd43 >> 2] | 0;
    $cmp44 = ($17 | 0) == ($4 | 0);
    if ($cmp44) {
      label = 15;
      break;
    } else {
      label = 16;
      break;
    }
   case 15:
    $bk52 = $8 + 12 | 0;
    HEAP32[$bk52 >> 2] = $10;
    $fd53 = $10 + 8 | 0;
    HEAP32[$fd53 >> 2] = $8;
    $p_addr_0 = $4;
    $psize_addr_0 = $add6;
    label = 55;
    break;
   case 16:
    _abort();
   case 17:
    _abort();
   case 18:
    $18 = $add_ptr5;
    $add_ptr5_sum22 = 24 - $3 | 0;
    $parent = $0 + $add_ptr5_sum22 | 0;
    $19 = $parent;
    $20 = HEAP32[$19 >> 2] | 0;
    $add_ptr5_sum23 = 12 - $3 | 0;
    $bk60 = $0 + $add_ptr5_sum23 | 0;
    $21 = $bk60;
    $22 = HEAP32[$21 >> 2] | 0;
    $cmp61 = ($22 | 0) == ($18 | 0);
    if ($cmp61) {
      label = 24;
      break;
    } else {
      label = 19;
      break;
    }
   case 19:
    $add_ptr5_sum27 = 8 - $3 | 0;
    $fd65 = $0 + $add_ptr5_sum27 | 0;
    $23 = $fd65;
    $24 = HEAP32[$23 >> 2] | 0;
    $25 = $24;
    $cmp68 = $25 >>> 0 < $5 >>> 0;
    if ($cmp68) {
      label = 23;
      break;
    } else {
      label = 20;
      break;
    }
   case 20:
    $bk70 = $24 + 12 | 0;
    $26 = HEAP32[$bk70 >> 2] | 0;
    $cmp71 = ($26 | 0) == ($18 | 0);
    if ($cmp71) {
      label = 21;
      break;
    } else {
      label = 23;
      break;
    }
   case 21:
    $fd74 = $22 + 8 | 0;
    $27 = HEAP32[$fd74 >> 2] | 0;
    $cmp75 = ($27 | 0) == ($18 | 0);
    if ($cmp75) {
      label = 22;
      break;
    } else {
      label = 23;
      break;
    }
   case 22:
    HEAP32[$bk70 >> 2] = $22;
    HEAP32[$fd74 >> 2] = $24;
    $R_1 = $22;
    label = 32;
    break;
   case 23:
    _abort();
   case 24:
    $add_ptr5_sum24 = 16 - $3 | 0;
    $child_sum = $add_ptr5_sum24 + 4 | 0;
    $arrayidx86 = $0 + $child_sum | 0;
    $28 = $arrayidx86;
    $29 = HEAP32[$28 >> 2] | 0;
    $cmp87 = ($29 | 0) == 0;
    if ($cmp87) {
      label = 25;
      break;
    } else {
      $R_0 = $29;
      $RP_0 = $28;
      label = 26;
      break;
    }
   case 25:
    $child = $0 + $add_ptr5_sum24 | 0;
    $arrayidx90 = $child;
    $30 = HEAP32[$arrayidx90 >> 2] | 0;
    $cmp91 = ($30 | 0) == 0;
    if ($cmp91) {
      $R_1 = 0;
      label = 32;
      break;
    } else {
      $R_0 = $30;
      $RP_0 = $arrayidx90;
      label = 26;
      break;
    }
   case 26:
    $arrayidx95 = $R_0 + 20 | 0;
    $31 = HEAP32[$arrayidx95 >> 2] | 0;
    $cmp96 = ($31 | 0) == 0;
    if ($cmp96) {
      label = 27;
      break;
    } else {
      $CP_0 = $arrayidx95;
      label = 28;
      break;
    }
   case 27:
    $arrayidx100 = $R_0 + 16 | 0;
    $32 = HEAP32[$arrayidx100 >> 2] | 0;
    $cmp101 = ($32 | 0) == 0;
    if ($cmp101) {
      label = 29;
      break;
    } else {
      $CP_0 = $arrayidx100;
      label = 28;
      break;
    }
   case 28:
    $33 = HEAP32[$CP_0 >> 2] | 0;
    $R_0 = $33;
    $RP_0 = $CP_0;
    label = 26;
    break;
   case 29:
    $34 = $RP_0;
    $35 = HEAP32[94] | 0;
    $cmp106 = $34 >>> 0 < $35 >>> 0;
    if ($cmp106) {
      label = 31;
      break;
    } else {
      label = 30;
      break;
    }
   case 30:
    HEAP32[$RP_0 >> 2] = 0;
    $R_1 = $R_0;
    label = 32;
    break;
   case 31:
    _abort();
   case 32:
    $cmp115 = ($20 | 0) == 0;
    if ($cmp115) {
      $p_addr_0 = $4;
      $psize_addr_0 = $add6;
      label = 55;
      break;
    } else {
      label = 33;
      break;
    }
   case 33:
    $add_ptr5_sum25 = 28 - $3 | 0;
    $index = $0 + $add_ptr5_sum25 | 0;
    $36 = $index;
    $37 = HEAP32[$36 >> 2] | 0;
    $arrayidx118 = 664 + ($37 << 2) | 0;
    $38 = HEAP32[$arrayidx118 >> 2] | 0;
    $cmp119 = ($18 | 0) == ($38 | 0);
    if ($cmp119) {
      label = 34;
      break;
    } else {
      label = 36;
      break;
    }
   case 34:
    HEAP32[$arrayidx118 >> 2] = $R_1;
    $cond36 = ($R_1 | 0) == 0;
    if ($cond36) {
      label = 35;
      break;
    } else {
      label = 42;
      break;
    }
   case 35:
    $39 = HEAP32[$36 >> 2] | 0;
    $shl126 = 1 << $39;
    $neg127 = $shl126 ^ -1;
    $40 = HEAP32[91] | 0;
    $and128 = $40 & $neg127;
    HEAP32[91] = $and128;
    $p_addr_0 = $4;
    $psize_addr_0 = $add6;
    label = 55;
    break;
   case 36:
    $41 = $20;
    $42 = HEAP32[94] | 0;
    $cmp132 = $41 >>> 0 < $42 >>> 0;
    if ($cmp132) {
      label = 40;
      break;
    } else {
      label = 37;
      break;
    }
   case 37:
    $arrayidx138 = $20 + 16 | 0;
    $43 = HEAP32[$arrayidx138 >> 2] | 0;
    $cmp139 = ($43 | 0) == ($18 | 0);
    if ($cmp139) {
      label = 38;
      break;
    } else {
      label = 39;
      break;
    }
   case 38:
    HEAP32[$arrayidx138 >> 2] = $R_1;
    label = 41;
    break;
   case 39:
    $arrayidx146 = $20 + 20 | 0;
    HEAP32[$arrayidx146 >> 2] = $R_1;
    label = 41;
    break;
   case 40:
    _abort();
   case 41:
    $cmp151 = ($R_1 | 0) == 0;
    if ($cmp151) {
      $p_addr_0 = $4;
      $psize_addr_0 = $add6;
      label = 55;
      break;
    } else {
      label = 42;
      break;
    }
   case 42:
    $44 = $R_1;
    $45 = HEAP32[94] | 0;
    $cmp155 = $44 >>> 0 < $45 >>> 0;
    if ($cmp155) {
      label = 51;
      break;
    } else {
      label = 43;
      break;
    }
   case 43:
    $parent160 = $R_1 + 24 | 0;
    HEAP32[$parent160 >> 2] = $20;
    $add_ptr5_sum26 = 16 - $3 | 0;
    $child161 = $0 + $add_ptr5_sum26 | 0;
    $arrayidx162 = $child161;
    $46 = HEAP32[$arrayidx162 >> 2] | 0;
    $cmp163 = ($46 | 0) == 0;
    if ($cmp163) {
      label = 47;
      break;
    } else {
      label = 44;
      break;
    }
   case 44:
    $47 = $46;
    $48 = HEAP32[94] | 0;
    $cmp167 = $47 >>> 0 < $48 >>> 0;
    if ($cmp167) {
      label = 46;
      break;
    } else {
      label = 45;
      break;
    }
   case 45:
    $arrayidx173 = $R_1 + 16 | 0;
    HEAP32[$arrayidx173 >> 2] = $46;
    $parent174 = $46 + 24 | 0;
    HEAP32[$parent174 >> 2] = $R_1;
    label = 47;
    break;
   case 46:
    _abort();
   case 47:
    $child161_sum = $add_ptr5_sum26 + 4 | 0;
    $arrayidx179 = $0 + $child161_sum | 0;
    $49 = $arrayidx179;
    $50 = HEAP32[$49 >> 2] | 0;
    $cmp180 = ($50 | 0) == 0;
    if ($cmp180) {
      $p_addr_0 = $4;
      $psize_addr_0 = $add6;
      label = 55;
      break;
    } else {
      label = 48;
      break;
    }
   case 48:
    $51 = $50;
    $52 = HEAP32[94] | 0;
    $cmp184 = $51 >>> 0 < $52 >>> 0;
    if ($cmp184) {
      label = 50;
      break;
    } else {
      label = 49;
      break;
    }
   case 49:
    $arrayidx190 = $R_1 + 20 | 0;
    HEAP32[$arrayidx190 >> 2] = $50;
    $parent191 = $50 + 24 | 0;
    HEAP32[$parent191 >> 2] = $R_1;
    $p_addr_0 = $4;
    $psize_addr_0 = $add6;
    label = 55;
    break;
   case 50:
    _abort();
   case 51:
    _abort();
   case 52:
    $add_ptr_sum = $psize + 4 | 0;
    $head201 = $0 + $add_ptr_sum | 0;
    $53 = $head201;
    $54 = HEAP32[$53 >> 2] | 0;
    $and202 = $54 & 3;
    $cmp203 = ($and202 | 0) == 3;
    if ($cmp203) {
      label = 53;
      break;
    } else {
      $p_addr_0 = $4;
      $psize_addr_0 = $add6;
      label = 55;
      break;
    }
   case 53:
    HEAP32[92] = $add6;
    $55 = HEAP32[$53 >> 2] | 0;
    $and207 = $55 & -2;
    HEAP32[$53 >> 2] = $and207;
    $or = $add6 | 1;
    $add_ptr5_sum = 4 - $3 | 0;
    $head208 = $0 + $add_ptr5_sum | 0;
    $56 = $head208;
    HEAP32[$56 >> 2] = $or;
    $prev_foot210 = $add_ptr;
    HEAP32[$prev_foot210 >> 2] = $add6;
    label = 135;
    break;
   case 54:
    _abort();
   case 55:
    $57 = HEAP32[94] | 0;
    $cmp217 = $add_ptr >>> 0 < $57 >>> 0;
    if ($cmp217) {
      label = 134;
      break;
    } else {
      label = 56;
      break;
    }
   case 56:
    $add_ptr_sum1 = $psize + 4 | 0;
    $head222 = $0 + $add_ptr_sum1 | 0;
    $58 = $head222;
    $59 = HEAP32[$58 >> 2] | 0;
    $and223 = $59 & 2;
    $tobool224 = ($and223 | 0) == 0;
    if ($tobool224) {
      label = 57;
      break;
    } else {
      label = 110;
      break;
    }
   case 57:
    $60 = HEAP32[96] | 0;
    $cmp226 = ($1 | 0) == ($60 | 0);
    if ($cmp226) {
      label = 58;
      break;
    } else {
      label = 60;
      break;
    }
   case 58:
    $61 = HEAP32[93] | 0;
    $add229 = $61 + $psize_addr_0 | 0;
    HEAP32[93] = $add229;
    HEAP32[96] = $p_addr_0;
    $or231 = $add229 | 1;
    $head232 = $p_addr_0 + 4 | 0;
    HEAP32[$head232 >> 2] = $or231;
    $62 = HEAP32[95] | 0;
    $cmp234 = ($p_addr_0 | 0) == ($62 | 0);
    if ($cmp234) {
      label = 59;
      break;
    } else {
      label = 135;
      break;
    }
   case 59:
    HEAP32[95] = 0;
    HEAP32[92] = 0;
    label = 135;
    break;
   case 60:
    $63 = HEAP32[95] | 0;
    $cmp242 = ($1 | 0) == ($63 | 0);
    if ($cmp242) {
      label = 61;
      break;
    } else {
      label = 62;
      break;
    }
   case 61:
    $64 = HEAP32[92] | 0;
    $add246 = $64 + $psize_addr_0 | 0;
    HEAP32[92] = $add246;
    HEAP32[95] = $p_addr_0;
    $or248 = $add246 | 1;
    $head249 = $p_addr_0 + 4 | 0;
    HEAP32[$head249 >> 2] = $or248;
    $65 = $p_addr_0;
    $add_ptr250 = $65 + $add246 | 0;
    $prev_foot251 = $add_ptr250;
    HEAP32[$prev_foot251 >> 2] = $add246;
    label = 135;
    break;
   case 62:
    $and254 = $59 & -8;
    $add255 = $and254 + $psize_addr_0 | 0;
    $shr256 = $59 >>> 3;
    $cmp257 = $59 >>> 0 < 256;
    if ($cmp257) {
      label = 63;
      break;
    } else {
      label = 74;
      break;
    }
   case 63:
    $add_ptr_sum17 = $psize + 8 | 0;
    $fd261 = $0 + $add_ptr_sum17 | 0;
    $66 = $fd261;
    $67 = HEAP32[$66 >> 2] | 0;
    $add_ptr_sum18 = $psize + 12 | 0;
    $bk263 = $0 + $add_ptr_sum18 | 0;
    $68 = $bk263;
    $69 = HEAP32[$68 >> 2] | 0;
    $shl266 = $shr256 << 1;
    $arrayidx268 = 400 + ($shl266 << 2) | 0;
    $70 = $arrayidx268;
    $cmp269 = ($67 | 0) == ($70 | 0);
    if ($cmp269) {
      label = 66;
      break;
    } else {
      label = 64;
      break;
    }
   case 64:
    $71 = $67;
    $cmp273 = $71 >>> 0 < $57 >>> 0;
    if ($cmp273) {
      label = 73;
      break;
    } else {
      label = 65;
      break;
    }
   case 65:
    $bk276 = $67 + 12 | 0;
    $72 = HEAP32[$bk276 >> 2] | 0;
    $cmp277 = ($72 | 0) == ($1 | 0);
    if ($cmp277) {
      label = 66;
      break;
    } else {
      label = 73;
      break;
    }
   case 66:
    $cmp286 = ($69 | 0) == ($67 | 0);
    if ($cmp286) {
      label = 67;
      break;
    } else {
      label = 68;
      break;
    }
   case 67:
    $shl289 = 1 << $shr256;
    $neg290 = $shl289 ^ -1;
    $73 = HEAP32[90] | 0;
    $and292 = $73 & $neg290;
    HEAP32[90] = $and292;
    label = 108;
    break;
   case 68:
    $cmp297 = ($69 | 0) == ($70 | 0);
    if ($cmp297) {
      label = 71;
      break;
    } else {
      label = 69;
      break;
    }
   case 69:
    $74 = $69;
    $75 = HEAP32[94] | 0;
    $cmp301 = $74 >>> 0 < $75 >>> 0;
    if ($cmp301) {
      label = 72;
      break;
    } else {
      label = 70;
      break;
    }
   case 70:
    $fd304 = $69 + 8 | 0;
    $76 = HEAP32[$fd304 >> 2] | 0;
    $cmp305 = ($76 | 0) == ($1 | 0);
    if ($cmp305) {
      label = 71;
      break;
    } else {
      label = 72;
      break;
    }
   case 71:
    $bk314 = $67 + 12 | 0;
    HEAP32[$bk314 >> 2] = $69;
    $fd315 = $69 + 8 | 0;
    HEAP32[$fd315 >> 2] = $67;
    label = 108;
    break;
   case 72:
    _abort();
   case 73:
    _abort();
   case 74:
    $77 = $add_ptr;
    $add_ptr_sum2 = $psize + 24 | 0;
    $parent324 = $0 + $add_ptr_sum2 | 0;
    $78 = $parent324;
    $79 = HEAP32[$78 >> 2] | 0;
    $add_ptr_sum3 = $psize + 12 | 0;
    $bk326 = $0 + $add_ptr_sum3 | 0;
    $80 = $bk326;
    $81 = HEAP32[$80 >> 2] | 0;
    $cmp327 = ($81 | 0) == ($77 | 0);
    if ($cmp327) {
      label = 80;
      break;
    } else {
      label = 75;
      break;
    }
   case 75:
    $add_ptr_sum15 = $psize + 8 | 0;
    $fd331 = $0 + $add_ptr_sum15 | 0;
    $82 = $fd331;
    $83 = HEAP32[$82 >> 2] | 0;
    $84 = $83;
    $cmp334 = $84 >>> 0 < $57 >>> 0;
    if ($cmp334) {
      label = 79;
      break;
    } else {
      label = 76;
      break;
    }
   case 76:
    $bk337 = $83 + 12 | 0;
    $85 = HEAP32[$bk337 >> 2] | 0;
    $cmp338 = ($85 | 0) == ($77 | 0);
    if ($cmp338) {
      label = 77;
      break;
    } else {
      label = 79;
      break;
    }
   case 77:
    $fd341 = $81 + 8 | 0;
    $86 = HEAP32[$fd341 >> 2] | 0;
    $cmp342 = ($86 | 0) == ($77 | 0);
    if ($cmp342) {
      label = 78;
      break;
    } else {
      label = 79;
      break;
    }
   case 78:
    HEAP32[$bk337 >> 2] = $81;
    HEAP32[$fd341 >> 2] = $83;
    $R325_1 = $81;
    label = 88;
    break;
   case 79:
    _abort();
   case 80:
    $child355_sum = $psize + 20 | 0;
    $arrayidx356 = $0 + $child355_sum | 0;
    $87 = $arrayidx356;
    $88 = HEAP32[$87 >> 2] | 0;
    $cmp357 = ($88 | 0) == 0;
    if ($cmp357) {
      label = 81;
      break;
    } else {
      $R325_0 = $88;
      $RP354_0 = $87;
      label = 82;
      break;
    }
   case 81:
    $add_ptr_sum4 = $psize + 16 | 0;
    $child355 = $0 + $add_ptr_sum4 | 0;
    $arrayidx361 = $child355;
    $89 = HEAP32[$arrayidx361 >> 2] | 0;
    $cmp362 = ($89 | 0) == 0;
    if ($cmp362) {
      $R325_1 = 0;
      label = 88;
      break;
    } else {
      $R325_0 = $89;
      $RP354_0 = $arrayidx361;
      label = 82;
      break;
    }
   case 82:
    $arrayidx368 = $R325_0 + 20 | 0;
    $90 = HEAP32[$arrayidx368 >> 2] | 0;
    $cmp369 = ($90 | 0) == 0;
    if ($cmp369) {
      label = 83;
      break;
    } else {
      $CP365_0 = $arrayidx368;
      label = 84;
      break;
    }
   case 83:
    $arrayidx373 = $R325_0 + 16 | 0;
    $91 = HEAP32[$arrayidx373 >> 2] | 0;
    $cmp374 = ($91 | 0) == 0;
    if ($cmp374) {
      label = 85;
      break;
    } else {
      $CP365_0 = $arrayidx373;
      label = 84;
      break;
    }
   case 84:
    $92 = HEAP32[$CP365_0 >> 2] | 0;
    $R325_0 = $92;
    $RP354_0 = $CP365_0;
    label = 82;
    break;
   case 85:
    $93 = $RP354_0;
    $94 = HEAP32[94] | 0;
    $cmp381 = $93 >>> 0 < $94 >>> 0;
    if ($cmp381) {
      label = 87;
      break;
    } else {
      label = 86;
      break;
    }
   case 86:
    HEAP32[$RP354_0 >> 2] = 0;
    $R325_1 = $R325_0;
    label = 88;
    break;
   case 87:
    _abort();
   case 88:
    $cmp390 = ($79 | 0) == 0;
    if ($cmp390) {
      label = 108;
      break;
    } else {
      label = 89;
      break;
    }
   case 89:
    $add_ptr_sum13 = $psize + 28 | 0;
    $index394 = $0 + $add_ptr_sum13 | 0;
    $95 = $index394;
    $96 = HEAP32[$95 >> 2] | 0;
    $arrayidx396 = 664 + ($96 << 2) | 0;
    $97 = HEAP32[$arrayidx396 >> 2] | 0;
    $cmp397 = ($77 | 0) == ($97 | 0);
    if ($cmp397) {
      label = 90;
      break;
    } else {
      label = 92;
      break;
    }
   case 90:
    HEAP32[$arrayidx396 >> 2] = $R325_1;
    $cond37 = ($R325_1 | 0) == 0;
    if ($cond37) {
      label = 91;
      break;
    } else {
      label = 98;
      break;
    }
   case 91:
    $98 = HEAP32[$95 >> 2] | 0;
    $shl404 = 1 << $98;
    $neg405 = $shl404 ^ -1;
    $99 = HEAP32[91] | 0;
    $and407 = $99 & $neg405;
    HEAP32[91] = $and407;
    label = 108;
    break;
   case 92:
    $100 = $79;
    $101 = HEAP32[94] | 0;
    $cmp411 = $100 >>> 0 < $101 >>> 0;
    if ($cmp411) {
      label = 96;
      break;
    } else {
      label = 93;
      break;
    }
   case 93:
    $arrayidx417 = $79 + 16 | 0;
    $102 = HEAP32[$arrayidx417 >> 2] | 0;
    $cmp418 = ($102 | 0) == ($77 | 0);
    if ($cmp418) {
      label = 94;
      break;
    } else {
      label = 95;
      break;
    }
   case 94:
    HEAP32[$arrayidx417 >> 2] = $R325_1;
    label = 97;
    break;
   case 95:
    $arrayidx425 = $79 + 20 | 0;
    HEAP32[$arrayidx425 >> 2] = $R325_1;
    label = 97;
    break;
   case 96:
    _abort();
   case 97:
    $cmp430 = ($R325_1 | 0) == 0;
    if ($cmp430) {
      label = 108;
      break;
    } else {
      label = 98;
      break;
    }
   case 98:
    $103 = $R325_1;
    $104 = HEAP32[94] | 0;
    $cmp434 = $103 >>> 0 < $104 >>> 0;
    if ($cmp434) {
      label = 107;
      break;
    } else {
      label = 99;
      break;
    }
   case 99:
    $parent441 = $R325_1 + 24 | 0;
    HEAP32[$parent441 >> 2] = $79;
    $add_ptr_sum14 = $psize + 16 | 0;
    $child442 = $0 + $add_ptr_sum14 | 0;
    $arrayidx443 = $child442;
    $105 = HEAP32[$arrayidx443 >> 2] | 0;
    $cmp444 = ($105 | 0) == 0;
    if ($cmp444) {
      label = 103;
      break;
    } else {
      label = 100;
      break;
    }
   case 100:
    $106 = $105;
    $107 = HEAP32[94] | 0;
    $cmp448 = $106 >>> 0 < $107 >>> 0;
    if ($cmp448) {
      label = 102;
      break;
    } else {
      label = 101;
      break;
    }
   case 101:
    $arrayidx454 = $R325_1 + 16 | 0;
    HEAP32[$arrayidx454 >> 2] = $105;
    $parent455 = $105 + 24 | 0;
    HEAP32[$parent455 >> 2] = $R325_1;
    label = 103;
    break;
   case 102:
    _abort();
   case 103:
    $child442_sum = $psize + 20 | 0;
    $arrayidx460 = $0 + $child442_sum | 0;
    $108 = $arrayidx460;
    $109 = HEAP32[$108 >> 2] | 0;
    $cmp461 = ($109 | 0) == 0;
    if ($cmp461) {
      label = 108;
      break;
    } else {
      label = 104;
      break;
    }
   case 104:
    $110 = $109;
    $111 = HEAP32[94] | 0;
    $cmp465 = $110 >>> 0 < $111 >>> 0;
    if ($cmp465) {
      label = 106;
      break;
    } else {
      label = 105;
      break;
    }
   case 105:
    $arrayidx471 = $R325_1 + 20 | 0;
    HEAP32[$arrayidx471 >> 2] = $109;
    $parent472 = $109 + 24 | 0;
    HEAP32[$parent472 >> 2] = $R325_1;
    label = 108;
    break;
   case 106:
    _abort();
   case 107:
    _abort();
   case 108:
    $or481 = $add255 | 1;
    $head482 = $p_addr_0 + 4 | 0;
    HEAP32[$head482 >> 2] = $or481;
    $112 = $p_addr_0;
    $add_ptr483 = $112 + $add255 | 0;
    $prev_foot484 = $add_ptr483;
    HEAP32[$prev_foot484 >> 2] = $add255;
    $113 = HEAP32[95] | 0;
    $cmp486 = ($p_addr_0 | 0) == ($113 | 0);
    if ($cmp486) {
      label = 109;
      break;
    } else {
      $psize_addr_1 = $add255;
      label = 111;
      break;
    }
   case 109:
    HEAP32[92] = $add255;
    label = 135;
    break;
   case 110:
    $and495 = $59 & -2;
    HEAP32[$58 >> 2] = $and495;
    $or496 = $psize_addr_0 | 1;
    $head497 = $p_addr_0 + 4 | 0;
    HEAP32[$head497 >> 2] = $or496;
    $114 = $p_addr_0;
    $add_ptr498 = $114 + $psize_addr_0 | 0;
    $prev_foot499 = $add_ptr498;
    HEAP32[$prev_foot499 >> 2] = $psize_addr_0;
    $psize_addr_1 = $psize_addr_0;
    label = 111;
    break;
   case 111:
    $shr501 = $psize_addr_1 >>> 3;
    $cmp502 = $psize_addr_1 >>> 0 < 256;
    if ($cmp502) {
      label = 112;
      break;
    } else {
      label = 117;
      break;
    }
   case 112:
    $shl508 = $shr501 << 1;
    $arrayidx510 = 400 + ($shl508 << 2) | 0;
    $115 = $arrayidx510;
    $116 = HEAP32[90] | 0;
    $shl513 = 1 << $shr501;
    $and514 = $116 & $shl513;
    $tobool515 = ($and514 | 0) == 0;
    if ($tobool515) {
      label = 113;
      break;
    } else {
      label = 114;
      break;
    }
   case 113:
    $or519 = $116 | $shl513;
    HEAP32[90] = $or519;
    $F511_0 = $115;
    label = 116;
    break;
   case 114:
    $arrayidx510_sum12 = $shl508 + 2 | 0;
    $117 = 400 + ($arrayidx510_sum12 << 2) | 0;
    $118 = HEAP32[$117 >> 2] | 0;
    $119 = $118;
    $120 = HEAP32[94] | 0;
    $cmp523 = $119 >>> 0 < $120 >>> 0;
    if ($cmp523) {
      label = 115;
      break;
    } else {
      $F511_0 = $118;
      label = 116;
      break;
    }
   case 115:
    _abort();
   case 116:
    $arrayidx510_sum = $shl508 + 2 | 0;
    $121 = 400 + ($arrayidx510_sum << 2) | 0;
    HEAP32[$121 >> 2] = $p_addr_0;
    $bk533 = $F511_0 + 12 | 0;
    HEAP32[$bk533 >> 2] = $p_addr_0;
    $fd534 = $p_addr_0 + 8 | 0;
    HEAP32[$fd534 >> 2] = $F511_0;
    $bk535 = $p_addr_0 + 12 | 0;
    HEAP32[$bk535 >> 2] = $115;
    label = 135;
    break;
   case 117:
    $122 = $p_addr_0;
    $shr540 = $psize_addr_1 >>> 8;
    $cmp541 = ($shr540 | 0) == 0;
    if ($cmp541) {
      $I539_0 = 0;
      label = 120;
      break;
    } else {
      label = 118;
      break;
    }
   case 118:
    $cmp545 = $psize_addr_1 >>> 0 > 16777215;
    if ($cmp545) {
      $I539_0 = 31;
      label = 120;
      break;
    } else {
      label = 119;
      break;
    }
   case 119:
    $sub = $shr540 + 1048320 | 0;
    $shr549 = $sub >>> 16;
    $and550 = $shr549 & 8;
    $shl551 = $shr540 << $and550;
    $sub552 = $shl551 + 520192 | 0;
    $shr553 = $sub552 >>> 16;
    $and554 = $shr553 & 4;
    $add555 = $and554 | $and550;
    $shl556 = $shl551 << $and554;
    $sub557 = $shl556 + 245760 | 0;
    $shr558 = $sub557 >>> 16;
    $and559 = $shr558 & 2;
    $add560 = $add555 | $and559;
    $sub561 = 14 - $add560 | 0;
    $shl562 = $shl556 << $and559;
    $shr563 = $shl562 >>> 15;
    $add564 = $sub561 + $shr563 | 0;
    $shl565 = $add564 << 1;
    $add566 = $add564 + 7 | 0;
    $shr567 = $psize_addr_1 >>> ($add566 >>> 0);
    $and568 = $shr567 & 1;
    $add569 = $and568 | $shl565;
    $I539_0 = $add569;
    label = 120;
    break;
   case 120:
    $arrayidx573 = 664 + ($I539_0 << 2) | 0;
    $index574 = $p_addr_0 + 28 | 0;
    $I539_0_c = $I539_0;
    HEAP32[$index574 >> 2] = $I539_0_c;
    $arrayidx576 = $p_addr_0 + 20 | 0;
    HEAP32[$arrayidx576 >> 2] = 0;
    $123 = $p_addr_0 + 16 | 0;
    HEAP32[$123 >> 2] = 0;
    $124 = HEAP32[91] | 0;
    $shl580 = 1 << $I539_0;
    $and581 = $124 & $shl580;
    $tobool582 = ($and581 | 0) == 0;
    if ($tobool582) {
      label = 121;
      break;
    } else {
      label = 122;
      break;
    }
   case 121:
    $or586 = $124 | $shl580;
    HEAP32[91] = $or586;
    HEAP32[$arrayidx573 >> 2] = $122;
    $parent587 = $p_addr_0 + 24 | 0;
    $_c = $arrayidx573;
    HEAP32[$parent587 >> 2] = $_c;
    $bk588 = $p_addr_0 + 12 | 0;
    HEAP32[$bk588 >> 2] = $p_addr_0;
    $fd589 = $p_addr_0 + 8 | 0;
    HEAP32[$fd589 >> 2] = $p_addr_0;
    label = 135;
    break;
   case 122:
    $125 = HEAP32[$arrayidx573 >> 2] | 0;
    $cmp592 = ($I539_0 | 0) == 31;
    if ($cmp592) {
      $cond = 0;
      label = 124;
      break;
    } else {
      label = 123;
      break;
    }
   case 123:
    $shr594 = $I539_0 >>> 1;
    $sub597 = 25 - $shr594 | 0;
    $cond = $sub597;
    label = 124;
    break;
   case 124:
    $shl598 = $psize_addr_1 << $cond;
    $K591_0 = $shl598;
    $T_0 = $125;
    label = 125;
    break;
   case 125:
    $head599 = $T_0 + 4 | 0;
    $126 = HEAP32[$head599 >> 2] | 0;
    $and600 = $126 & -8;
    $cmp601 = ($and600 | 0) == ($psize_addr_1 | 0);
    if ($cmp601) {
      label = 130;
      break;
    } else {
      label = 126;
      break;
    }
   case 126:
    $shr604 = $K591_0 >>> 31;
    $arrayidx607 = $T_0 + 16 + ($shr604 << 2) | 0;
    $127 = HEAP32[$arrayidx607 >> 2] | 0;
    $cmp609 = ($127 | 0) == 0;
    $shl608 = $K591_0 << 1;
    if ($cmp609) {
      label = 127;
      break;
    } else {
      $K591_0 = $shl608;
      $T_0 = $127;
      label = 125;
      break;
    }
   case 127:
    $128 = $arrayidx607;
    $129 = HEAP32[94] | 0;
    $cmp614 = $128 >>> 0 < $129 >>> 0;
    if ($cmp614) {
      label = 129;
      break;
    } else {
      label = 128;
      break;
    }
   case 128:
    HEAP32[$arrayidx607 >> 2] = $122;
    $parent619 = $p_addr_0 + 24 | 0;
    $T_0_c9 = $T_0;
    HEAP32[$parent619 >> 2] = $T_0_c9;
    $bk620 = $p_addr_0 + 12 | 0;
    HEAP32[$bk620 >> 2] = $p_addr_0;
    $fd621 = $p_addr_0 + 8 | 0;
    HEAP32[$fd621 >> 2] = $p_addr_0;
    label = 135;
    break;
   case 129:
    _abort();
   case 130:
    $fd626 = $T_0 + 8 | 0;
    $130 = HEAP32[$fd626 >> 2] | 0;
    $131 = $T_0;
    $132 = HEAP32[94] | 0;
    $cmp628 = $131 >>> 0 < $132 >>> 0;
    if ($cmp628) {
      label = 133;
      break;
    } else {
      label = 131;
      break;
    }
   case 131:
    $133 = $130;
    $cmp632 = $133 >>> 0 < $132 >>> 0;
    if ($cmp632) {
      label = 133;
      break;
    } else {
      label = 132;
      break;
    }
   case 132:
    $bk639 = $130 + 12 | 0;
    HEAP32[$bk639 >> 2] = $122;
    HEAP32[$fd626 >> 2] = $122;
    $fd641 = $p_addr_0 + 8 | 0;
    $_c8 = $130;
    HEAP32[$fd641 >> 2] = $_c8;
    $bk642 = $p_addr_0 + 12 | 0;
    $T_0_c = $T_0;
    HEAP32[$bk642 >> 2] = $T_0_c;
    $parent643 = $p_addr_0 + 24 | 0;
    HEAP32[$parent643 >> 2] = 0;
    label = 135;
    break;
   case 133:
    _abort();
   case 134:
    _abort();
   case 135:
    return;
  }
}
function _init_top($p, $psize) {
  $p = $p | 0;
  $psize = $psize | 0;
  var $0 = 0, $add_ptr = 0, $1 = 0, $and = 0, $cmp = 0, $2 = 0, $and3 = 0, $cond = 0, $add_ptr4 = 0, $3 = 0, $sub5 = 0, $or = 0, $add_ptr4_sum = 0, $head = 0, $4 = 0, $add_ptr6_sum = 0, $head7 = 0, $5 = 0, $6 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = $p;
    $add_ptr = $p + 8 | 0;
    $1 = $add_ptr;
    $and = $1 & 7;
    $cmp = ($and | 0) == 0;
    if ($cmp) {
      $cond = 0;
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $2 = -$1 | 0;
    $and3 = $2 & 7;
    $cond = $and3;
    label = 4;
    break;
   case 4:
    $add_ptr4 = $0 + $cond | 0;
    $3 = $add_ptr4;
    $sub5 = $psize - $cond | 0;
    HEAP32[96] = $3;
    HEAP32[93] = $sub5;
    $or = $sub5 | 1;
    $add_ptr4_sum = $cond + 4 | 0;
    $head = $0 + $add_ptr4_sum | 0;
    $4 = $head;
    HEAP32[$4 >> 2] = $or;
    $add_ptr6_sum = $psize + 4 | 0;
    $head7 = $0 + $add_ptr6_sum | 0;
    $5 = $head7;
    HEAP32[$5 >> 2] = 40;
    $6 = HEAP32[6] | 0;
    HEAP32[97] = $6;
    return;
  }
}
function _init_bins() {
  var $i_02 = 0, $shl = 0, $arrayidx = 0, $0 = 0, $arrayidx_sum = 0, $1 = 0, $arrayidx_sum1 = 0, $2 = 0, $inc = 0, $cmp = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $i_02 = 0;
    label = 3;
    break;
   case 3:
    $shl = $i_02 << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $0 = $arrayidx;
    $arrayidx_sum = $shl + 3 | 0;
    $1 = 400 + ($arrayidx_sum << 2) | 0;
    HEAP32[$1 >> 2] = $0;
    $arrayidx_sum1 = $shl + 2 | 0;
    $2 = 400 + ($arrayidx_sum1 << 2) | 0;
    HEAP32[$2 >> 2] = $0;
    $inc = $i_02 + 1 | 0;
    $cmp = $inc >>> 0 < 32;
    if ($cmp) {
      $i_02 = $inc;
      label = 3;
      break;
    } else {
      label = 4;
      break;
    }
   case 4:
    return;
  }
}
function _prepend_alloc($newbase, $oldbase, $nb) {
  $newbase = $newbase | 0;
  $oldbase = $oldbase | 0;
  $nb = $nb | 0;
  var $add_ptr = 0, $0 = 0, $and = 0, $cmp = 0, $1 = 0, $and3 = 0, $cond = 0, $add_ptr4 = 0, $add_ptr5 = 0, $2 = 0, $and6 = 0, $cmp7 = 0, $3 = 0, $and13 = 0, $cond15 = 0, $add_ptr16 = 0, $4 = 0, $sub_ptr_lhs_cast = 0, $sub_ptr_rhs_cast = 0, $sub_ptr_sub = 0, $add_ptr4_sum = 0, $add_ptr17 = 0, $5 = 0, $sub18 = 0, $or19 = 0, $add_ptr4_sum1 = 0, $head = 0, $6 = 0, $7 = 0, $cmp20 = 0, $8 = 0, $add = 0, $or22 = 0, $add_ptr17_sum39 = 0, $head23 = 0, $9 = 0, $10 = 0, $cmp24 = 0, $11 = 0, $add26 = 0, $or28 = 0, $add_ptr17_sum37 = 0, $head29 = 0, $12 = 0, $add_ptr17_sum38 = 0, $add_ptr30 = 0, $prev_foot = 0, $add_ptr16_sum = 0, $head32 = 0, $13 = 0, $14 = 0, $and33 = 0, $cmp34 = 0, $and37 = 0, $shr = 0, $cmp38 = 0, $add_ptr16_sum3233 = 0, $fd = 0, $15 = 0, $16 = 0, $add_ptr16_sum34 = 0, $bk = 0, $17 = 0, $18 = 0, $shl = 0, $arrayidx = 0, $19 = 0, $cmp41 = 0, $20 = 0, $21 = 0, $cmp42 = 0, $bk43 = 0, $22 = 0, $cmp44 = 0, $cmp46 = 0, $shl48 = 0, $neg = 0, $23 = 0, $and49 = 0, $cmp54 = 0, $24 = 0, $25 = 0, $cmp57 = 0, $fd59 = 0, $26 = 0, $cmp60 = 0, $bk67 = 0, $fd68 = 0, $27 = 0, $add_ptr16_sum23 = 0, $parent = 0, $28 = 0, $29 = 0, $add_ptr16_sum4 = 0, $bk74 = 0, $30 = 0, $31 = 0, $cmp75 = 0, $add_ptr16_sum2930 = 0, $fd78 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $cmp81 = 0, $bk82 = 0, $36 = 0, $cmp83 = 0, $fd85 = 0, $37 = 0, $cmp86 = 0, $add_ptr16_sum56 = 0, $child_sum = 0, $arrayidx96 = 0, $38 = 0, $39 = 0, $cmp97 = 0, $child = 0, $arrayidx99 = 0, $40 = 0, $cmp100 = 0, $RP_0 = 0, $R_0 = 0, $arrayidx103 = 0, $41 = 0, $cmp104 = 0, $arrayidx107 = 0, $42 = 0, $cmp108 = 0, $CP_0 = 0, $43 = 0, $44 = 0, $45 = 0, $cmp112 = 0, $R_1 = 0, $cmp120 = 0, $add_ptr16_sum26 = 0, $index = 0, $46 = 0, $47 = 0, $arrayidx123 = 0, $48 = 0, $cmp124 = 0, $cond41 = 0, $49 = 0, $shl131 = 0, $neg132 = 0, $50 = 0, $and133 = 0, $51 = 0, $52 = 0, $cmp137 = 0, $arrayidx143 = 0, $53 = 0, $cmp144 = 0, $arrayidx151 = 0, $cmp156 = 0, $54 = 0, $55 = 0, $cmp160 = 0, $parent165 = 0, $add_ptr16_sum2728 = 0, $child166 = 0, $arrayidx167 = 0, $56 = 0, $cmp168 = 0, $57 = 0, $58 = 0, $cmp172 = 0, $arrayidx178 = 0, $parent179 = 0, $child166_sum = 0, $arrayidx184 = 0, $59 = 0, $60 = 0, $cmp185 = 0, $61 = 0, $62 = 0, $cmp189 = 0, $arrayidx195 = 0, $parent196 = 0, $add_ptr16_sum7 = 0, $add_ptr205 = 0, $63 = 0, $add206 = 0, $qsize_0 = 0, $oldfirst_0 = 0, $head208 = 0, $64 = 0, $and209 = 0, $or210 = 0, $add_ptr17_sum = 0, $head211 = 0, $65 = 0, $add_ptr17_sum8 = 0, $add_ptr212 = 0, $prev_foot213 = 0, $shr214 = 0, $cmp215 = 0, $shl221 = 0, $arrayidx223 = 0, $66 = 0, $67 = 0, $shl226 = 0, $and227 = 0, $tobool228 = 0, $or232 = 0, $arrayidx223_sum25 = 0, $68 = 0, $69 = 0, $70 = 0, $71 = 0, $cmp236 = 0, $F224_0 = 0, $arrayidx223_sum = 0, $72 = 0, $bk246 = 0, $add_ptr17_sum23 = 0, $fd247 = 0, $73 = 0, $add_ptr17_sum24 = 0, $bk248 = 0, $74 = 0, $75 = 0, $shr253 = 0, $cmp254 = 0, $cmp258 = 0, $sub262 = 0, $shr263 = 0, $and264 = 0, $shl265 = 0, $sub266 = 0, $shr267 = 0, $and268 = 0, $add269 = 0, $shl270 = 0, $sub271 = 0, $shr272 = 0, $and273 = 0, $add274 = 0, $sub275 = 0, $shl276 = 0, $shr277 = 0, $add278 = 0, $shl279 = 0, $add280 = 0, $shr281 = 0, $and282 = 0, $add283 = 0, $I252_0 = 0, $arrayidx287 = 0, $add_ptr17_sum9 = 0, $index288 = 0, $76 = 0, $add_ptr17_sum10 = 0, $child289 = 0, $child289_sum = 0, $arrayidx290 = 0, $77 = 0, $arrayidx292 = 0, $78 = 0, $shl294 = 0, $and295 = 0, $tobool296 = 0, $or300 = 0, $79 = 0, $add_ptr17_sum11 = 0, $parent301 = 0, $80 = 0, $add_ptr17_sum12 = 0, $bk302 = 0, $81 = 0, $add_ptr17_sum13 = 0, $fd303 = 0, $82 = 0, $83 = 0, $cmp306 = 0, $shr310 = 0, $sub313 = 0, $cond315 = 0, $shl316 = 0, $T_0 = 0, $K305_0 = 0, $head317 = 0, $84 = 0, $and318 = 0, $cmp319 = 0, $shr322 = 0, $arrayidx325 = 0, $85 = 0, $cmp327 = 0, $shl326 = 0, $86 = 0, $87 = 0, $cmp332 = 0, $add_ptr17_sum20 = 0, $parent337 = 0, $88 = 0, $add_ptr17_sum21 = 0, $bk338 = 0, $89 = 0, $add_ptr17_sum22 = 0, $fd339 = 0, $90 = 0, $fd344 = 0, $91 = 0, $92 = 0, $93 = 0, $cmp346 = 0, $94 = 0, $cmp350 = 0, $bk357 = 0, $add_ptr17_sum17 = 0, $fd359 = 0, $95 = 0, $add_ptr17_sum18 = 0, $bk360 = 0, $96 = 0, $add_ptr17_sum19 = 0, $parent361 = 0, $97 = 0, $add_ptr4_sum1415 = 0, $add_ptr368 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $add_ptr = $newbase + 8 | 0;
    $0 = $add_ptr;
    $and = $0 & 7;
    $cmp = ($and | 0) == 0;
    if ($cmp) {
      $cond = 0;
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $1 = -$0 | 0;
    $and3 = $1 & 7;
    $cond = $and3;
    label = 4;
    break;
   case 4:
    $add_ptr4 = $newbase + $cond | 0;
    $add_ptr5 = $oldbase + 8 | 0;
    $2 = $add_ptr5;
    $and6 = $2 & 7;
    $cmp7 = ($and6 | 0) == 0;
    if ($cmp7) {
      $cond15 = 0;
      label = 6;
      break;
    } else {
      label = 5;
      break;
    }
   case 5:
    $3 = -$2 | 0;
    $and13 = $3 & 7;
    $cond15 = $and13;
    label = 6;
    break;
   case 6:
    $add_ptr16 = $oldbase + $cond15 | 0;
    $4 = $add_ptr16;
    $sub_ptr_lhs_cast = $add_ptr16;
    $sub_ptr_rhs_cast = $add_ptr4;
    $sub_ptr_sub = $sub_ptr_lhs_cast - $sub_ptr_rhs_cast | 0;
    $add_ptr4_sum = $cond + $nb | 0;
    $add_ptr17 = $newbase + $add_ptr4_sum | 0;
    $5 = $add_ptr17;
    $sub18 = $sub_ptr_sub - $nb | 0;
    $or19 = $nb | 3;
    $add_ptr4_sum1 = $cond + 4 | 0;
    $head = $newbase + $add_ptr4_sum1 | 0;
    $6 = $head;
    HEAP32[$6 >> 2] = $or19;
    $7 = HEAP32[96] | 0;
    $cmp20 = ($4 | 0) == ($7 | 0);
    if ($cmp20) {
      label = 7;
      break;
    } else {
      label = 8;
      break;
    }
   case 7:
    $8 = HEAP32[93] | 0;
    $add = $8 + $sub18 | 0;
    HEAP32[93] = $add;
    HEAP32[96] = $5;
    $or22 = $add | 1;
    $add_ptr17_sum39 = $add_ptr4_sum + 4 | 0;
    $head23 = $newbase + $add_ptr17_sum39 | 0;
    $9 = $head23;
    HEAP32[$9 >> 2] = $or22;
    label = 81;
    break;
   case 8:
    $10 = HEAP32[95] | 0;
    $cmp24 = ($4 | 0) == ($10 | 0);
    if ($cmp24) {
      label = 9;
      break;
    } else {
      label = 10;
      break;
    }
   case 9:
    $11 = HEAP32[92] | 0;
    $add26 = $11 + $sub18 | 0;
    HEAP32[92] = $add26;
    HEAP32[95] = $5;
    $or28 = $add26 | 1;
    $add_ptr17_sum37 = $add_ptr4_sum + 4 | 0;
    $head29 = $newbase + $add_ptr17_sum37 | 0;
    $12 = $head29;
    HEAP32[$12 >> 2] = $or28;
    $add_ptr17_sum38 = $add26 + $add_ptr4_sum | 0;
    $add_ptr30 = $newbase + $add_ptr17_sum38 | 0;
    $prev_foot = $add_ptr30;
    HEAP32[$prev_foot >> 2] = $add26;
    label = 81;
    break;
   case 10:
    $add_ptr16_sum = $cond15 + 4 | 0;
    $head32 = $oldbase + $add_ptr16_sum | 0;
    $13 = $head32;
    $14 = HEAP32[$13 >> 2] | 0;
    $and33 = $14 & 3;
    $cmp34 = ($and33 | 0) == 1;
    if ($cmp34) {
      label = 11;
      break;
    } else {
      $oldfirst_0 = $4;
      $qsize_0 = $sub18;
      label = 58;
      break;
    }
   case 11:
    $and37 = $14 & -8;
    $shr = $14 >>> 3;
    $cmp38 = $14 >>> 0 < 256;
    if ($cmp38) {
      label = 12;
      break;
    } else {
      label = 23;
      break;
    }
   case 12:
    $add_ptr16_sum3233 = $cond15 | 8;
    $fd = $oldbase + $add_ptr16_sum3233 | 0;
    $15 = $fd;
    $16 = HEAP32[$15 >> 2] | 0;
    $add_ptr16_sum34 = $cond15 + 12 | 0;
    $bk = $oldbase + $add_ptr16_sum34 | 0;
    $17 = $bk;
    $18 = HEAP32[$17 >> 2] | 0;
    $shl = $shr << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $19 = $arrayidx;
    $cmp41 = ($16 | 0) == ($19 | 0);
    if ($cmp41) {
      label = 15;
      break;
    } else {
      label = 13;
      break;
    }
   case 13:
    $20 = $16;
    $21 = HEAP32[94] | 0;
    $cmp42 = $20 >>> 0 < $21 >>> 0;
    if ($cmp42) {
      label = 22;
      break;
    } else {
      label = 14;
      break;
    }
   case 14:
    $bk43 = $16 + 12 | 0;
    $22 = HEAP32[$bk43 >> 2] | 0;
    $cmp44 = ($22 | 0) == ($4 | 0);
    if ($cmp44) {
      label = 15;
      break;
    } else {
      label = 22;
      break;
    }
   case 15:
    $cmp46 = ($18 | 0) == ($16 | 0);
    if ($cmp46) {
      label = 16;
      break;
    } else {
      label = 17;
      break;
    }
   case 16:
    $shl48 = 1 << $shr;
    $neg = $shl48 ^ -1;
    $23 = HEAP32[90] | 0;
    $and49 = $23 & $neg;
    HEAP32[90] = $and49;
    label = 57;
    break;
   case 17:
    $cmp54 = ($18 | 0) == ($19 | 0);
    if ($cmp54) {
      label = 20;
      break;
    } else {
      label = 18;
      break;
    }
   case 18:
    $24 = $18;
    $25 = HEAP32[94] | 0;
    $cmp57 = $24 >>> 0 < $25 >>> 0;
    if ($cmp57) {
      label = 21;
      break;
    } else {
      label = 19;
      break;
    }
   case 19:
    $fd59 = $18 + 8 | 0;
    $26 = HEAP32[$fd59 >> 2] | 0;
    $cmp60 = ($26 | 0) == ($4 | 0);
    if ($cmp60) {
      label = 20;
      break;
    } else {
      label = 21;
      break;
    }
   case 20:
    $bk67 = $16 + 12 | 0;
    HEAP32[$bk67 >> 2] = $18;
    $fd68 = $18 + 8 | 0;
    HEAP32[$fd68 >> 2] = $16;
    label = 57;
    break;
   case 21:
    _abort();
    return 0;
    return 0;
   case 22:
    _abort();
    return 0;
    return 0;
   case 23:
    $27 = $add_ptr16;
    $add_ptr16_sum23 = $cond15 | 24;
    $parent = $oldbase + $add_ptr16_sum23 | 0;
    $28 = $parent;
    $29 = HEAP32[$28 >> 2] | 0;
    $add_ptr16_sum4 = $cond15 + 12 | 0;
    $bk74 = $oldbase + $add_ptr16_sum4 | 0;
    $30 = $bk74;
    $31 = HEAP32[$30 >> 2] | 0;
    $cmp75 = ($31 | 0) == ($27 | 0);
    if ($cmp75) {
      label = 29;
      break;
    } else {
      label = 24;
      break;
    }
   case 24:
    $add_ptr16_sum2930 = $cond15 | 8;
    $fd78 = $oldbase + $add_ptr16_sum2930 | 0;
    $32 = $fd78;
    $33 = HEAP32[$32 >> 2] | 0;
    $34 = $33;
    $35 = HEAP32[94] | 0;
    $cmp81 = $34 >>> 0 < $35 >>> 0;
    if ($cmp81) {
      label = 28;
      break;
    } else {
      label = 25;
      break;
    }
   case 25:
    $bk82 = $33 + 12 | 0;
    $36 = HEAP32[$bk82 >> 2] | 0;
    $cmp83 = ($36 | 0) == ($27 | 0);
    if ($cmp83) {
      label = 26;
      break;
    } else {
      label = 28;
      break;
    }
   case 26:
    $fd85 = $31 + 8 | 0;
    $37 = HEAP32[$fd85 >> 2] | 0;
    $cmp86 = ($37 | 0) == ($27 | 0);
    if ($cmp86) {
      label = 27;
      break;
    } else {
      label = 28;
      break;
    }
   case 27:
    HEAP32[$bk82 >> 2] = $31;
    HEAP32[$fd85 >> 2] = $33;
    $R_1 = $31;
    label = 37;
    break;
   case 28:
    _abort();
    return 0;
    return 0;
   case 29:
    $add_ptr16_sum56 = $cond15 | 16;
    $child_sum = $add_ptr16_sum56 + 4 | 0;
    $arrayidx96 = $oldbase + $child_sum | 0;
    $38 = $arrayidx96;
    $39 = HEAP32[$38 >> 2] | 0;
    $cmp97 = ($39 | 0) == 0;
    if ($cmp97) {
      label = 30;
      break;
    } else {
      $R_0 = $39;
      $RP_0 = $38;
      label = 31;
      break;
    }
   case 30:
    $child = $oldbase + $add_ptr16_sum56 | 0;
    $arrayidx99 = $child;
    $40 = HEAP32[$arrayidx99 >> 2] | 0;
    $cmp100 = ($40 | 0) == 0;
    if ($cmp100) {
      $R_1 = 0;
      label = 37;
      break;
    } else {
      $R_0 = $40;
      $RP_0 = $arrayidx99;
      label = 31;
      break;
    }
   case 31:
    $arrayidx103 = $R_0 + 20 | 0;
    $41 = HEAP32[$arrayidx103 >> 2] | 0;
    $cmp104 = ($41 | 0) == 0;
    if ($cmp104) {
      label = 32;
      break;
    } else {
      $CP_0 = $arrayidx103;
      label = 33;
      break;
    }
   case 32:
    $arrayidx107 = $R_0 + 16 | 0;
    $42 = HEAP32[$arrayidx107 >> 2] | 0;
    $cmp108 = ($42 | 0) == 0;
    if ($cmp108) {
      label = 34;
      break;
    } else {
      $CP_0 = $arrayidx107;
      label = 33;
      break;
    }
   case 33:
    $43 = HEAP32[$CP_0 >> 2] | 0;
    $R_0 = $43;
    $RP_0 = $CP_0;
    label = 31;
    break;
   case 34:
    $44 = $RP_0;
    $45 = HEAP32[94] | 0;
    $cmp112 = $44 >>> 0 < $45 >>> 0;
    if ($cmp112) {
      label = 36;
      break;
    } else {
      label = 35;
      break;
    }
   case 35:
    HEAP32[$RP_0 >> 2] = 0;
    $R_1 = $R_0;
    label = 37;
    break;
   case 36:
    _abort();
    return 0;
    return 0;
   case 37:
    $cmp120 = ($29 | 0) == 0;
    if ($cmp120) {
      label = 57;
      break;
    } else {
      label = 38;
      break;
    }
   case 38:
    $add_ptr16_sum26 = $cond15 + 28 | 0;
    $index = $oldbase + $add_ptr16_sum26 | 0;
    $46 = $index;
    $47 = HEAP32[$46 >> 2] | 0;
    $arrayidx123 = 664 + ($47 << 2) | 0;
    $48 = HEAP32[$arrayidx123 >> 2] | 0;
    $cmp124 = ($27 | 0) == ($48 | 0);
    if ($cmp124) {
      label = 39;
      break;
    } else {
      label = 41;
      break;
    }
   case 39:
    HEAP32[$arrayidx123 >> 2] = $R_1;
    $cond41 = ($R_1 | 0) == 0;
    if ($cond41) {
      label = 40;
      break;
    } else {
      label = 47;
      break;
    }
   case 40:
    $49 = HEAP32[$46 >> 2] | 0;
    $shl131 = 1 << $49;
    $neg132 = $shl131 ^ -1;
    $50 = HEAP32[91] | 0;
    $and133 = $50 & $neg132;
    HEAP32[91] = $and133;
    label = 57;
    break;
   case 41:
    $51 = $29;
    $52 = HEAP32[94] | 0;
    $cmp137 = $51 >>> 0 < $52 >>> 0;
    if ($cmp137) {
      label = 45;
      break;
    } else {
      label = 42;
      break;
    }
   case 42:
    $arrayidx143 = $29 + 16 | 0;
    $53 = HEAP32[$arrayidx143 >> 2] | 0;
    $cmp144 = ($53 | 0) == ($27 | 0);
    if ($cmp144) {
      label = 43;
      break;
    } else {
      label = 44;
      break;
    }
   case 43:
    HEAP32[$arrayidx143 >> 2] = $R_1;
    label = 46;
    break;
   case 44:
    $arrayidx151 = $29 + 20 | 0;
    HEAP32[$arrayidx151 >> 2] = $R_1;
    label = 46;
    break;
   case 45:
    _abort();
    return 0;
    return 0;
   case 46:
    $cmp156 = ($R_1 | 0) == 0;
    if ($cmp156) {
      label = 57;
      break;
    } else {
      label = 47;
      break;
    }
   case 47:
    $54 = $R_1;
    $55 = HEAP32[94] | 0;
    $cmp160 = $54 >>> 0 < $55 >>> 0;
    if ($cmp160) {
      label = 56;
      break;
    } else {
      label = 48;
      break;
    }
   case 48:
    $parent165 = $R_1 + 24 | 0;
    HEAP32[$parent165 >> 2] = $29;
    $add_ptr16_sum2728 = $cond15 | 16;
    $child166 = $oldbase + $add_ptr16_sum2728 | 0;
    $arrayidx167 = $child166;
    $56 = HEAP32[$arrayidx167 >> 2] | 0;
    $cmp168 = ($56 | 0) == 0;
    if ($cmp168) {
      label = 52;
      break;
    } else {
      label = 49;
      break;
    }
   case 49:
    $57 = $56;
    $58 = HEAP32[94] | 0;
    $cmp172 = $57 >>> 0 < $58 >>> 0;
    if ($cmp172) {
      label = 51;
      break;
    } else {
      label = 50;
      break;
    }
   case 50:
    $arrayidx178 = $R_1 + 16 | 0;
    HEAP32[$arrayidx178 >> 2] = $56;
    $parent179 = $56 + 24 | 0;
    HEAP32[$parent179 >> 2] = $R_1;
    label = 52;
    break;
   case 51:
    _abort();
    return 0;
    return 0;
   case 52:
    $child166_sum = $add_ptr16_sum2728 + 4 | 0;
    $arrayidx184 = $oldbase + $child166_sum | 0;
    $59 = $arrayidx184;
    $60 = HEAP32[$59 >> 2] | 0;
    $cmp185 = ($60 | 0) == 0;
    if ($cmp185) {
      label = 57;
      break;
    } else {
      label = 53;
      break;
    }
   case 53:
    $61 = $60;
    $62 = HEAP32[94] | 0;
    $cmp189 = $61 >>> 0 < $62 >>> 0;
    if ($cmp189) {
      label = 55;
      break;
    } else {
      label = 54;
      break;
    }
   case 54:
    $arrayidx195 = $R_1 + 20 | 0;
    HEAP32[$arrayidx195 >> 2] = $60;
    $parent196 = $60 + 24 | 0;
    HEAP32[$parent196 >> 2] = $R_1;
    label = 57;
    break;
   case 55:
    _abort();
    return 0;
    return 0;
   case 56:
    _abort();
    return 0;
    return 0;
   case 57:
    $add_ptr16_sum7 = $and37 | $cond15;
    $add_ptr205 = $oldbase + $add_ptr16_sum7 | 0;
    $63 = $add_ptr205;
    $add206 = $and37 + $sub18 | 0;
    $oldfirst_0 = $63;
    $qsize_0 = $add206;
    label = 58;
    break;
   case 58:
    $head208 = $oldfirst_0 + 4 | 0;
    $64 = HEAP32[$head208 >> 2] | 0;
    $and209 = $64 & -2;
    HEAP32[$head208 >> 2] = $and209;
    $or210 = $qsize_0 | 1;
    $add_ptr17_sum = $add_ptr4_sum + 4 | 0;
    $head211 = $newbase + $add_ptr17_sum | 0;
    $65 = $head211;
    HEAP32[$65 >> 2] = $or210;
    $add_ptr17_sum8 = $qsize_0 + $add_ptr4_sum | 0;
    $add_ptr212 = $newbase + $add_ptr17_sum8 | 0;
    $prev_foot213 = $add_ptr212;
    HEAP32[$prev_foot213 >> 2] = $qsize_0;
    $shr214 = $qsize_0 >>> 3;
    $cmp215 = $qsize_0 >>> 0 < 256;
    if ($cmp215) {
      label = 59;
      break;
    } else {
      label = 64;
      break;
    }
   case 59:
    $shl221 = $shr214 << 1;
    $arrayidx223 = 400 + ($shl221 << 2) | 0;
    $66 = $arrayidx223;
    $67 = HEAP32[90] | 0;
    $shl226 = 1 << $shr214;
    $and227 = $67 & $shl226;
    $tobool228 = ($and227 | 0) == 0;
    if ($tobool228) {
      label = 60;
      break;
    } else {
      label = 61;
      break;
    }
   case 60:
    $or232 = $67 | $shl226;
    HEAP32[90] = $or232;
    $F224_0 = $66;
    label = 63;
    break;
   case 61:
    $arrayidx223_sum25 = $shl221 + 2 | 0;
    $68 = 400 + ($arrayidx223_sum25 << 2) | 0;
    $69 = HEAP32[$68 >> 2] | 0;
    $70 = $69;
    $71 = HEAP32[94] | 0;
    $cmp236 = $70 >>> 0 < $71 >>> 0;
    if ($cmp236) {
      label = 62;
      break;
    } else {
      $F224_0 = $69;
      label = 63;
      break;
    }
   case 62:
    _abort();
    return 0;
    return 0;
   case 63:
    $arrayidx223_sum = $shl221 + 2 | 0;
    $72 = 400 + ($arrayidx223_sum << 2) | 0;
    HEAP32[$72 >> 2] = $5;
    $bk246 = $F224_0 + 12 | 0;
    HEAP32[$bk246 >> 2] = $5;
    $add_ptr17_sum23 = $add_ptr4_sum + 8 | 0;
    $fd247 = $newbase + $add_ptr17_sum23 | 0;
    $73 = $fd247;
    HEAP32[$73 >> 2] = $F224_0;
    $add_ptr17_sum24 = $add_ptr4_sum + 12 | 0;
    $bk248 = $newbase + $add_ptr17_sum24 | 0;
    $74 = $bk248;
    HEAP32[$74 >> 2] = $66;
    label = 81;
    break;
   case 64:
    $75 = $add_ptr17;
    $shr253 = $qsize_0 >>> 8;
    $cmp254 = ($shr253 | 0) == 0;
    if ($cmp254) {
      $I252_0 = 0;
      label = 67;
      break;
    } else {
      label = 65;
      break;
    }
   case 65:
    $cmp258 = $qsize_0 >>> 0 > 16777215;
    if ($cmp258) {
      $I252_0 = 31;
      label = 67;
      break;
    } else {
      label = 66;
      break;
    }
   case 66:
    $sub262 = $shr253 + 1048320 | 0;
    $shr263 = $sub262 >>> 16;
    $and264 = $shr263 & 8;
    $shl265 = $shr253 << $and264;
    $sub266 = $shl265 + 520192 | 0;
    $shr267 = $sub266 >>> 16;
    $and268 = $shr267 & 4;
    $add269 = $and268 | $and264;
    $shl270 = $shl265 << $and268;
    $sub271 = $shl270 + 245760 | 0;
    $shr272 = $sub271 >>> 16;
    $and273 = $shr272 & 2;
    $add274 = $add269 | $and273;
    $sub275 = 14 - $add274 | 0;
    $shl276 = $shl270 << $and273;
    $shr277 = $shl276 >>> 15;
    $add278 = $sub275 + $shr277 | 0;
    $shl279 = $add278 << 1;
    $add280 = $add278 + 7 | 0;
    $shr281 = $qsize_0 >>> ($add280 >>> 0);
    $and282 = $shr281 & 1;
    $add283 = $and282 | $shl279;
    $I252_0 = $add283;
    label = 67;
    break;
   case 67:
    $arrayidx287 = 664 + ($I252_0 << 2) | 0;
    $add_ptr17_sum9 = $add_ptr4_sum + 28 | 0;
    $index288 = $newbase + $add_ptr17_sum9 | 0;
    $76 = $index288;
    HEAP32[$76 >> 2] = $I252_0;
    $add_ptr17_sum10 = $add_ptr4_sum + 16 | 0;
    $child289 = $newbase + $add_ptr17_sum10 | 0;
    $child289_sum = $add_ptr4_sum + 20 | 0;
    $arrayidx290 = $newbase + $child289_sum | 0;
    $77 = $arrayidx290;
    HEAP32[$77 >> 2] = 0;
    $arrayidx292 = $child289;
    HEAP32[$arrayidx292 >> 2] = 0;
    $78 = HEAP32[91] | 0;
    $shl294 = 1 << $I252_0;
    $and295 = $78 & $shl294;
    $tobool296 = ($and295 | 0) == 0;
    if ($tobool296) {
      label = 68;
      break;
    } else {
      label = 69;
      break;
    }
   case 68:
    $or300 = $78 | $shl294;
    HEAP32[91] = $or300;
    HEAP32[$arrayidx287 >> 2] = $75;
    $79 = $arrayidx287;
    $add_ptr17_sum11 = $add_ptr4_sum + 24 | 0;
    $parent301 = $newbase + $add_ptr17_sum11 | 0;
    $80 = $parent301;
    HEAP32[$80 >> 2] = $79;
    $add_ptr17_sum12 = $add_ptr4_sum + 12 | 0;
    $bk302 = $newbase + $add_ptr17_sum12 | 0;
    $81 = $bk302;
    HEAP32[$81 >> 2] = $75;
    $add_ptr17_sum13 = $add_ptr4_sum + 8 | 0;
    $fd303 = $newbase + $add_ptr17_sum13 | 0;
    $82 = $fd303;
    HEAP32[$82 >> 2] = $75;
    label = 81;
    break;
   case 69:
    $83 = HEAP32[$arrayidx287 >> 2] | 0;
    $cmp306 = ($I252_0 | 0) == 31;
    if ($cmp306) {
      $cond315 = 0;
      label = 71;
      break;
    } else {
      label = 70;
      break;
    }
   case 70:
    $shr310 = $I252_0 >>> 1;
    $sub313 = 25 - $shr310 | 0;
    $cond315 = $sub313;
    label = 71;
    break;
   case 71:
    $shl316 = $qsize_0 << $cond315;
    $K305_0 = $shl316;
    $T_0 = $83;
    label = 72;
    break;
   case 72:
    $head317 = $T_0 + 4 | 0;
    $84 = HEAP32[$head317 >> 2] | 0;
    $and318 = $84 & -8;
    $cmp319 = ($and318 | 0) == ($qsize_0 | 0);
    if ($cmp319) {
      label = 77;
      break;
    } else {
      label = 73;
      break;
    }
   case 73:
    $shr322 = $K305_0 >>> 31;
    $arrayidx325 = $T_0 + 16 + ($shr322 << 2) | 0;
    $85 = HEAP32[$arrayidx325 >> 2] | 0;
    $cmp327 = ($85 | 0) == 0;
    $shl326 = $K305_0 << 1;
    if ($cmp327) {
      label = 74;
      break;
    } else {
      $K305_0 = $shl326;
      $T_0 = $85;
      label = 72;
      break;
    }
   case 74:
    $86 = $arrayidx325;
    $87 = HEAP32[94] | 0;
    $cmp332 = $86 >>> 0 < $87 >>> 0;
    if ($cmp332) {
      label = 76;
      break;
    } else {
      label = 75;
      break;
    }
   case 75:
    HEAP32[$arrayidx325 >> 2] = $75;
    $add_ptr17_sum20 = $add_ptr4_sum + 24 | 0;
    $parent337 = $newbase + $add_ptr17_sum20 | 0;
    $88 = $parent337;
    HEAP32[$88 >> 2] = $T_0;
    $add_ptr17_sum21 = $add_ptr4_sum + 12 | 0;
    $bk338 = $newbase + $add_ptr17_sum21 | 0;
    $89 = $bk338;
    HEAP32[$89 >> 2] = $75;
    $add_ptr17_sum22 = $add_ptr4_sum + 8 | 0;
    $fd339 = $newbase + $add_ptr17_sum22 | 0;
    $90 = $fd339;
    HEAP32[$90 >> 2] = $75;
    label = 81;
    break;
   case 76:
    _abort();
    return 0;
    return 0;
   case 77:
    $fd344 = $T_0 + 8 | 0;
    $91 = HEAP32[$fd344 >> 2] | 0;
    $92 = $T_0;
    $93 = HEAP32[94] | 0;
    $cmp346 = $92 >>> 0 < $93 >>> 0;
    if ($cmp346) {
      label = 80;
      break;
    } else {
      label = 78;
      break;
    }
   case 78:
    $94 = $91;
    $cmp350 = $94 >>> 0 < $93 >>> 0;
    if ($cmp350) {
      label = 80;
      break;
    } else {
      label = 79;
      break;
    }
   case 79:
    $bk357 = $91 + 12 | 0;
    HEAP32[$bk357 >> 2] = $75;
    HEAP32[$fd344 >> 2] = $75;
    $add_ptr17_sum17 = $add_ptr4_sum + 8 | 0;
    $fd359 = $newbase + $add_ptr17_sum17 | 0;
    $95 = $fd359;
    HEAP32[$95 >> 2] = $91;
    $add_ptr17_sum18 = $add_ptr4_sum + 12 | 0;
    $bk360 = $newbase + $add_ptr17_sum18 | 0;
    $96 = $bk360;
    HEAP32[$96 >> 2] = $T_0;
    $add_ptr17_sum19 = $add_ptr4_sum + 24 | 0;
    $parent361 = $newbase + $add_ptr17_sum19 | 0;
    $97 = $parent361;
    HEAP32[$97 >> 2] = 0;
    label = 81;
    break;
   case 80:
    _abort();
    return 0;
    return 0;
   case 81:
    $add_ptr4_sum1415 = $cond | 8;
    $add_ptr368 = $newbase + $add_ptr4_sum1415 | 0;
    return $add_ptr368 | 0;
  }
  return 0;
}
function _add_segment($tbase, $tsize) {
  $tbase = $tbase | 0;
  $tsize = $tsize | 0;
  var $0 = 0, $1 = 0, $call = 0, $base = 0, $2 = 0, $size = 0, $3 = 0, $add_ptr = 0, $add_ptr_sum = 0, $add_ptr2_sum = 0, $add_ptr3 = 0, $4 = 0, $and = 0, $cmp = 0, $5 = 0, $and6 = 0, $cond = 0, $add_ptr2_sum1 = 0, $add_ptr7 = 0, $add_ptr82 = 0, $add_ptr8 = 0, $cmp9 = 0, $cond13 = 0, $add_ptr14 = 0, $6 = 0, $7 = 0, $sub16 = 0, $head = 0, $8 = 0, $add_ptr2412 = 0, $9 = 0, $10 = 0, $cmp2713 = 0, $add_ptr2414 = 0, $11 = 0, $12 = 0, $13 = 0, $cmp27 = 0, $cmp28 = 0, $sub_ptr_lhs_cast = 0, $sub_ptr_rhs_cast = 0, $sub_ptr_sub = 0, $add_ptr30 = 0, $add_ptr30_sum = 0, $head31 = 0, $14 = 0, $15 = 0, $and32 = 0, $or33 = 0, $head34 = 0, $prev_foot = 0, $shr = 0, $cmp36 = 0, $shl = 0, $arrayidx = 0, $16 = 0, $17 = 0, $shl39 = 0, $and40 = 0, $tobool = 0, $or44 = 0, $arrayidx_sum10 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $cmp46 = 0, $F_0 = 0, $arrayidx_sum = 0, $22 = 0, $bk = 0, $fd54 = 0, $bk55 = 0, $23 = 0, $shr58 = 0, $cmp59 = 0, $cmp63 = 0, $sub67 = 0, $shr68 = 0, $and69 = 0, $shl70 = 0, $sub71 = 0, $shr72 = 0, $and73 = 0, $add74 = 0, $shl75 = 0, $sub76 = 0, $shr77 = 0, $and78 = 0, $add79 = 0, $sub80 = 0, $shl81 = 0, $shr82 = 0, $add83 = 0, $shl84 = 0, $add85 = 0, $shr86 = 0, $and87 = 0, $add88 = 0, $I57_0 = 0, $arrayidx91 = 0, $index = 0, $I57_0_c = 0, $arrayidx92 = 0, $24 = 0, $25 = 0, $shl95 = 0, $and96 = 0, $tobool97 = 0, $or101 = 0, $parent = 0, $_c = 0, $bk102 = 0, $fd103 = 0, $26 = 0, $cmp106 = 0, $shr110 = 0, $sub113 = 0, $cond115 = 0, $shl116 = 0, $T_0 = 0, $K105_0 = 0, $head118 = 0, $27 = 0, $and119 = 0, $cmp120 = 0, $shr123 = 0, $arrayidx126 = 0, $28 = 0, $cmp128 = 0, $shl127 = 0, $29 = 0, $30 = 0, $cmp133 = 0, $parent138 = 0, $T_0_c7 = 0, $bk139 = 0, $fd140 = 0, $fd145 = 0, $31 = 0, $32 = 0, $33 = 0, $cmp147 = 0, $34 = 0, $cmp150 = 0, $bk155 = 0, $fd157 = 0, $_c6 = 0, $bk158 = 0, $T_0_c = 0, $parent159 = 0, label = 0;
  label = 2;
  while (1) switch (label | 0) {
   case 2:
    $0 = HEAP32[96] | 0;
    $1 = $0;
    $call = _segment_holding($1) | 0;
    $base = $call | 0;
    $2 = HEAP32[$base >> 2] | 0;
    $size = $call + 4 | 0;
    $3 = HEAP32[$size >> 2] | 0;
    $add_ptr = $2 + $3 | 0;
    $add_ptr_sum = $3 - 47 | 0;
    $add_ptr2_sum = $3 - 39 | 0;
    $add_ptr3 = $2 + $add_ptr2_sum | 0;
    $4 = $add_ptr3;
    $and = $4 & 7;
    $cmp = ($and | 0) == 0;
    if ($cmp) {
      $cond = 0;
      label = 4;
      break;
    } else {
      label = 3;
      break;
    }
   case 3:
    $5 = -$4 | 0;
    $and6 = $5 & 7;
    $cond = $and6;
    label = 4;
    break;
   case 4:
    $add_ptr2_sum1 = $add_ptr_sum + $cond | 0;
    $add_ptr7 = $2 + $add_ptr2_sum1 | 0;
    $add_ptr82 = $0 + 16 | 0;
    $add_ptr8 = $add_ptr82;
    $cmp9 = $add_ptr7 >>> 0 < $add_ptr8 >>> 0;
    $cond13 = $cmp9 ? $1 : $add_ptr7;
    $add_ptr14 = $cond13 + 8 | 0;
    $6 = $add_ptr14;
    $7 = $tbase;
    $sub16 = $tsize - 40 | 0;
    _init_top($7, $sub16);
    $head = $cond13 + 4 | 0;
    $8 = $head;
    HEAP32[$8 >> 2] = 27;
    HEAP32[$add_ptr14 >> 2] = HEAP32[202] | 0;
    HEAP32[$add_ptr14 + 4 >> 2] = HEAP32[812 >> 2] | 0;
    HEAP32[$add_ptr14 + 8 >> 2] = HEAP32[816 >> 2] | 0;
    HEAP32[$add_ptr14 + 12 >> 2] = HEAP32[820 >> 2] | 0;
    HEAP32[202] = $tbase;
    HEAP32[203] = $tsize;
    HEAP32[205] = 0;
    HEAP32[204] = $6;
    $add_ptr2412 = $cond13 + 28 | 0;
    $9 = $add_ptr2412;
    HEAP32[$9 >> 2] = 7;
    $10 = $cond13 + 32 | 0;
    $cmp2713 = $10 >>> 0 < $add_ptr >>> 0;
    if ($cmp2713) {
      $add_ptr2414 = $9;
      label = 5;
      break;
    } else {
      label = 6;
      break;
    }
   case 5:
    $11 = $add_ptr2414 + 4 | 0;
    HEAP32[$11 >> 2] = 7;
    $12 = $add_ptr2414 + 8 | 0;
    $13 = $12;
    $cmp27 = $13 >>> 0 < $add_ptr >>> 0;
    if ($cmp27) {
      $add_ptr2414 = $11;
      label = 5;
      break;
    } else {
      label = 6;
      break;
    }
   case 6:
    $cmp28 = ($cond13 | 0) == ($1 | 0);
    if ($cmp28) {
      label = 30;
      break;
    } else {
      label = 7;
      break;
    }
   case 7:
    $sub_ptr_lhs_cast = $cond13;
    $sub_ptr_rhs_cast = $0;
    $sub_ptr_sub = $sub_ptr_lhs_cast - $sub_ptr_rhs_cast | 0;
    $add_ptr30 = $1 + $sub_ptr_sub | 0;
    $add_ptr30_sum = $sub_ptr_sub + 4 | 0;
    $head31 = $1 + $add_ptr30_sum | 0;
    $14 = $head31;
    $15 = HEAP32[$14 >> 2] | 0;
    $and32 = $15 & -2;
    HEAP32[$14 >> 2] = $and32;
    $or33 = $sub_ptr_sub | 1;
    $head34 = $0 + 4 | 0;
    HEAP32[$head34 >> 2] = $or33;
    $prev_foot = $add_ptr30;
    HEAP32[$prev_foot >> 2] = $sub_ptr_sub;
    $shr = $sub_ptr_sub >>> 3;
    $cmp36 = $sub_ptr_sub >>> 0 < 256;
    if ($cmp36) {
      label = 8;
      break;
    } else {
      label = 13;
      break;
    }
   case 8:
    $shl = $shr << 1;
    $arrayidx = 400 + ($shl << 2) | 0;
    $16 = $arrayidx;
    $17 = HEAP32[90] | 0;
    $shl39 = 1 << $shr;
    $and40 = $17 & $shl39;
    $tobool = ($and40 | 0) == 0;
    if ($tobool) {
      label = 9;
      break;
    } else {
      label = 10;
      break;
    }
   case 9:
    $or44 = $17 | $shl39;
    HEAP32[90] = $or44;
    $F_0 = $16;
    label = 12;
    break;
   case 10:
    $arrayidx_sum10 = $shl + 2 | 0;
    $18 = 400 + ($arrayidx_sum10 << 2) | 0;
    $19 = HEAP32[$18 >> 2] | 0;
    $20 = $19;
    $21 = HEAP32[94] | 0;
    $cmp46 = $20 >>> 0 < $21 >>> 0;
    if ($cmp46) {
      label = 11;
      break;
    } else {
      $F_0 = $19;
      label = 12;
      break;
    }
   case 11:
    _abort();
   case 12:
    $arrayidx_sum = $shl + 2 | 0;
    $22 = 400 + ($arrayidx_sum << 2) | 0;
    HEAP32[$22 >> 2] = $0;
    $bk = $F_0 + 12 | 0;
    HEAP32[$bk >> 2] = $0;
    $fd54 = $0 + 8 | 0;
    HEAP32[$fd54 >> 2] = $F_0;
    $bk55 = $0 + 12 | 0;
    HEAP32[$bk55 >> 2] = $16;
    label = 30;
    break;
   case 13:
    $23 = $0;
    $shr58 = $sub_ptr_sub >>> 8;
    $cmp59 = ($shr58 | 0) == 0;
    if ($cmp59) {
      $I57_0 = 0;
      label = 16;
      break;
    } else {
      label = 14;
      break;
    }
   case 14:
    $cmp63 = $sub_ptr_sub >>> 0 > 16777215;
    if ($cmp63) {
      $I57_0 = 31;
      label = 16;
      break;
    } else {
      label = 15;
      break;
    }
   case 15:
    $sub67 = $shr58 + 1048320 | 0;
    $shr68 = $sub67 >>> 16;
    $and69 = $shr68 & 8;
    $shl70 = $shr58 << $and69;
    $sub71 = $shl70 + 520192 | 0;
    $shr72 = $sub71 >>> 16;
    $and73 = $shr72 & 4;
    $add74 = $and73 | $and69;
    $shl75 = $shl70 << $and73;
    $sub76 = $shl75 + 245760 | 0;
    $shr77 = $sub76 >>> 16;
    $and78 = $shr77 & 2;
    $add79 = $add74 | $and78;
    $sub80 = 14 - $add79 | 0;
    $shl81 = $shl75 << $and78;
    $shr82 = $shl81 >>> 15;
    $add83 = $sub80 + $shr82 | 0;
    $shl84 = $add83 << 1;
    $add85 = $add83 + 7 | 0;
    $shr86 = $sub_ptr_sub >>> ($add85 >>> 0);
    $and87 = $shr86 & 1;
    $add88 = $and87 | $shl84;
    $I57_0 = $add88;
    label = 16;
    break;
   case 16:
    $arrayidx91 = 664 + ($I57_0 << 2) | 0;
    $index = $0 + 28 | 0;
    $I57_0_c = $I57_0;
    HEAP32[$index >> 2] = $I57_0_c;
    $arrayidx92 = $0 + 20 | 0;
    HEAP32[$arrayidx92 >> 2] = 0;
    $24 = $0 + 16 | 0;
    HEAP32[$24 >> 2] = 0;
    $25 = HEAP32[91] | 0;
    $shl95 = 1 << $I57_0;
    $and96 = $25 & $shl95;
    $tobool97 = ($and96 | 0) == 0;
    if ($tobool97) {
      label = 17;
      break;
    } else {
      label = 18;
      break;
    }
   case 17:
    $or101 = $25 | $shl95;
    HEAP32[91] = $or101;
    HEAP32[$arrayidx91 >> 2] = $23;
    $parent = $0 + 24 | 0;
    $_c = $arrayidx91;
    HEAP32[$parent >> 2] = $_c;
    $bk102 = $0 + 12 | 0;
    HEAP32[$bk102 >> 2] = $0;
    $fd103 = $0 + 8 | 0;
    HEAP32[$fd103 >> 2] = $0;
    label = 30;
    break;
   case 18:
    $26 = HEAP32[$arrayidx91 >> 2] | 0;
    $cmp106 = ($I57_0 | 0) == 31;
    if ($cmp106) {
      $cond115 = 0;
      label = 20;
      break;
    } else {
      label = 19;
      break;
    }
   case 19:
    $shr110 = $I57_0 >>> 1;
    $sub113 = 25 - $shr110 | 0;
    $cond115 = $sub113;
    label = 20;
    break;
   case 20:
    $shl116 = $sub_ptr_sub << $cond115;
    $K105_0 = $shl116;
    $T_0 = $26;
    label = 21;
    break;
   case 21:
    $head118 = $T_0 + 4 | 0;
    $27 = HEAP32[$head118 >> 2] | 0;
    $and119 = $27 & -8;
    $cmp120 = ($and119 | 0) == ($sub_ptr_sub | 0);
    if ($cmp120) {
      label = 26;
      break;
    } else {
      label = 22;
      break;
    }
   case 22:
    $shr123 = $K105_0 >>> 31;
    $arrayidx126 = $T_0 + 16 + ($shr123 << 2) | 0;
    $28 = HEAP32[$arrayidx126 >> 2] | 0;
    $cmp128 = ($28 | 0) == 0;
    $shl127 = $K105_0 << 1;
    if ($cmp128) {
      label = 23;
      break;
    } else {
      $K105_0 = $shl127;
      $T_0 = $28;
      label = 21;
      break;
    }
   case 23:
    $29 = $arrayidx126;
    $30 = HEAP32[94] | 0;
    $cmp133 = $29 >>> 0 < $30 >>> 0;
    if ($cmp133) {
      label = 25;
      break;
    } else {
      label = 24;
      break;
    }
   case 24:
    HEAP32[$arrayidx126 >> 2] = $23;
    $parent138 = $0 + 24 | 0;
    $T_0_c7 = $T_0;
    HEAP32[$parent138 >> 2] = $T_0_c7;
    $bk139 = $0 + 12 | 0;
    HEAP32[$bk139 >> 2] = $0;
    $fd140 = $0 + 8 | 0;
    HEAP32[$fd140 >> 2] = $0;
    label = 30;
    break;
   case 25:
    _abort();
   case 26:
    $fd145 = $T_0 + 8 | 0;
    $31 = HEAP32[$fd145 >> 2] | 0;
    $32 = $T_0;
    $33 = HEAP32[94] | 0;
    $cmp147 = $32 >>> 0 < $33 >>> 0;
    if ($cmp147) {
      label = 29;
      break;
    } else {
      label = 27;
      break;
    }
   case 27:
    $34 = $31;
    $cmp150 = $34 >>> 0 < $33 >>> 0;
    if ($cmp150) {
      label = 29;
      break;
    } else {
      label = 28;
      break;
    }
   case 28:
    $bk155 = $31 + 12 | 0;
    HEAP32[$bk155 >> 2] = $23;
    HEAP32[$fd145 >> 2] = $23;
    $fd157 = $0 + 8 | 0;
    $_c6 = $31;
    HEAP32[$fd157 >> 2] = $_c6;
    $bk158 = $0 + 12 | 0;
    $T_0_c = $T_0;
    HEAP32[$bk158 >> 2] = $T_0_c;
    $parent159 = $0 + 24 | 0;
    HEAP32[$parent159 >> 2] = 0;
    label = 30;
    break;
   case 29:
    _abort();
   case 30:
    return;
  }
}
function _strlen(ptr) {
  ptr = ptr | 0;
  var curr = 0;
  curr = ptr;
  while (HEAP8[curr] | 0) {
    curr = curr + 1 | 0;
  }
  return curr - ptr | 0;
}
function _memcpy(dest, src, num) {
  dest = dest | 0;
  src = src | 0;
  num = num | 0;
  var ret = 0;
  ret = dest | 0;
  if ((dest & 3) == (src & 3)) {
    while (dest & 3) {
      if ((num | 0) == 0) return ret | 0;
      HEAP8[dest] = HEAP8[src] | 0;
      dest = dest + 1 | 0;
      src = src + 1 | 0;
      num = num - 1 | 0;
    }
    while ((num | 0) >= 4) {
      HEAP32[dest >> 2] = HEAP32[src >> 2] | 0;
      dest = dest + 4 | 0;
      src = src + 4 | 0;
      num = num - 4 | 0;
    }
  }
  while ((num | 0) > 0) {
    HEAP8[dest] = HEAP8[src] | 0;
    dest = dest + 1 | 0;
    src = src + 1 | 0;
    num = num - 1 | 0;
  }
  return ret | 0;
}
function _memset(ptr, value, num) {
  ptr = ptr | 0;
  value = value | 0;
  num = num | 0;
  var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
  stop = ptr + num | 0;
  if ((num | 0) >= 20) {
    value = value & 255;
    unaligned = ptr & 3;
    value4 = value | value << 8 | value << 16 | value << 24;
    stop4 = stop & ~3;
    if (unaligned) {
      unaligned = ptr + 4 - unaligned | 0;
      while ((ptr | 0) < (unaligned | 0)) {
        HEAP8[ptr] = value;
        ptr = ptr + 1 | 0;
      }
    }
    while ((ptr | 0) < (stop4 | 0)) {
      HEAP32[ptr >> 2] = value4;
      ptr = ptr + 4 | 0;
    }
  }
  while ((ptr | 0) < (stop | 0)) {
    HEAP8[ptr] = value;
    ptr = ptr + 1 | 0;
  }
}
function dynCall_ii(index, a1) {
  index = index | 0;
  a1 = a1 | 0;
  return FUNCTION_TABLE_ii[index & 1](a1 | 0) | 0;
}
function dynCall_v(index) {
  index = index | 0;
  FUNCTION_TABLE_v[index & 1]();
}
function dynCall_iii(index, a1, a2) {
  index = index | 0;
  a1 = a1 | 0;
  a2 = a2 | 0;
  return FUNCTION_TABLE_iii[index & 1](a1 | 0, a2 | 0) | 0;
}
function dynCall_vi(index, a1) {
  index = index | 0;
  a1 = a1 | 0;
  FUNCTION_TABLE_vi[index & 1](a1 | 0);
}
function b0(p0) {
  p0 = p0 | 0;
  abort(0);
  return 0;
}
function b1() {
  abort(1);
}
function b2(p0, p1) {
  p0 = p0 | 0;
  p1 = p1 | 0;
  abort(2);
  return 0;
}
function b3(p0) {
  p0 = p0 | 0;
  abort(3);
}
// EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_ii = [b0,b0];
  var FUNCTION_TABLE_v = [b1,b1];
  var FUNCTION_TABLE_iii = [b2,b2];
  var FUNCTION_TABLE_vi = [b3,b3];
  return { _strlen: _strlen, _jsGetNewSegment: _jsGetNewSegment, _decreaseSynapsePermanence: _decreaseSynapsePermanence, _jsGetColumnFromRegion: _jsGetColumnFromRegion, _wasSynapseActive: _wasSynapseActive, _performTemporalPooling: _performTemporalPooling, _getColumnPredictions: _getColumnPredictions, _jsSetCellWasLearning: _jsSetCellWasLearning, _jsIsSynapseConnected: _jsIsSynapseConnected, _newRegion: _newRegion, _jsGetSynapseInputSource: _jsGetSynapseInputSource, _wasSegmentActiveFromLearning: _wasSegmentActiveFromLearning, _performSpatialPooling: _performSpatialPooling, _jsUpdateSynapseConnected: _jsUpdateSynapseConnected, _jsGetRegionInhibitionRadius: _jsGetRegionInhibitionRadius, _jsSetDataArr: _jsSetDataArr, _increaseSynapsePermanence: _increaseSynapsePermanence, _jsSetCellWasActive: _jsSetCellWasActive, _jsGetCellIsActive: _jsGetCellIsActive, _wasSynapseActiveFromLearning: _wasSynapseActiveFromLearning, _numRegionActiveColumns: _numRegionActiveColumns, _memset: _memset, _isSynapseActive: _isSynapseActive, _jsGetCellIsLearning: _jsGetCellIsLearning, _jsGetNewCell: _jsGetNewCell, _memcpy: _memcpy, _jsGetSegNumActiveAllSyns: _jsGetSegNumActiveAllSyns, _jsGetSegmentFromCell: _jsGetSegmentFromCell, _jsGetSegNumPrevActiveConnectedSyns: _jsGetSegNumPrevActiveConnectedSyns, _jsGetCellWasLearning: _jsGetCellWasLearning, _runOnce: _runOnce, _jsGetRegionNumColumns: _jsGetRegionNumColumns, _deleteRegion: _deleteRegion, _nextSegmentTimeStep: _nextSegmentTimeStep, _jsGetNewSynapse: _jsGetNewSynapse, _jsSetRegionTemporalLearning: _jsSetRegionTemporalLearning, _initSegment: _initSegment, _jsGetCellFromColumn: _jsGetCellFromColumn, _initSynapse: _initSynapse, _jsGetSynapseFromSegment: _jsGetSynapseFromSegment, _processSegment: _processSegment, _newRegionHardcoded: _newRegionHardcoded, _free: _free, _createSynapse: _createSynapse, _jsGetSegNumActiveConnectedSyns: _jsGetSegNumActiveConnectedSyns, _jsGetSegWasActive: _jsGetSegWasActive, _getLastAccuracy: _getLastAccuracy, _jsGetColumnIsActive: _jsGetColumnIsActive, _deleteSegment: _deleteSegment, _malloc: _malloc, _jsGetCellNumSegments: _jsGetCellNumSegments, _jsGetSegIsActive: _jsGetSegIsActive, _jsGetFloatItemFromArray: _jsGetFloatItemFromArray, _updateSegmentPermanences: _updateSegmentPermanences, _jsGetCellWasActive: _jsGetCellWasActive, _jsGetSegNumSyns: _jsGetSegNumSyns, _realloc: _realloc, _numRegionSegments: _numRegionSegments, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, setTempRet1: setTempRet1, setTempRet2: setTempRet2, setTempRet3: setTempRet3, setTempRet4: setTempRet4, setTempRet5: setTempRet5, setTempRet6: setTempRet6, setTempRet7: setTempRet7, setTempRet8: setTempRet8, setTempRet9: setTempRet9, dynCall_ii: dynCall_ii, dynCall_v: dynCall_v, dynCall_iii: dynCall_iii, dynCall_vi: dynCall_vi };
})
// EMSCRIPTEN_END_ASM
({ Math: Math, Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array, Uint8Array: Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array, Float32Array: Float32Array, Float64Array: Float64Array }, { abort: abort, assert: assert, asmPrintInt: asmPrintInt, asmPrintFloat: asmPrintFloat, copyTempDouble: copyTempDouble, copyTempFloat: copyTempFloat, min: Math_min, invoke_ii: invoke_ii, invoke_v: invoke_v, invoke_iii: invoke_iii, invoke_vi: invoke_vi, _rand: _rand, _pwrite: _pwrite, _sbrk: _sbrk, _sysconf: _sysconf, _fmax: _fmax, _fwrite: _fwrite, __reallyNegative: __reallyNegative, _time: _time, __formatString: __formatString, _sqrt: _sqrt, _write: _write, ___setErrNo: ___setErrNo, _abort: _abort, _fprintf: _fprintf, _printf: _printf, ___errno_location: ___errno_location, _round: _round, STACKTOP: STACKTOP, STACK_MAX: STACK_MAX, tempDoublePtr: tempDoublePtr, ABORT: ABORT, NaN: NaN, Infinity: Infinity }, buffer);
var _strlen = Module["_strlen"] = asm._strlen;
var _jsGetNewSegment = Module["_jsGetNewSegment"] = asm._jsGetNewSegment;
var _decreaseSynapsePermanence = Module["_decreaseSynapsePermanence"] = asm._decreaseSynapsePermanence;
var _jsGetColumnFromRegion = Module["_jsGetColumnFromRegion"] = asm._jsGetColumnFromRegion;
var _wasSynapseActive = Module["_wasSynapseActive"] = asm._wasSynapseActive;
var _performTemporalPooling = Module["_performTemporalPooling"] = asm._performTemporalPooling;
var _getColumnPredictions = Module["_getColumnPredictions"] = asm._getColumnPredictions;
var _jsSetCellWasLearning = Module["_jsSetCellWasLearning"] = asm._jsSetCellWasLearning;
var _jsIsSynapseConnected = Module["_jsIsSynapseConnected"] = asm._jsIsSynapseConnected;
var _newRegion = Module["_newRegion"] = asm._newRegion;
var _jsGetSynapseInputSource = Module["_jsGetSynapseInputSource"] = asm._jsGetSynapseInputSource;
var _wasSegmentActiveFromLearning = Module["_wasSegmentActiveFromLearning"] = asm._wasSegmentActiveFromLearning;
var _performSpatialPooling = Module["_performSpatialPooling"] = asm._performSpatialPooling;
var _jsUpdateSynapseConnected = Module["_jsUpdateSynapseConnected"] = asm._jsUpdateSynapseConnected;
var _jsGetRegionInhibitionRadius = Module["_jsGetRegionInhibitionRadius"] = asm._jsGetRegionInhibitionRadius;
var _jsSetDataArr = Module["_jsSetDataArr"] = asm._jsSetDataArr;
var _increaseSynapsePermanence = Module["_increaseSynapsePermanence"] = asm._increaseSynapsePermanence;
var _jsSetCellWasActive = Module["_jsSetCellWasActive"] = asm._jsSetCellWasActive;
var _jsGetCellIsActive = Module["_jsGetCellIsActive"] = asm._jsGetCellIsActive;
var _wasSynapseActiveFromLearning = Module["_wasSynapseActiveFromLearning"] = asm._wasSynapseActiveFromLearning;
var _numRegionActiveColumns = Module["_numRegionActiveColumns"] = asm._numRegionActiveColumns;
var _memset = Module["_memset"] = asm._memset;
var _isSynapseActive = Module["_isSynapseActive"] = asm._isSynapseActive;
var _jsGetCellIsLearning = Module["_jsGetCellIsLearning"] = asm._jsGetCellIsLearning;
var _jsGetNewCell = Module["_jsGetNewCell"] = asm._jsGetNewCell;
var _memcpy = Module["_memcpy"] = asm._memcpy;
var _jsGetSegNumActiveAllSyns = Module["_jsGetSegNumActiveAllSyns"] = asm._jsGetSegNumActiveAllSyns;
var _jsGetSegmentFromCell = Module["_jsGetSegmentFromCell"] = asm._jsGetSegmentFromCell;
var _jsGetSegNumPrevActiveConnectedSyns = Module["_jsGetSegNumPrevActiveConnectedSyns"] = asm._jsGetSegNumPrevActiveConnectedSyns;
var _jsGetCellWasLearning = Module["_jsGetCellWasLearning"] = asm._jsGetCellWasLearning;
var _runOnce = Module["_runOnce"] = asm._runOnce;
var _jsGetRegionNumColumns = Module["_jsGetRegionNumColumns"] = asm._jsGetRegionNumColumns;
var _deleteRegion = Module["_deleteRegion"] = asm._deleteRegion;
var _nextSegmentTimeStep = Module["_nextSegmentTimeStep"] = asm._nextSegmentTimeStep;
var _jsGetNewSynapse = Module["_jsGetNewSynapse"] = asm._jsGetNewSynapse;
var _jsSetRegionTemporalLearning = Module["_jsSetRegionTemporalLearning"] = asm._jsSetRegionTemporalLearning;
var _initSegment = Module["_initSegment"] = asm._initSegment;
var _jsGetCellFromColumn = Module["_jsGetCellFromColumn"] = asm._jsGetCellFromColumn;
var _initSynapse = Module["_initSynapse"] = asm._initSynapse;
var _jsGetSynapseFromSegment = Module["_jsGetSynapseFromSegment"] = asm._jsGetSynapseFromSegment;
var _processSegment = Module["_processSegment"] = asm._processSegment;
var _newRegionHardcoded = Module["_newRegionHardcoded"] = asm._newRegionHardcoded;
var _free = Module["_free"] = asm._free;
var _createSynapse = Module["_createSynapse"] = asm._createSynapse;
var _jsGetSegNumActiveConnectedSyns = Module["_jsGetSegNumActiveConnectedSyns"] = asm._jsGetSegNumActiveConnectedSyns;
var _jsGetSegWasActive = Module["_jsGetSegWasActive"] = asm._jsGetSegWasActive;
var _getLastAccuracy = Module["_getLastAccuracy"] = asm._getLastAccuracy;
var _jsGetColumnIsActive = Module["_jsGetColumnIsActive"] = asm._jsGetColumnIsActive;
var _deleteSegment = Module["_deleteSegment"] = asm._deleteSegment;
var _malloc = Module["_malloc"] = asm._malloc;
var _jsGetCellNumSegments = Module["_jsGetCellNumSegments"] = asm._jsGetCellNumSegments;
var _jsGetSegIsActive = Module["_jsGetSegIsActive"] = asm._jsGetSegIsActive;
var _jsGetFloatItemFromArray = Module["_jsGetFloatItemFromArray"] = asm._jsGetFloatItemFromArray;
var _updateSegmentPermanences = Module["_updateSegmentPermanences"] = asm._updateSegmentPermanences;
var _jsGetCellWasActive = Module["_jsGetCellWasActive"] = asm._jsGetCellWasActive;
var _jsGetSegNumSyns = Module["_jsGetSegNumSyns"] = asm._jsGetSegNumSyns;
var _realloc = Module["_realloc"] = asm._realloc;
var _numRegionSegments = Module["_numRegionSegments"] = asm._numRegionSegments;
var dynCall_ii = Module["dynCall_ii"] = asm.dynCall_ii;
var dynCall_v = Module["dynCall_v"] = asm.dynCall_v;
var dynCall_iii = Module["dynCall_iii"] = asm.dynCall_iii;
var dynCall_vi = Module["dynCall_vi"] = asm.dynCall_vi;
Runtime.stackAlloc = function(size) { return asm.stackAlloc(size) };
Runtime.stackSave = function() { return asm.stackSave() };
Runtime.stackRestore = function(top) { asm.stackRestore(top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(!Module['preRun'] || Module['preRun'].length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  var ret;
  var initialStackTop = STACKTOP;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e.name == 'ExitStatus') {
      return e.status;
    } else if (e == 'SimulateInfiniteLoop') {
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    STACKTOP = initialStackTop;
  }
  return ret;
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return 0;
  }
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    var toRun = Module['preRun'];
    Module['preRun'] = [];
    for (var i = toRun.length-1; i >= 0; i--) {
      toRun[i]();
    }
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return 0;
    }
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    var ret = 0;
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      ret = Module.callMain(args);
      if (!Module['noExitRuntime']) {
        exitRuntime();
      }
    }
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length > 0) {
        Module['postRun'].pop()();
      }
    }
    return ret;
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
    return 0;
  } else {
    return doRun();
  }
}
Module['run'] = Module.run = run;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}
function getNewCell(isActive, wasActive, isLearning, wasLearning) {
	return Module.ccall('jsGetNewCell', 'number', ['number', 'number', 'number', 'number'], [isActive, wasActive, isLearning, wasLearning]);
}

function getNewSynapse() {
	return Module.ccall('jsGetNewSynapse', 'number');
}

function isSynapseConnected(syn) {
	return Module.ccall('jsIsSynapseConnected', 'number', ['number'], [syn]);
}

function updateSynapseConnected(syn) {
	return Module.ccall('jsUpdateSynapseConnected', 'number', ['number'], [syn]);
}

function initSynapse(syn, inputSource, permanence) {
	return Module.ccall('initSynapse', 'number', ['number', 'number', 'number'], [syn, inputSource, permanence]);
}

function isSynapseActive(syn, connectedOnly) {
	return Module.ccall('isSynapseActive', 'number', ['number', 'number'], [syn, connectedOnly]);
}

function wasSynapseActive(syn, connectedOnly) {
	return Module.ccall('wasSynapseActive', 'number', ['number', 'number'], [syn, connectedOnly]);
}

function wasSynapseActiveFromLearning(syn) {
	return Module.ccall('wasSynapseActiveFromLearning', 'number', ['number'], [syn]);
}

function increaseSynapsePermanence(syn, amount) {
	return Module.ccall('increaseSynapsePermanence', 'number', ['number', 'number'], [syn, amount]);
}

function decreaseSynapsePermanence(syn, amount) {
	return Module.ccall('decreaseSynapsePermanence', 'number', ['number', 'number'], [syn, amount]);
}

function getNewSegment() {
	return Module.ccall('jsGetNewSegment', 'number');
}

function initSegment(seg, segActiveThreshold) {
	return Module.ccall('initSegment', 'number', ['number', 'number'], [seg, segActiveThreshold]);
}

function createSynapse(seg, inputSource, initPerm) {
	return Module.ccall('createSynapse', 'number', ['number', 'number', 'number'], [seg, inputSource, initPerm]);
}

function processSegment(seg) {
	return Module.ccall('processSegment', 'number', ['number'], [seg]);
}

function updateSegmentPermanences(seg, increase) {
	return Module.ccall('updateSegmentPermanences', 'number', ['number', 'number'], [seg, increase]);
}

function nextSegmentTimeStep(seg) {
	return Module.ccall('nextSegmentTimeStep', 'number', ['number'], [seg]);
}

function wasSegmentActiveFromLearning(seg) {
	return Module.ccall('wasSegmentActiveFromLearning', 'number', ['number'], [seg]);
}

function deleteSegment(seg) {
	return Module.ccall('deleteSegment', 'number', ['number'], [seg]);
}

function getSegmentInfo(seg) {
	var info = {
		numActiveConnectedSyns: Module.ccall('jsGetSegNumActiveConnectedSyns', 'number', ['number'], [seg]),
		numActiveAllSyns: Module.ccall('jsGetSegNumActiveAllSyns', 'number', ['number'], [seg]),
		isActive: Module.ccall('jsGetSegIsActive', 'number', ['number'], [seg]),
		numPrevActiveConnectedSyns: Module.ccall('jsGetSegNumPrevActiveConnectedSyns', 'number', ['number'], [seg]),
		wasActive: Module.ccall('jsGetSegWasActive', 'number', ['number'], [seg]),
		numSynapses: Module.ccall('jsGetSegNumSyns', 'number', ['number'], [seg])
	}
	return info;
}

function setCellWasActive(cell, wasActive) {
	return Module.ccall('jsSetCellWasActive', 'number', ['number', 'number'], [cell, wasActive]);
}

function setCellWasLearning(cell, wasLearning) {
	return Module.ccall('jsSetCellWasLearning', 'number', ['number', 'number'], [cell, wasLearning]);
}

function getCellWasActive(cell) {
	return Module.ccall('jsGetCellWasActive', 'number', ['number'], [cell]);
}

function getCellWasLearning(cell) {
	return Module.ccall('jsGetCellWasLearning', 'number', ['number'], [cell]);
}

function getCellIsActive(cell) {
	return Module.ccall('jsGetCellIsActive', 'number', ['number'], [cell]);
}

function getCellIsLearning(cell) {
	return Module.ccall('jsGetCellIsLearning', 'number', ['number'], [cell]);
}

// allocate and copy data to heap, return pointer
function allocateData(data) {
	if(!(data instanceof Uint8Array)) {
		data = new Uint8Array(data);
	}
	var buf = Module._malloc(data.length * 4);
	Module.HEAPU8.set(data, buf);
	return buf;
}

// set data at buf pointer to new data
function setData(buf, data) {
	if(!(data instanceof Uint8Array)) {
		data = new Uint8Array(data);
	}
	Module.HEAPU8.set(data, buf);
}

function getDataFloat(buf, length) {
	var data = [];
	for(var i=0; i<length; i++) {
		data.push(getFloatItemFromArray(buf, i));
	}
	return data;
}

function getData(buf, length) {
	return Module.HEAPU8.subarray(buf, buf + length);
}

function newRegionHardcoded(inputSizeX, inputSizeY, localityRadius,
    cellsPerCol, segActiveThreshold, newSynapseCount, inputData) {
	return Module.ccall('newRegionHardcoded', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number'], [inputSizeX, inputSizeY, localityRadius, cellsPerCol, segActiveThreshold, newSynapseCount, inputData]);
}

function newRegion(inputSizeX, inputSizeY, colGridSizeX, colGridSizeY,
    pctInputPerCol, pctMinOverlap, localityRadius,
    pctLocalActivity, cellsPerCol, segActiveThreshold,
    newSynapseCount, inputData) {
	return Module.ccall('newRegion', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'], [inputSizeX, inputSizeY, colGridSizeX, colGridSizeY,
    pctInputPerCol, pctMinOverlap, localityRadius,
    pctLocalActivity, cellsPerCol, segActiveThreshold,
    newSynapseCount, inputData]);
}

function getColumnFromRegion(region, columnNr) {
	return Module.ccall('jsGetColumnFromRegion', 'number', ['number', 'number'], [region, columnNr]);
}

function getCellFromColumn(column, cellNr) {
	return Module.ccall('jsGetCellFromColumn', 'number', ['number', 'number'], [column, cellNr]);
}

function getSegmentFromCell(cell, segNr) {
	return Module.ccall('jsGetSegmentFromCell', 'number', ['number', 'number'], [cell, segNr]);
}

function getSynapseFromSegment(seg, synNr) {
	return Module.ccall('jsGetSynapseFromSegment', 'number', ['number', 'number'], [seg, synNr]);
}

function getColumnIsActive(column) {
	return Module.ccall('jsGetColumnIsActive', 'number', ['number'], [column]);
}

function getCellNumSegments(cell) {
	return Module.ccall('jsGetCellNumSegments', 'number', ['number'], [cell]);
}

function getSynapseInputSource(syn) {
	return Module.ccall('jsGetSynapseInputSource', 'number', ['number'], [syn]);
}

function performSpatialPooling(region) {
	return Module.ccall('performSpatialPooling', 'number', ['number'], [region]);	
}

function performTemporalPooling(region) {
	return Module.ccall('performTemporalPooling', 'number', ['number'], [region]);	
}

function runOnce(region) {
	return Module.ccall('runOnce', 'number', ['number'], [region]);	
}

function deleteRegion(reg) {
	return Module.ccall('deleteRegion', 'number', ['number'], [reg]);
}

function getLastAccuracy(region, result) {
	return Module.ccall('getLastAccuracy', 'number', ['number', 'number'], [region, result]);
}

function getFloatItemFromArray(arr, item) {
	return Module.ccall('jsGetFloatItemFromArray', 'number', ['number', 'number'], [arr, item]);	
}

function setRegionTemporalLearning(region, value) {
	return Module.ccall('jsSetRegionTemporalLearning', 'number', ['number', 'number'], [region, value]);
}

function numRegionActiveColumns(reg) {
	return Module.ccall('numRegionActiveColumns', 'number', ['number'], [reg]);
}

function getRegionNumColumns(reg) {
	return Module.ccall('jsGetRegionNumColumns', 'number', ['number'], [reg]);
}

function getRegionInhibitionRadius(reg) {
	return Module.ccall('jsGetRegionInhibitionRadius', 'number', ['number'], [reg]);
}

function getColumnPredictions(region, outData) {
	return Module.ccall('getColumnPredictions', 'number', ['number', 'number'], [region, outData]);
}

function printArr(arr) {
	for(var i=0; i<arr.length;i++) {
		document.writeln(arr[i]);
	}
}

function setDataArr(ptr, item, value) {
	return Module.ccall('jsSetDataArr', 'number', ['number', 'number', 'number'], [ptr, item, value]);
}

function getRandomInt() {
  return Math.floor(Math.random() * 9999999) + 1;
}
return {
	getNewCell: getNewCell,
	getNewSynapse: getNewSynapse,
	isSynapseConnected: isSynapseConnected,
	updateSynapseConnected: updateSynapseConnected,
	initSynapse: initSynapse,
	isSynapseActive: isSynapseActive,
	wasSynapseActive: wasSynapseActive,
	wasSynapseActiveFromLearning: wasSynapseActiveFromLearning,
	increaseSynapsePermanence: increaseSynapsePermanence,
	decreaseSynapsePermanence: decreaseSynapsePermanence,
	getNewSegment: getNewSegment,
	initSegment: initSegment,
	createSynapse: createSynapse,
	processSegment: processSegment,
	updateSegmentPermanences: updateSegmentPermanences,
	nextSegmentTimeStep: nextSegmentTimeStep,
	wasSegmentActiveFromLearning: wasSegmentActiveFromLearning,
	deleteSegment: deleteSegment,
	getSegmentInfo: getSegmentInfo,
	setCellWasActive: setCellWasActive,
	setCellWasLearning: setCellWasLearning,
	getCellWasActive: getCellWasActive,
	getCellWasLearning: getCellWasLearning,
	getCellIsActive: getCellIsActive,
	getCellIsLearning: getCellIsLearning,
	allocateData: allocateData,
	setData: setData,
	getDataFloat: getDataFloat,
	getData: getData,
	newRegionHardcoded: newRegionHardcoded,
	newRegion: newRegion,
	getColumnFromRegion: getColumnFromRegion,
	getCellFromColumn: getCellFromColumn,
	getSegmentFromCell: getSegmentFromCell,
	getSynapseFromSegment: getSynapseFromSegment,
	getColumnIsActive: getColumnIsActive,
	getCellNumSegments: getCellNumSegments,
	getSynapseInputSource: getSynapseInputSource,
	performSpatialPooling: performSpatialPooling,
	performTemporalPooling: performTemporalPooling,
	runOnce: runOnce,
	deleteRegion: deleteRegion,
	getLastAccuracy: getLastAccuracy,
	getFloatItemFromArray: getFloatItemFromArray,
	setRegionTemporalLearning: setRegionTemporalLearning,
	numRegionActiveColumns: numRegionActiveColumns,
	getRegionNumColumns: getRegionNumColumns,
	getRegionInhibitionRadius: getRegionInhibitionRadius,
	getColumnPredictions: getColumnPredictions,
	printArr: printArr,
	setDataArr: setDataArr,
	getRandomInt: getRandomInt,
	free: Module._free,
	malloc: Module._malloc
};
})();