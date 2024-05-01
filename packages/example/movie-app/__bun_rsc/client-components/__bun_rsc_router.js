import {
  require_client_browser,
  require_react_dom
} from "./chunk-TNLWNAOM.js";
import {
  __commonJS,
  __toESM,
  require_react
} from "./chunk-H6GTI6SL.js";

// ../../../node_modules/react-dom/client.js
var require_client = __commonJS({
  "../../../node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// ../../../node_modules/react/cjs/react-jsx-dev-runtime.development.js
var require_react_jsx_dev_runtime_development = __commonJS({
  "../../../node_modules/react/cjs/react-jsx-dev-runtime.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var React = require_react();
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var REACT_CACHE_TYPE = Symbol.for("react.cache");
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
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
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
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var REACT_CLIENT_REFERENCE$2 = Symbol.for("react.client.reference");
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_CLIENT_REFERENCE$2 || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        var REACT_CLIENT_REFERENCE$1 = Symbol.for("react.client.reference");
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          if (typeof type === "function") {
            if (type.$$typeof === REACT_CLIENT_REFERENCE$1) {
              return null;
            }
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_CACHE_TYPE: {
              return "Cache";
            }
          }
          if (typeof type === "object") {
            {
              if (typeof type.tag === "number") {
                error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
              }
            }
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var assign = Object.assign;
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          var RunInRootFrame = {
            DetermineComponentFrameRoot: function() {
              var control;
              try {
                if (construct) {
                  var Fake = function() {
                    throw Error();
                  };
                  Object.defineProperty(Fake.prototype, "props", {
                    set: function() {
                      throw Error();
                    }
                  });
                  if (typeof Reflect === "object" && Reflect.construct) {
                    try {
                      Reflect.construct(Fake, []);
                    } catch (x) {
                      control = x;
                    }
                    Reflect.construct(fn, [], Fake);
                  } else {
                    try {
                      Fake.call();
                    } catch (x) {
                      control = x;
                    }
                    fn.call(Fake.prototype);
                  }
                } else {
                  try {
                    throw Error();
                  } catch (x) {
                    control = x;
                  }
                  var maybePromise = fn();
                  if (maybePromise && typeof maybePromise.catch === "function") {
                    maybePromise.catch(function() {
                    });
                  }
                }
              } catch (sample) {
                if (sample && control && typeof sample.stack === "string") {
                  return [sample.stack, control.stack];
                }
              }
              return [null, null];
            }
          };
          RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
          var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
          if (namePropDescriptor && namePropDescriptor.configurable) {
            Object.defineProperty(
              RunInRootFrame.DetermineComponentFrameRoot,
              // Configurable properties can be updated even if its writable descriptor
              // is set to `false`.
              // $FlowFixMe[cannot-write]
              "name",
              {
                value: "DetermineComponentFrameRoot"
              }
            );
          }
          try {
            var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
            if (sampleStack && controlStack) {
              var sampleLines = sampleStack.split("\n");
              var controlLines = controlStack.split("\n");
              var s = 0;
              var c = 0;
              while (s < sampleLines.length && !sampleLines[s].includes("DetermineComponentFrameRoot")) {
                s++;
              }
              while (c < controlLines.length && !controlLines[c].includes("DetermineComponentFrameRoot")) {
                c++;
              }
              if (s === sampleLines.length || c === controlLines.length) {
                s = sampleLines.length - 1;
                c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        if (true) {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement$1(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement$1(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement$1(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement$1(null);
                }
              }
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        var didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function warnIfStringRefCannotBeAutoConverted(config, self) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner$1.current && self && ReactCurrentOwner$1.current.stateNode !== self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner$1.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner$1.current.type), config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = function() {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
        }
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = function() {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
        function ReactElement(type, key, ref, self, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_debugInfo", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: null
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        }
        function jsxDEV$1(type, config, maybeKey, source, self) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              {
                checkKeyStringCoercion(maybeKey);
              }
              key = "" + maybeKey;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            if (hasValidRef(config)) {
              ref = config.ref;
              warnIfStringRefCannotBeAutoConverted(config, self);
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && // Skip over reserved prop names
              propName !== "key" && // TODO: `ref` will no longer be reserved in the next major
              propName !== "ref") {
                props[propName] = config[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(type, key, ref, self, source, ReactCurrentOwner$1.current, props);
          }
        }
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
        }
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner.current) {
              var name = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
        }
        function getSourceInfoErrorAddendum(source) {
          {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
            }
            return "";
          }
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = getComponentNameFromType(parentType);
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
        }
        function validateExplicitKey(element, parentType) {
          {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            setCurrentlyValidatingElement(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement(null);
          }
        }
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object" || !node) {
              return;
            }
            if (node.$$typeof === REACT_CLIENT_REFERENCE)
              ;
            else if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            if (type.$$typeof === REACT_CLIENT_REFERENCE) {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement(null);
            }
          }
        }
        var didWarnAboutKeySpread = {};
        function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum(source);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
            var element = jsxDEV$1(type, props, key, source, self);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            if (hasOwnProperty.call(props, "key")) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function(k) {
                return k !== "key";
              });
              var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        var jsxDEV5 = jsxWithValidation;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.jsxDEV = jsxDEV5;
      })();
    }
  }
});

// ../../../node_modules/react/jsx-dev-runtime.js
var require_jsx_dev_runtime = __commonJS({
  "../../../node_modules/react/jsx-dev-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_dev_runtime_development();
    }
  }
});

// node_modules/bun-rsc/dist/router/router.js
var import_react = __toESM(require_react(), 1);
var import_client = __toESM(require_client(), 1);
var import_client2 = __toESM(require_client_browser(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_client3 = __toESM(require_client_browser(), 1);
var import_client4 = __toESM(require_client_browser(), 1);
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
function CssTags({ manifest }) {
  return (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, {
    children: manifest.map((path) => {
      if (path.endsWith(".css")) {
        return (0, import_jsx_dev_runtime.jsxDEV)("link", {
          rel: "stylesheet",
          href: path
        }, path, false, void 0, this);
      }
      return null;
    })
  }, void 0, false, void 0, this);
}
function MetaTags({ meta }) {
  return (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, {
    children: [
      (0, import_jsx_dev_runtime2.jsxDEV)("title", {
        children: meta?.title ?? "My app"
      }, void 0, false, void 0, this),
      (0, import_jsx_dev_runtime2.jsxDEV)("meta", {
        charSet: "UTF-8"
      }, void 0, false, void 0, this),
      (0, import_jsx_dev_runtime2.jsxDEV)("meta", {
        name: "description",
        content: meta?.description
      }, void 0, false, void 0, this),
      (0, import_jsx_dev_runtime2.jsxDEV)("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }, void 0, false, void 0, this),
      meta?.icon ? (0, import_jsx_dev_runtime2.jsxDEV)("link", {
        rel: "icon",
        href: `./public/${meta?.icon}`
      }, void 0, false, void 0, this) : null
    ]
  }, void 0, true, void 0, this);
}
function Layout({
  children,
  meta,
  cssManifest
}) {
  return (0, import_jsx_dev_runtime3.jsxDEV)("html", {
    lang: "en",
    children: [
      (0, import_jsx_dev_runtime3.jsxDEV)("head", {
        children: [
          (0, import_jsx_dev_runtime3.jsxDEV)(MetaTags, {
            meta
          }, void 0, false, void 0, this),
          (0, import_jsx_dev_runtime3.jsxDEV)(CssTags, {
            manifest: cssManifest
          }, void 0, false, void 0, this)
        ]
      }, void 0, true, void 0, this),
      (0, import_jsx_dev_runtime3.jsxDEV)("body", {
        children
      }, void 0, false, void 0, this)
    ]
  }, void 0, true, void 0, this);
}
var encoder = new TextEncoder();
var streamController;
var rscStream = new ReadableStream({
  start(controller) {
    if (typeof window === "undefined") {
      return;
    }
    const handleChunk = (chunk) => {
      if (typeof chunk === "string") {
        controller.enqueue(encoder.encode(chunk));
      } else {
        controller.enqueue(chunk);
      }
    };
    window.__FLIGHT_DATA ||= [];
    window.__FLIGHT_DATA.forEach(handleChunk);
    window.__FLIGHT_DATA.push = (chunk) => {
      handleChunk(chunk);
    };
    streamController = controller;
  }
});
if (typeof document !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    streamController?.close();
  });
} else {
  streamController?.close();
}
function combineUrl(path1, path2) {
  let firstPath = path1;
  let secondPath = path2;
  if (path1.endsWith("/")) {
    firstPath = path1.substring(0, path1.length - 1);
  }
  if (path2.startsWith("/")) {
    secondPath = path2.substring(1);
  }
  return `${firstPath}/${secondPath}`;
}
function getCacheKey(url) {
  const urlObj = new URL(url.replace(`/${BUN_RSC_SPECIFIC_KEYWORD}`, ""));
  return urlObj.search ? urlObj.pathname + urlObj.search : urlObj.pathname;
}
var BUN_RSC_SPECIFIC_KEYWORD = "__BUN_RSC";
var RSC_CONTENT_TYPE = "text/x-component";
var BASE_RSC_SERVER_URL = true ? "http://localhost:3001" : "http://localhost:3001";
var callServer = async (id, args) => {
  const baseUrl = combineUrl(BASE_RSC_SERVER_URL, combineUrl(BUN_RSC_SPECIFIC_KEYWORD, window.location.pathname));
  const url = `${baseUrl}?actionId=${encodeURIComponent(id)}`;
  let requestOpts;
  if (!Array.isArray(args) || args.some((a) => a instanceof FormData)) {
    requestOpts = {
      headers: { accept: RSC_CONTENT_TYPE },
      body: await (0, import_client3.encodeReply)(args)
    };
  } else {
    requestOpts = {
      headers: {
        accept: RSC_CONTENT_TYPE,
        "content-type": "application/json"
      },
      body: JSON.stringify(args)
    };
  }
  const actionResult = (0, import_client3.createFromFetch)(fetch(url, {
    method: "POST",
    ...requestOpts
  }), { callServer });
  const cacheKey = getCacheKey(baseUrl);
  (0, import_react3.startTransition)(() => {
    if (window.__UPDATE_RSC_PAYLOAD__) {
      window.__BUN_RSC_CACHE__.set(cacheKey, actionResult);
      window.__UPDATE_RSC_PAYLOAD__(actionResult);
    }
  });
  return actionResult;
};
function getRscUrl(url, queryParam) {
  const baseUrl = combineUrl(BASE_RSC_SERVER_URL, combineUrl(BUN_RSC_SPECIFIC_KEYWORD, url));
  const hasQueryParam = queryParam && queryParam.length > 0;
  return hasQueryParam ? `${baseUrl}?${queryParam.toString()}` : baseUrl;
}
var refreshPort = 21717;
var reloadStylesheet = function() {
  const links = document.getElementsByTagName("link");
  for (const link of links) {
    if (link.rel === "stylesheet") {
      const href = link.getAttribute("href");
      if (href) {
        link.setAttribute("href", `${href}?timestamp=${Date.now()}`);
      }
    }
  }
};
function clientLiveReload() {
  let socket = null;
  let reconnectionTimerId;
  const requestUrl = `ws://localhost:${refreshPort}/`;
  const log = (message) => {
    console.info("[refresh] ", message);
  };
  const refresh = async () => {
    const rscUrl = getRscUrl(window.location.pathname, new URLSearchParams(window.location.search));
    const cacheKey = getCacheKey(rscUrl);
    const refetchResult = (0, import_client4.createFromFetch)(fetch(rscUrl), { callServer });
    (0, import_react2.startTransition)(() => {
      if (window.__UPDATE_RSC_PAYLOAD__) {
        window.__BUN_RSC_CACHE__.set(cacheKey, refetchResult);
        window.__UPDATE_RSC_PAYLOAD__(refetchResult);
      }
    });
    reloadStylesheet();
  };
  const connect = (callback) => {
    if (socket) {
      socket.close();
    }
    socket = new WebSocket(requestUrl);
    socket.addEventListener("open", callback);
    socket.addEventListener("message", (event) => {
      if (event.data === "refresh") {
        log("refreshing...");
        refresh();
      }
    });
    socket.addEventListener("close", () => {
      log("connection lost - reconnecting...");
      clearTimeout(reconnectionTimerId);
      reconnectionTimerId = setTimeout(() => {
        connect(refresh);
      }, 1e3);
    });
  };
  connect(() => {
    console.log("Live reload connected on", requestUrl);
  });
  return socket;
}
var Router = function({
  initialRscPayload: initialRscPayload2
}) {
  const [rscPayload, setRscPayload] = (0, import_react.useState)(initialRscPayload2);
  window.__UPDATE_RSC_PAYLOAD__ = setRscPayload;
  (0, import_react.useEffect)(() => {
    function navigate(url) {
      const [baseUrl, search] = url.split("?");
      const rscUrl = getRscUrl(baseUrl, new URLSearchParams(search));
      const cacheKey = getCacheKey(rscUrl);
      (0, import_react.startTransition)(() => {
        if (!window.__BUN_RSC_CACHE__.has(cacheKey)) {
          const newRscPayload = (0, import_client2.createFromFetch)(fetch(rscUrl), {
            callServer
          });
          window.__BUN_RSC_CACHE__.set(cacheKey, newRscPayload);
        }
        setRscPayload(window.__BUN_RSC_CACHE__.get(cacheKey));
      });
    }
    const clickHandler = (event) => {
      const target = event.target;
      if (target.tagName !== "A") {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const href = target.getAttribute("href");
      if (!href?.startsWith("/")) {
        return;
      }
      event.preventDefault();
      window.history.pushState(null, "", href);
      navigate(href);
    };
    window.addEventListener("click", clickHandler, true);
    const popstateHandler = () => {
      navigate(window.location.pathname);
    };
    window.addEventListener("popstate", popstateHandler);
    const rscPageMetaString = document.querySelector("#rsc-page-meta")?.getAttribute("value");
    if (rscPageMetaString && rscPageMetaString !== window.__SSR_META_STRING__) {
      const rscPageMeta = JSON.parse(rscPageMetaString);
      document.title = rscPageMeta.title;
      document.querySelector("meta[name=description]")?.setAttribute("content", rscPageMeta.description);
    }
    let socket = null;
    if (true)
      socket = clientLiveReload();
    return () => {
      if (socket) {
        socket.removeAllListeners();
      }
      window.removeEventListener("click", clickHandler, true);
      window.removeEventListener("popstate", popstateHandler);
    };
  }, []);
  const manifest = window.__MANIFEST_STRING__ ? JSON.parse(window.__MANIFEST_STRING__) : [];
  return (0, import_jsx_dev_runtime4.jsxDEV)(Layout, {
    meta: JSON.parse(window.__SSR_META_STRING__),
    cssManifest: manifest,
    children: (0, import_react.use)(rscPayload)
  }, void 0, false, void 0, this);
};
window.__BUN_RSC_CACHE__ = /* @__PURE__ */ new Map();
var initialRscPayload = (0, import_client2.createFromReadableStream)(rscStream, {
  callServer
});
var initialRscUrl = getRscUrl(window.location.pathname, new URLSearchParams(window.location.search));
var initialCacheKey = getCacheKey(initialRscUrl);
window.__BUN_RSC_CACHE__.set(initialCacheKey, initialRscPayload);
(0, import_client.hydrateRoot)(document, (0, import_jsx_dev_runtime4.jsxDEV)(Router, {
  initialRscPayload
}, void 0, false, void 0, void 0));
/*! Bundled license information:

react/cjs/react-jsx-dev-runtime.development.js:
  (**
   * @license React
   * react-jsx-dev-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
