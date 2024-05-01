import {
  __commonJS,
  __require
} from "./chunk-VBXJIVYU.js";

// ../../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js
var require_react_server_dom_webpack_client_browser_development = __commonJS({
  "../../../node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var ReactDOM = __require("react-dom");
        var React = __require("react");
        var enableBinaryFlight = false;
        function createStringDecoder() {
          return new TextDecoder();
        }
        var decoderOptions = {
          stream: true
        };
        function readPartialStringChunk(decoder, buffer) {
          return decoder.decode(buffer, decoderOptions);
        }
        function readFinalStringChunk(decoder, buffer) {
          return decoder.decode(buffer);
        }
        var ID = 0;
        var CHUNKS = 1;
        var NAME = 2;
        function isAsyncImport(metadata) {
          return metadata.length === 4;
        }
        function resolveClientReference(bundlerConfig, metadata) {
          if (bundlerConfig) {
            var moduleExports = bundlerConfig[metadata[ID]];
            var resolvedModuleData = moduleExports[metadata[NAME]];
            var name;
            if (resolvedModuleData) {
              name = resolvedModuleData.name;
            } else {
              resolvedModuleData = moduleExports["*"];
              if (!resolvedModuleData) {
                throw new Error('Could not find the module "' + metadata[ID] + '" in the React SSR Manifest. This is probably a bug in the React Server Components bundler.');
              }
              name = metadata[NAME];
            }
            if (isAsyncImport(metadata)) {
              return [
                resolvedModuleData.id,
                resolvedModuleData.chunks,
                name,
                1
                /* async */
              ];
            } else {
              return [resolvedModuleData.id, resolvedModuleData.chunks, name];
            }
          }
          return metadata;
        }
        var chunkCache = /* @__PURE__ */ new Map();
        function requireAsyncModule(id) {
          var promise = __webpack_require__(id);
          if (typeof promise.then !== "function") {
            return null;
          } else if (promise.status === "fulfilled") {
            return null;
          } else {
            promise.then(function(value) {
              var fulfilledThenable = promise;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = value;
            }, function(reason) {
              var rejectedThenable = promise;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = reason;
            });
            return promise;
          }
        }
        function ignoreReject() {
        }
        function preloadModule(metadata) {
          var chunks = metadata[CHUNKS];
          var promises = [];
          var i = 0;
          while (i < chunks.length) {
            var chunkId = chunks[i++];
            var chunkFilename = chunks[i++];
            var entry = chunkCache.get(chunkId);
            if (entry === void 0) {
              var thenable = loadChunk(chunkId, chunkFilename);
              promises.push(thenable);
              var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
              thenable.then(resolve, ignoreReject);
              chunkCache.set(chunkId, thenable);
            } else if (entry !== null) {
              promises.push(entry);
            }
          }
          if (isAsyncImport(metadata)) {
            if (promises.length === 0) {
              return requireAsyncModule(metadata[ID]);
            } else {
              return Promise.all(promises).then(function() {
                return requireAsyncModule(metadata[ID]);
              });
            }
          } else if (promises.length > 0) {
            return Promise.all(promises);
          } else {
            return null;
          }
        }
        function requireModule(metadata) {
          var moduleExports = __webpack_require__(metadata[ID]);
          if (isAsyncImport(metadata)) {
            if (typeof moduleExports.then !== "function")
              ;
            else if (moduleExports.status === "fulfilled") {
              moduleExports = moduleExports.value;
            } else {
              throw moduleExports.reason;
            }
          }
          if (metadata[NAME] === "*") {
            return moduleExports;
          }
          if (metadata[NAME] === "") {
            return moduleExports.__esModule ? moduleExports.default : moduleExports;
          }
          return moduleExports[metadata[NAME]];
        }
        var chunkMap = /* @__PURE__ */ new Map();
        var webpackGetChunkFilename = __webpack_require__.u;
        __webpack_require__.u = function(chunkId) {
          var flightChunk = chunkMap.get(chunkId);
          if (flightChunk !== void 0) {
            return flightChunk;
          }
          return webpackGetChunkFilename(chunkId);
        };
        function loadChunk(chunkId, filename) {
          chunkMap.set(chunkId, filename);
          return __webpack_chunk_load__(chunkId);
        }
        var ReactDOMSharedInternals = ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        var ReactDOMCurrentDispatcher = ReactDOMSharedInternals.Dispatcher;
        function dispatchHint(code, model) {
          var dispatcher = ReactDOMCurrentDispatcher.current;
          if (dispatcher) {
            switch (code) {
              case "D": {
                var refined = refineModel(code, model);
                var href = refined;
                dispatcher.prefetchDNS(href);
                return;
              }
              case "C": {
                var _refined = refineModel(code, model);
                if (typeof _refined === "string") {
                  var _href = _refined;
                  dispatcher.preconnect(_href);
                } else {
                  var _href2 = _refined[0];
                  var crossOrigin = _refined[1];
                  dispatcher.preconnect(_href2, crossOrigin);
                }
                return;
              }
              case "L": {
                var _refined2 = refineModel(code, model);
                var _href3 = _refined2[0];
                var as = _refined2[1];
                if (_refined2.length === 3) {
                  var options = _refined2[2];
                  dispatcher.preload(_href3, as, options);
                } else {
                  dispatcher.preload(_href3, as);
                }
                return;
              }
              case "m": {
                var _refined3 = refineModel(code, model);
                if (typeof _refined3 === "string") {
                  var _href4 = _refined3;
                  dispatcher.preloadModule(_href4);
                } else {
                  var _href5 = _refined3[0];
                  var _options = _refined3[1];
                  dispatcher.preloadModule(_href5, _options);
                }
                return;
              }
              case "S": {
                var _refined4 = refineModel(code, model);
                if (typeof _refined4 === "string") {
                  var _href6 = _refined4;
                  dispatcher.preinitStyle(_href6);
                } else {
                  var _href7 = _refined4[0];
                  var precedence = _refined4[1] === 0 ? void 0 : _refined4[1];
                  var _options2 = _refined4.length === 3 ? _refined4[2] : void 0;
                  dispatcher.preinitStyle(_href7, precedence, _options2);
                }
                return;
              }
              case "X": {
                var _refined5 = refineModel(code, model);
                if (typeof _refined5 === "string") {
                  var _href8 = _refined5;
                  dispatcher.preinitScript(_href8);
                } else {
                  var _href9 = _refined5[0];
                  var _options3 = _refined5[1];
                  dispatcher.preinitScript(_href9, _options3);
                }
                return;
              }
              case "M": {
                var _refined6 = refineModel(code, model);
                if (typeof _refined6 === "string") {
                  var _href10 = _refined6;
                  dispatcher.preinitModuleScript(_href10);
                } else {
                  var _href11 = _refined6[0];
                  var _options4 = _refined6[1];
                  dispatcher.preinitModuleScript(_href11, _options4);
                }
                return;
              }
            }
          }
        }
        function refineModel(code, model) {
          return model;
        }
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        var getPrototypeOf = Object.getPrototypeOf;
        var jsxPropsParents = /* @__PURE__ */ new WeakMap();
        var jsxChildrenParents = /* @__PURE__ */ new WeakMap();
        function isObjectPrototype(object) {
          if (!object) {
            return false;
          }
          var ObjectPrototype2 = Object.prototype;
          if (object === ObjectPrototype2) {
            return true;
          }
          if (getPrototypeOf(object)) {
            return false;
          }
          var names = Object.getOwnPropertyNames(object);
          for (var i = 0; i < names.length; i++) {
            if (!(names[i] in ObjectPrototype2)) {
              return false;
            }
          }
          return true;
        }
        function isSimpleObject(object) {
          if (!isObjectPrototype(getPrototypeOf(object))) {
            return false;
          }
          var names = Object.getOwnPropertyNames(object);
          for (var i = 0; i < names.length; i++) {
            var descriptor = Object.getOwnPropertyDescriptor(object, names[i]);
            if (!descriptor) {
              return false;
            }
            if (!descriptor.enumerable) {
              if ((names[i] === "key" || names[i] === "ref") && typeof descriptor.get === "function") {
                continue;
              }
              return false;
            }
          }
          return true;
        }
        function objectName(object) {
          var name = Object.prototype.toString.call(object);
          return name.replace(/^\[object (.*)\]$/, function(m, p0) {
            return p0;
          });
        }
        function describeKeyForErrorMessage(key) {
          var encodedKey = JSON.stringify(key);
          return '"' + key + '"' === encodedKey ? key : encodedKey;
        }
        function describeValueForErrorMessage(value) {
          switch (typeof value) {
            case "string": {
              return JSON.stringify(value.length <= 10 ? value : value.slice(0, 10) + "...");
            }
            case "object": {
              if (isArray(value)) {
                return "[...]";
              }
              var name = objectName(value);
              if (name === "Object") {
                return "{...}";
              }
              return name;
            }
            case "function":
              return "function";
            default:
              return String(value);
          }
        }
        function describeElementType(type) {
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeElementType(type.render);
              case REACT_MEMO_TYPE:
                return describeElementType(type.type);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeElementType(init(payload));
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        function describeObjectForErrorMessage(objectOrArray, expandedName) {
          var objKind = objectName(objectOrArray);
          if (objKind !== "Object" && objKind !== "Array") {
            return objKind;
          }
          var str = "";
          var start = -1;
          var length = 0;
          if (isArray(objectOrArray)) {
            if (jsxChildrenParents.has(objectOrArray)) {
              var type = jsxChildrenParents.get(objectOrArray);
              str = "<" + describeElementType(type) + ">";
              var array = objectOrArray;
              for (var i = 0; i < array.length; i++) {
                var value = array[i];
                var substr = void 0;
                if (typeof value === "string") {
                  substr = value;
                } else if (typeof value === "object" && value !== null) {
                  substr = "{" + describeObjectForErrorMessage(value) + "}";
                } else {
                  substr = "{" + describeValueForErrorMessage(value) + "}";
                }
                if ("" + i === expandedName) {
                  start = str.length;
                  length = substr.length;
                  str += substr;
                } else if (substr.length < 15 && str.length + substr.length < 40) {
                  str += substr;
                } else {
                  str += "{...}";
                }
              }
              str += "</" + describeElementType(type) + ">";
            } else {
              str = "[";
              var _array = objectOrArray;
              for (var _i = 0; _i < _array.length; _i++) {
                if (_i > 0) {
                  str += ", ";
                }
                var _value = _array[_i];
                var _substr = void 0;
                if (typeof _value === "object" && _value !== null) {
                  _substr = describeObjectForErrorMessage(_value);
                } else {
                  _substr = describeValueForErrorMessage(_value);
                }
                if ("" + _i === expandedName) {
                  start = str.length;
                  length = _substr.length;
                  str += _substr;
                } else if (_substr.length < 10 && str.length + _substr.length < 40) {
                  str += _substr;
                } else {
                  str += "...";
                }
              }
              str += "]";
            }
          } else {
            if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE) {
              str = "<" + describeElementType(objectOrArray.type) + "/>";
            } else if (jsxPropsParents.has(objectOrArray)) {
              var _type = jsxPropsParents.get(objectOrArray);
              str = "<" + (describeElementType(_type) || "...");
              var object = objectOrArray;
              var names = Object.keys(object);
              for (var _i2 = 0; _i2 < names.length; _i2++) {
                str += " ";
                var name = names[_i2];
                str += describeKeyForErrorMessage(name) + "=";
                var _value2 = object[name];
                var _substr2 = void 0;
                if (name === expandedName && typeof _value2 === "object" && _value2 !== null) {
                  _substr2 = describeObjectForErrorMessage(_value2);
                } else {
                  _substr2 = describeValueForErrorMessage(_value2);
                }
                if (typeof _value2 !== "string") {
                  _substr2 = "{" + _substr2 + "}";
                }
                if (name === expandedName) {
                  start = str.length;
                  length = _substr2.length;
                  str += _substr2;
                } else if (_substr2.length < 10 && str.length + _substr2.length < 40) {
                  str += _substr2;
                } else {
                  str += "...";
                }
              }
              str += ">";
            } else {
              str = "{";
              var _object = objectOrArray;
              var _names = Object.keys(_object);
              for (var _i3 = 0; _i3 < _names.length; _i3++) {
                if (_i3 > 0) {
                  str += ", ";
                }
                var _name = _names[_i3];
                str += describeKeyForErrorMessage(_name) + ": ";
                var _value3 = _object[_name];
                var _substr3 = void 0;
                if (typeof _value3 === "object" && _value3 !== null) {
                  _substr3 = describeObjectForErrorMessage(_value3);
                } else {
                  _substr3 = describeValueForErrorMessage(_value3);
                }
                if (_name === expandedName) {
                  start = str.length;
                  length = _substr3.length;
                  str += _substr3;
                } else if (_substr3.length < 10 && str.length + _substr3.length < 40) {
                  str += _substr3;
                } else {
                  str += "...";
                }
              }
              str += "}";
            }
          }
          if (expandedName === void 0) {
            return str;
          }
          if (start > -1 && length > 0) {
            var highlight = " ".repeat(start) + "^".repeat(length);
            return "\n  " + str + "\n  " + highlight;
          }
          return "\n  " + str;
        }
        var ObjectPrototype = Object.prototype;
        var knownServerReferences = /* @__PURE__ */ new WeakMap();
        function serializePromiseID(id) {
          return "$@" + id.toString(16);
        }
        function serializeServerReferenceID(id) {
          return "$F" + id.toString(16);
        }
        function serializeSymbolReference(name) {
          return "$S" + name;
        }
        function serializeFormDataReference(id) {
          return "$K" + id.toString(16);
        }
        function serializeNumber(number) {
          if (Number.isFinite(number)) {
            if (number === 0 && 1 / number === -Infinity) {
              return "$-0";
            } else {
              return number;
            }
          } else {
            if (number === Infinity) {
              return "$Infinity";
            } else if (number === -Infinity) {
              return "$-Infinity";
            } else {
              return "$NaN";
            }
          }
        }
        function serializeUndefined() {
          return "$undefined";
        }
        function serializeDateFromDateJSON(dateJSON) {
          return "$D" + dateJSON;
        }
        function serializeBigInt(n) {
          return "$n" + n.toString(10);
        }
        function serializeMapID(id) {
          return "$Q" + id.toString(16);
        }
        function serializeSetID(id) {
          return "$W" + id.toString(16);
        }
        function escapeStringValue(value) {
          if (value[0] === "$") {
            return "$" + value;
          } else {
            return value;
          }
        }
        function processReply(root, formFieldPrefix, resolve, reject) {
          var nextPartId = 1;
          var pendingParts = 0;
          var formData = null;
          function resolveToJSON(key, value) {
            var parent = this;
            {
              var originalValue = parent[key];
              if (typeof originalValue === "object" && originalValue !== value && !(originalValue instanceof Date)) {
                if (objectName(originalValue) !== "Object") {
                  error("Only plain objects can be passed to Server Functions from the Client. %s objects are not supported.%s", objectName(originalValue), describeObjectForErrorMessage(parent, key));
                } else {
                  error("Only plain objects can be passed to Server Functions from the Client. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.%s", describeObjectForErrorMessage(parent, key));
                }
              }
            }
            if (value === null) {
              return null;
            }
            if (typeof value === "object") {
              if (typeof value.then === "function") {
                if (formData === null) {
                  formData = new FormData();
                }
                pendingParts++;
                var promiseId = nextPartId++;
                var thenable = value;
                thenable.then(function(partValue) {
                  var partJSON2 = JSON.stringify(partValue, resolveToJSON);
                  var data2 = formData;
                  data2.append(formFieldPrefix + promiseId, partJSON2);
                  pendingParts--;
                  if (pendingParts === 0) {
                    resolve(data2);
                  }
                }, function(reason) {
                  reject(reason);
                });
                return serializePromiseID(promiseId);
              }
              if (isArray(value)) {
                return value;
              }
              if (value instanceof FormData) {
                if (formData === null) {
                  formData = new FormData();
                }
                var data = formData;
                var refId = nextPartId++;
                var prefix = formFieldPrefix + refId + "_";
                value.forEach(function(originalValue2, originalKey) {
                  data.append(prefix + originalKey, originalValue2);
                });
                return serializeFormDataReference(refId);
              }
              if (value instanceof Map) {
                var partJSON = JSON.stringify(Array.from(value), resolveToJSON);
                if (formData === null) {
                  formData = new FormData();
                }
                var mapId = nextPartId++;
                formData.append(formFieldPrefix + mapId, partJSON);
                return serializeMapID(mapId);
              }
              if (value instanceof Set) {
                var _partJSON = JSON.stringify(Array.from(value), resolveToJSON);
                if (formData === null) {
                  formData = new FormData();
                }
                var setId = nextPartId++;
                formData.append(formFieldPrefix + setId, _partJSON);
                return serializeSetID(setId);
              }
              var iteratorFn = getIteratorFn(value);
              if (iteratorFn) {
                return Array.from(value);
              }
              var proto = getPrototypeOf(value);
              if (proto !== ObjectPrototype && (proto === null || getPrototypeOf(proto) !== null)) {
                throw new Error("Only plain objects, and a few built-ins, can be passed to Server Actions. Classes or null prototypes are not supported.");
              }
              {
                if (value.$$typeof === REACT_ELEMENT_TYPE) {
                  error("React Element cannot be passed to Server Functions from the Client.%s", describeObjectForErrorMessage(parent, key));
                } else if (value.$$typeof === REACT_LAZY_TYPE) {
                  error("React Lazy cannot be passed to Server Functions from the Client.%s", describeObjectForErrorMessage(parent, key));
                } else if (value.$$typeof === REACT_PROVIDER_TYPE) {
                  error("React Context Providers cannot be passed to Server Functions from the Client.%s", describeObjectForErrorMessage(parent, key));
                } else if (objectName(value) !== "Object") {
                  error("Only plain objects can be passed to Server Functions from the Client. %s objects are not supported.%s", objectName(value), describeObjectForErrorMessage(parent, key));
                } else if (!isSimpleObject(value)) {
                  error("Only plain objects can be passed to Server Functions from the Client. Classes or other objects with methods are not supported.%s", describeObjectForErrorMessage(parent, key));
                } else if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(value);
                  if (symbols.length > 0) {
                    error("Only plain objects can be passed to Server Functions from the Client. Objects with symbol properties like %s are not supported.%s", symbols[0].description, describeObjectForErrorMessage(parent, key));
                  }
                }
              }
              return value;
            }
            if (typeof value === "string") {
              if (value[value.length - 1] === "Z") {
                var _originalValue = parent[key];
                if (_originalValue instanceof Date) {
                  return serializeDateFromDateJSON(value);
                }
              }
              return escapeStringValue(value);
            }
            if (typeof value === "boolean") {
              return value;
            }
            if (typeof value === "number") {
              return serializeNumber(value);
            }
            if (typeof value === "undefined") {
              return serializeUndefined();
            }
            if (typeof value === "function") {
              var metaData = knownServerReferences.get(value);
              if (metaData !== void 0) {
                var metaDataJSON = JSON.stringify(metaData, resolveToJSON);
                if (formData === null) {
                  formData = new FormData();
                }
                var _refId = nextPartId++;
                formData.set(formFieldPrefix + _refId, metaDataJSON);
                return serializeServerReferenceID(_refId);
              }
              throw new Error("Client Functions cannot be passed directly to Server Functions. Only Functions passed from the Server can be passed back again.");
            }
            if (typeof value === "symbol") {
              var name = value.description;
              if (Symbol.for(name) !== value) {
                throw new Error("Only global symbols received from Symbol.for(...) can be passed to Server Functions. " + ("The symbol Symbol.for(" + // $FlowFixMe[incompatible-type] `description` might be undefined
                value.description + ") cannot be found among global symbols."));
              }
              return serializeSymbolReference(name);
            }
            if (typeof value === "bigint") {
              return serializeBigInt(value);
            }
            throw new Error("Type " + typeof value + " is not supported as an argument to a Server Function.");
          }
          var json = JSON.stringify(root, resolveToJSON);
          if (formData === null) {
            resolve(json);
          } else {
            formData.set(formFieldPrefix + "0", json);
            if (pendingParts === 0) {
              resolve(formData);
            }
          }
        }
        function registerServerReference(proxy, reference) {
          knownServerReferences.set(proxy, reference);
        }
        function createServerReference(id, callServer) {
          var proxy = function() {
            var args = Array.prototype.slice.call(arguments);
            return callServer(id, args);
          };
          registerServerReference(proxy, {
            id,
            bound: null
          });
          return proxy;
        }
        var ROW_ID = 0;
        var ROW_TAG = 1;
        var ROW_LENGTH = 2;
        var ROW_CHUNK_BY_NEWLINE = 3;
        var ROW_CHUNK_BY_LENGTH = 4;
        var PENDING = "pending";
        var BLOCKED = "blocked";
        var CYCLIC = "cyclic";
        var RESOLVED_MODEL = "resolved_model";
        var RESOLVED_MODULE = "resolved_module";
        var INITIALIZED = "fulfilled";
        var ERRORED = "rejected";
        function Chunk(status, value, reason, response) {
          this.status = status;
          this.value = value;
          this.reason = reason;
          this._response = response;
          {
            this._debugInfo = null;
          }
        }
        Chunk.prototype = Object.create(Promise.prototype);
        Chunk.prototype.then = function(resolve, reject) {
          var chunk = this;
          switch (chunk.status) {
            case RESOLVED_MODEL:
              initializeModelChunk(chunk);
              break;
            case RESOLVED_MODULE:
              initializeModuleChunk(chunk);
              break;
          }
          switch (chunk.status) {
            case INITIALIZED:
              resolve(chunk.value);
              break;
            case PENDING:
            case BLOCKED:
            case CYCLIC:
              if (resolve) {
                if (chunk.value === null) {
                  chunk.value = [];
                }
                chunk.value.push(resolve);
              }
              if (reject) {
                if (chunk.reason === null) {
                  chunk.reason = [];
                }
                chunk.reason.push(reject);
              }
              break;
            default:
              reject(chunk.reason);
              break;
          }
        };
        function readChunk(chunk) {
          switch (chunk.status) {
            case RESOLVED_MODEL:
              initializeModelChunk(chunk);
              break;
            case RESOLVED_MODULE:
              initializeModuleChunk(chunk);
              break;
          }
          switch (chunk.status) {
            case INITIALIZED:
              return chunk.value;
            case PENDING:
            case BLOCKED:
            case CYCLIC:
              throw chunk;
            default:
              throw chunk.reason;
          }
        }
        function getRoot(response) {
          var chunk = getChunk(response, 0);
          return chunk;
        }
        function createPendingChunk(response) {
          return new Chunk(PENDING, null, null, response);
        }
        function createBlockedChunk(response) {
          return new Chunk(BLOCKED, null, null, response);
        }
        function createErrorChunk(response, error2) {
          return new Chunk(ERRORED, null, error2, response);
        }
        function wakeChunk(listeners, value) {
          for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            listener(value);
          }
        }
        function wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners) {
          switch (chunk.status) {
            case INITIALIZED:
              wakeChunk(resolveListeners, chunk.value);
              break;
            case PENDING:
            case BLOCKED:
            case CYCLIC:
              chunk.value = resolveListeners;
              chunk.reason = rejectListeners;
              break;
            case ERRORED:
              if (rejectListeners) {
                wakeChunk(rejectListeners, chunk.reason);
              }
              break;
          }
        }
        function triggerErrorOnChunk(chunk, error2) {
          if (chunk.status !== PENDING && chunk.status !== BLOCKED) {
            return;
          }
          var listeners = chunk.reason;
          var erroredChunk = chunk;
          erroredChunk.status = ERRORED;
          erroredChunk.reason = error2;
          if (listeners !== null) {
            wakeChunk(listeners, error2);
          }
        }
        function createResolvedModelChunk(response, value) {
          return new Chunk(RESOLVED_MODEL, value, null, response);
        }
        function createResolvedModuleChunk(response, value) {
          return new Chunk(RESOLVED_MODULE, value, null, response);
        }
        function createInitializedTextChunk(response, value) {
          return new Chunk(INITIALIZED, value, null, response);
        }
        function resolveModelChunk(chunk, value) {
          if (chunk.status !== PENDING) {
            return;
          }
          var resolveListeners = chunk.value;
          var rejectListeners = chunk.reason;
          var resolvedChunk = chunk;
          resolvedChunk.status = RESOLVED_MODEL;
          resolvedChunk.value = value;
          if (resolveListeners !== null) {
            initializeModelChunk(resolvedChunk);
            wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
          }
        }
        function resolveModuleChunk(chunk, value) {
          if (chunk.status !== PENDING && chunk.status !== BLOCKED) {
            return;
          }
          var resolveListeners = chunk.value;
          var rejectListeners = chunk.reason;
          var resolvedChunk = chunk;
          resolvedChunk.status = RESOLVED_MODULE;
          resolvedChunk.value = value;
          if (resolveListeners !== null) {
            initializeModuleChunk(resolvedChunk);
            wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
          }
        }
        var initializingChunk = null;
        var initializingChunkBlockedModel = null;
        function initializeModelChunk(chunk) {
          var prevChunk = initializingChunk;
          var prevBlocked = initializingChunkBlockedModel;
          initializingChunk = chunk;
          initializingChunkBlockedModel = null;
          var resolvedModel = chunk.value;
          var cyclicChunk = chunk;
          cyclicChunk.status = CYCLIC;
          cyclicChunk.value = null;
          cyclicChunk.reason = null;
          try {
            var value = parseModel(chunk._response, resolvedModel);
            if (initializingChunkBlockedModel !== null && initializingChunkBlockedModel.deps > 0) {
              initializingChunkBlockedModel.value = value;
              var blockedChunk = chunk;
              blockedChunk.status = BLOCKED;
              blockedChunk.value = null;
              blockedChunk.reason = null;
            } else {
              var resolveListeners = cyclicChunk.value;
              var initializedChunk = chunk;
              initializedChunk.status = INITIALIZED;
              initializedChunk.value = value;
              if (resolveListeners !== null) {
                wakeChunk(resolveListeners, value);
              }
            }
          } catch (error2) {
            var erroredChunk = chunk;
            erroredChunk.status = ERRORED;
            erroredChunk.reason = error2;
          } finally {
            initializingChunk = prevChunk;
            initializingChunkBlockedModel = prevBlocked;
          }
        }
        function initializeModuleChunk(chunk) {
          try {
            var value = requireModule(chunk.value);
            var initializedChunk = chunk;
            initializedChunk.status = INITIALIZED;
            initializedChunk.value = value;
          } catch (error2) {
            var erroredChunk = chunk;
            erroredChunk.status = ERRORED;
            erroredChunk.reason = error2;
          }
        }
        function reportGlobalError(response, error2) {
          response._chunks.forEach(function(chunk) {
            if (chunk.status === PENDING) {
              triggerErrorOnChunk(chunk, error2);
            }
          });
        }
        function createElement(type, key, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref: null,
            props,
            // Record the component responsible for creating this element.
            _owner: null
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: true
              // This element has already been validated on the server.
            });
            Object.defineProperty(element, "_debugInfo", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: null
            });
          }
          return element;
        }
        function createLazyChunkWrapper(chunk) {
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: chunk,
            _init: readChunk
          };
          {
            var chunkDebugInfo = chunk._debugInfo || (chunk._debugInfo = []);
            lazyType._debugInfo = chunkDebugInfo;
          }
          return lazyType;
        }
        function getChunk(response, id) {
          var chunks = response._chunks;
          var chunk = chunks.get(id);
          if (!chunk) {
            chunk = createPendingChunk(response);
            chunks.set(id, chunk);
          }
          return chunk;
        }
        function createModelResolver(chunk, parentObject, key, cyclic) {
          var blocked;
          if (initializingChunkBlockedModel) {
            blocked = initializingChunkBlockedModel;
            if (!cyclic) {
              blocked.deps++;
            }
          } else {
            blocked = initializingChunkBlockedModel = {
              deps: cyclic ? 0 : 1,
              value: null
            };
          }
          return function(value) {
            parentObject[key] = value;
            blocked.deps--;
            if (blocked.deps === 0) {
              if (chunk.status !== BLOCKED) {
                return;
              }
              var resolveListeners = chunk.value;
              var initializedChunk = chunk;
              initializedChunk.status = INITIALIZED;
              initializedChunk.value = blocked.value;
              if (resolveListeners !== null) {
                wakeChunk(resolveListeners, blocked.value);
              }
            }
          };
        }
        function createModelReject(chunk) {
          return function(error2) {
            return triggerErrorOnChunk(chunk, error2);
          };
        }
        function createServerReferenceProxy(response, metaData) {
          var callServer = response._callServer;
          var proxy = function() {
            var args = Array.prototype.slice.call(arguments);
            var p = metaData.bound;
            if (!p) {
              return callServer(metaData.id, args);
            }
            if (p.status === INITIALIZED) {
              var bound = p.value;
              return callServer(metaData.id, bound.concat(args));
            }
            return Promise.resolve(p).then(function(bound2) {
              return callServer(metaData.id, bound2.concat(args));
            });
          };
          registerServerReference(proxy, metaData);
          return proxy;
        }
        function getOutlinedModel(response, id) {
          var chunk = getChunk(response, id);
          switch (chunk.status) {
            case RESOLVED_MODEL:
              initializeModelChunk(chunk);
              break;
          }
          switch (chunk.status) {
            case INITIALIZED: {
              return chunk.value;
            }
            default:
              throw chunk.reason;
          }
        }
        function parseModelString(response, parentObject, key, value) {
          if (value[0] === "$") {
            if (value === "$") {
              return REACT_ELEMENT_TYPE;
            }
            switch (value[1]) {
              case "$": {
                return value.slice(1);
              }
              case "L": {
                var id = parseInt(value.slice(2), 16);
                var chunk = getChunk(response, id);
                return createLazyChunkWrapper(chunk);
              }
              case "@": {
                var _id = parseInt(value.slice(2), 16);
                var _chunk = getChunk(response, _id);
                return _chunk;
              }
              case "S": {
                return Symbol.for(value.slice(2));
              }
              case "F": {
                var _id2 = parseInt(value.slice(2), 16);
                var metadata = getOutlinedModel(response, _id2);
                return createServerReferenceProxy(response, metadata);
              }
              case "Q": {
                var _id3 = parseInt(value.slice(2), 16);
                var data = getOutlinedModel(response, _id3);
                return new Map(data);
              }
              case "W": {
                var _id4 = parseInt(value.slice(2), 16);
                var _data = getOutlinedModel(response, _id4);
                return new Set(_data);
              }
              case "I": {
                return Infinity;
              }
              case "-": {
                if (value === "$-0") {
                  return -0;
                } else {
                  return -Infinity;
                }
              }
              case "N": {
                return NaN;
              }
              case "u": {
                return void 0;
              }
              case "D": {
                return new Date(Date.parse(value.slice(2)));
              }
              case "n": {
                return BigInt(value.slice(2));
              }
              default: {
                var _id5 = parseInt(value.slice(1), 16);
                var _chunk2 = getChunk(response, _id5);
                switch (_chunk2.status) {
                  case RESOLVED_MODEL:
                    initializeModelChunk(_chunk2);
                    break;
                  case RESOLVED_MODULE:
                    initializeModuleChunk(_chunk2);
                    break;
                }
                switch (_chunk2.status) {
                  case INITIALIZED:
                    var chunkValue = _chunk2.value;
                    if (_chunk2._debugInfo) {
                      if (typeof chunkValue === "object" && chunkValue !== null && (Array.isArray(chunkValue) || chunkValue.$$typeof === REACT_ELEMENT_TYPE) && !chunkValue._debugInfo) {
                        Object.defineProperty(chunkValue, "_debugInfo", {
                          configurable: false,
                          enumerable: false,
                          writable: true,
                          value: _chunk2._debugInfo
                        });
                      }
                    }
                    return chunkValue;
                  case PENDING:
                  case BLOCKED:
                  case CYCLIC:
                    var parentChunk = initializingChunk;
                    _chunk2.then(createModelResolver(parentChunk, parentObject, key, _chunk2.status === CYCLIC), createModelReject(parentChunk));
                    return null;
                  default:
                    throw _chunk2.reason;
                }
              }
            }
          }
          return value;
        }
        function parseModelTuple(response, value) {
          var tuple = value;
          if (tuple[0] === REACT_ELEMENT_TYPE) {
            return createElement(tuple[1], tuple[2], tuple[3]);
          }
          return value;
        }
        function missingCall() {
          throw new Error('Trying to call a function from "use server" but the callServer option was not implemented in your router runtime.');
        }
        function createResponse(bundlerConfig, moduleLoading, callServer, nonce) {
          var chunks = /* @__PURE__ */ new Map();
          var response = {
            _bundlerConfig: bundlerConfig,
            _moduleLoading: moduleLoading,
            _callServer: callServer !== void 0 ? callServer : missingCall,
            _nonce: nonce,
            _chunks: chunks,
            _stringDecoder: createStringDecoder(),
            _fromJSON: null,
            _rowState: 0,
            _rowID: 0,
            _rowTag: 0,
            _rowLength: 0,
            _buffer: []
          };
          response._fromJSON = createFromJSONCallback(response);
          return response;
        }
        function resolveModel(response, id, model) {
          var chunks = response._chunks;
          var chunk = chunks.get(id);
          if (!chunk) {
            chunks.set(id, createResolvedModelChunk(response, model));
          } else {
            resolveModelChunk(chunk, model);
          }
        }
        function resolveText(response, id, text) {
          var chunks = response._chunks;
          chunks.set(id, createInitializedTextChunk(response, text));
        }
        function resolveModule(response, id, model) {
          var chunks = response._chunks;
          var chunk = chunks.get(id);
          var clientReferenceMetadata = parseModel(response, model);
          var clientReference = resolveClientReference(response._bundlerConfig, clientReferenceMetadata);
          var promise = preloadModule(clientReference);
          if (promise) {
            var blockedChunk;
            if (!chunk) {
              blockedChunk = createBlockedChunk(response);
              chunks.set(id, blockedChunk);
            } else {
              blockedChunk = chunk;
              blockedChunk.status = BLOCKED;
            }
            promise.then(function() {
              return resolveModuleChunk(blockedChunk, clientReference);
            }, function(error2) {
              return triggerErrorOnChunk(blockedChunk, error2);
            });
          } else {
            if (!chunk) {
              chunks.set(id, createResolvedModuleChunk(response, clientReference));
            } else {
              resolveModuleChunk(chunk, clientReference);
            }
          }
        }
        function resolveErrorDev(response, id, digest, message, stack) {
          var error2 = new Error(message || "An error occurred in the Server Components render but no message was provided");
          error2.stack = stack;
          error2.digest = digest;
          var errorWithDigest = error2;
          var chunks = response._chunks;
          var chunk = chunks.get(id);
          if (!chunk) {
            chunks.set(id, createErrorChunk(response, errorWithDigest));
          } else {
            triggerErrorOnChunk(chunk, errorWithDigest);
          }
        }
        function resolveHint(response, code, model) {
          var hintModel = parseModel(response, model);
          dispatchHint(code, hintModel);
        }
        function resolveDebugInfo(response, id, debugInfo) {
          var chunk = getChunk(response, id);
          var chunkDebugInfo = chunk._debugInfo || (chunk._debugInfo = []);
          chunkDebugInfo.push(debugInfo);
        }
        function processFullRow(response, id, tag, buffer, chunk) {
          var stringDecoder = response._stringDecoder;
          var row = "";
          for (var i = 0; i < buffer.length; i++) {
            row += readPartialStringChunk(stringDecoder, buffer[i]);
          }
          row += readFinalStringChunk(stringDecoder, chunk);
          switch (tag) {
            case 73: {
              resolveModule(response, id, row);
              return;
            }
            case 72: {
              var code = row[0];
              resolveHint(response, code, row.slice(1));
              return;
            }
            case 69: {
              var errorInfo = JSON.parse(row);
              {
                resolveErrorDev(response, id, errorInfo.digest, errorInfo.message, errorInfo.stack);
              }
              return;
            }
            case 84: {
              resolveText(response, id, row);
              return;
            }
            case 68: {
              {
                var debugInfo = JSON.parse(row);
                resolveDebugInfo(response, id, debugInfo);
                return;
              }
            }
            case 80:
            default: {
              resolveModel(response, id, row);
              return;
            }
          }
        }
        function processBinaryChunk(response, chunk) {
          var i = 0;
          var rowState = response._rowState;
          var rowID = response._rowID;
          var rowTag = response._rowTag;
          var rowLength = response._rowLength;
          var buffer = response._buffer;
          var chunkLength = chunk.length;
          while (i < chunkLength) {
            var lastIdx = -1;
            switch (rowState) {
              case ROW_ID: {
                var byte = chunk[i++];
                if (byte === 58) {
                  rowState = ROW_TAG;
                } else {
                  rowID = rowID << 4 | (byte > 96 ? byte - 87 : byte - 48);
                }
                continue;
              }
              case ROW_TAG: {
                var resolvedRowTag = chunk[i];
                if (resolvedRowTag === 84 || enableBinaryFlight) {
                  rowTag = resolvedRowTag;
                  rowState = ROW_LENGTH;
                  i++;
                } else if (resolvedRowTag > 64 && resolvedRowTag < 91) {
                  rowTag = resolvedRowTag;
                  rowState = ROW_CHUNK_BY_NEWLINE;
                  i++;
                } else {
                  rowTag = 0;
                  rowState = ROW_CHUNK_BY_NEWLINE;
                }
                continue;
              }
              case ROW_LENGTH: {
                var _byte = chunk[i++];
                if (_byte === 44) {
                  rowState = ROW_CHUNK_BY_LENGTH;
                } else {
                  rowLength = rowLength << 4 | (_byte > 96 ? _byte - 87 : _byte - 48);
                }
                continue;
              }
              case ROW_CHUNK_BY_NEWLINE: {
                lastIdx = chunk.indexOf(
                  10,
                  i
                );
                break;
              }
              case ROW_CHUNK_BY_LENGTH: {
                lastIdx = i + rowLength;
                if (lastIdx > chunk.length) {
                  lastIdx = -1;
                }
                break;
              }
            }
            var offset = chunk.byteOffset + i;
            if (lastIdx > -1) {
              var length = lastIdx - i;
              var lastChunk = new Uint8Array(chunk.buffer, offset, length);
              processFullRow(response, rowID, rowTag, buffer, lastChunk);
              i = lastIdx;
              if (rowState === ROW_CHUNK_BY_NEWLINE) {
                i++;
              }
              rowState = ROW_ID;
              rowTag = 0;
              rowID = 0;
              rowLength = 0;
              buffer.length = 0;
            } else {
              var _length = chunk.byteLength - i;
              var remainingSlice = new Uint8Array(chunk.buffer, offset, _length);
              buffer.push(remainingSlice);
              rowLength -= remainingSlice.byteLength;
              break;
            }
          }
          response._rowState = rowState;
          response._rowID = rowID;
          response._rowTag = rowTag;
          response._rowLength = rowLength;
        }
        function parseModel(response, json) {
          return JSON.parse(json, response._fromJSON);
        }
        function createFromJSONCallback(response) {
          return function(key, value) {
            if (typeof value === "string") {
              return parseModelString(response, this, key, value);
            }
            if (typeof value === "object" && value !== null) {
              return parseModelTuple(response, value);
            }
            return value;
          };
        }
        function close(response) {
          reportGlobalError(response, new Error("Connection closed."));
        }
        function createResponseFromOptions(options) {
          return createResponse(
            null,
            null,
            options && options.callServer ? options.callServer : void 0,
            void 0
            // nonce
          );
        }
        function startReadingFromStream(response, stream) {
          var reader = stream.getReader();
          function progress(_ref) {
            var done = _ref.done, value = _ref.value;
            if (done) {
              close(response);
              return;
            }
            var buffer = value;
            processBinaryChunk(response, buffer);
            return reader.read().then(progress).catch(error2);
          }
          function error2(e) {
            reportGlobalError(response, e);
          }
          reader.read().then(progress).catch(error2);
        }
        function createFromReadableStream(stream, options) {
          var response = createResponseFromOptions(options);
          startReadingFromStream(response, stream);
          return getRoot(response);
        }
        function createFromFetch(promiseForResponse, options) {
          var response = createResponseFromOptions(options);
          promiseForResponse.then(function(r) {
            startReadingFromStream(response, r.body);
          }, function(e) {
            reportGlobalError(response, e);
          });
          return getRoot(response);
        }
        function encodeReply(value) {
          return new Promise(function(resolve, reject) {
            processReply(value, "", resolve, reject);
          });
        }
        exports.createFromFetch = createFromFetch;
        exports.createFromReadableStream = createFromReadableStream;
        exports.createServerReference = createServerReference;
        exports.encodeReply = encodeReply;
      })();
    }
  }
});

// ../../../node_modules/react-server-dom-webpack/client.browser.js
var require_client_browser = __commonJS({
  "../../../node_modules/react-server-dom-webpack/client.browser.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_server_dom_webpack_client_browser_development();
    }
  }
});

export {
  require_client_browser
};
/*! Bundled license information:

react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:
  (**
   * @license React
   * react-server-dom-webpack-client.browser.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
