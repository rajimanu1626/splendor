var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c2) {
          return c2;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n2 = 0;
        mapChildren(children, function() {
          n2++;
        });
        return n2;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState2, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState2, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create2, deps) {
      return ReactSharedInternals.H.useEffect(create2, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create2, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create2, deps);
    };
    exports.useInsertionEffect = function(create2, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create2, deps);
    };
    exports.useLayoutEffect = function(create2, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create2, deps);
    };
    exports.useMemo = function(create2, deps) {
      return ReactSharedInternals.H.useMemo(create2, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState2) {
      return ReactSharedInternals.H.useState(initialState2);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.2.4";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c2) {
            return c2;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors2) {
        return 1 < errors2.length && "function" === typeof AggregateError ? new AggregateError(errors2) : errors2[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n2 = 0;
          mapChildren(children, function() {
            n2++;
          });
          return n2;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState2, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState2,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create2, deps) {
        null == create2 && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create2, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create2, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create2, deps);
      };
      exports.useInsertionEffect = function(create2, deps) {
        null == create2 && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create2, deps);
      };
      exports.useLayoutEffect = function(create2, deps) {
        null == create2 && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create2, deps);
      };
      exports.useMemo = function(create2, deps) {
        return resolveDispatcher().useMemo(create2, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState2) {
        return resolveDispatcher().useState(initialState2);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.4";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// server/index.ts
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

// server/RoomManager.ts
var ROOM_CODE_LENGTH = 4;
var ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
function generateId() {
  return "p-" + Math.random().toString(36).slice(2, 10);
}
function generateRoomCode() {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}
var RoomManagerClass = class {
  rooms = /* @__PURE__ */ new Map();
  socketToRoom = /* @__PURE__ */ new Map();
  createRoom(socketId, playerName) {
    const playerId = generateId();
    let roomCode = generateRoomCode();
    while (this.rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }
    const room = {
      roomCode,
      hostId: playerId,
      players: [
        { playerId, playerName, isAI: false, socketId }
      ],
      gameStarted: false
    };
    this.rooms.set(roomCode, room);
    this.socketToRoom.set(socketId, { roomCode, playerId });
    return { roomCode, playerId };
  }
  joinRoom(roomCode, socketId, playerName) {
    const code = roomCode.toUpperCase().trim();
    const room = this.rooms.get(code);
    if (!room || room.gameStarted || room.players.length >= 4) return null;
    const alreadyJoined = room.players.some((p) => p.socketId === socketId);
    if (alreadyJoined) return null;
    const playerId = generateId();
    room.players.push({ playerId, playerName, isAI: false, socketId });
    this.socketToRoom.set(socketId, { roomCode: code, playerId });
    return { playerId };
  }
  leaveRoom(socketId) {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    const room = this.rooms.get(info.roomCode);
    if (!room) {
      this.socketToRoom.delete(socketId);
      return null;
    }
    const index = room.players.findIndex((p) => p.playerId === info.playerId);
    if (index === -1) {
      this.socketToRoom.delete(socketId);
      return null;
    }
    room.players.splice(index, 1);
    this.socketToRoom.delete(socketId);
    if (room.players.length === 0) {
      this.rooms.delete(info.roomCode);
      return null;
    }
    if (room.hostId === info.playerId) {
      const newHost = room.players.find((p) => !p.isAI) ?? room.players[0];
      room.hostId = newHost.playerId;
    }
    return { roomCode: info.roomCode, room };
  }
  addAI(roomCode, socketId, difficulty) {
    const info = this.socketToRoom.get(socketId);
    if (!info || info.roomCode !== roomCode) return false;
    const room = this.rooms.get(roomCode);
    if (!room || room.gameStarted || room.hostId !== info.playerId) return false;
    if (room.players.length >= 4) return false;
    const playerId = generateId();
    room.players.push({
      playerId,
      playerName: `AI (${difficulty})`,
      isAI: true,
      aiDifficulty: difficulty,
      socketId: null
    });
    return true;
  }
  getRoom(roomCode) {
    return this.rooms.get(roomCode.toUpperCase().trim()) ?? null;
  }
  getRoomBySocket(socketId) {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    const room = this.rooms.get(info.roomCode) ?? null;
    if (!room) return null;
    return { room, playerId: info.playerId };
  }
  /** Set player's socketId to null and remove from socketToRoom. Use on disconnect so UI shows disconnected; rejoin can restore. */
  setPlayerDisconnected(socketId) {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    this.socketToRoom.delete(socketId);
    const room = this.rooms.get(info.roomCode) ?? null;
    if (!room) return null;
    const player = room.players.find((p) => p.playerId === info.playerId);
    if (player && !player.isAI) player.socketId = null;
    return info.roomCode;
  }
  /** Mark player as disconnected (socketId -> null). Does not remove from room. */
  markDisconnected(socketId) {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    const room = this.rooms.get(info.roomCode) ?? null;
    if (!room) {
      this.socketToRoom.delete(socketId);
      return null;
    }
    const player = room.players.find((p) => p.playerId === info.playerId);
    const disconnectedPlayerId = player && !player.isAI ? player.playerId : void 0;
    const disconnectedPlayerName = player && !player.isAI ? player.playerName : void 0;
    if (player && !player.isAI) {
      player.socketId = null;
    }
    this.socketToRoom.delete(socketId);
    return { roomCode: info.roomCode, room, disconnectedPlayerId, disconnectedPlayerName };
  }
  rejoinRoom(roomCode, playerId, socketId) {
    const code = roomCode.toUpperCase().trim();
    const room = this.rooms.get(code);
    if (!room) return false;
    const player = room.players.find((p) => p.playerId === playerId);
    if (!player || player.isAI) return false;
    player.socketId = socketId;
    this.socketToRoom.set(socketId, { roomCode: code, playerId });
    return true;
  }
  setGameStarted(roomCode) {
    const room = this.rooms.get(roomCode);
    if (room) room.gameStarted = true;
  }
  toRoomUpdatePayload(room) {
    const players = room.players.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      isAI: p.isAI,
      aiDifficulty: p.aiDifficulty,
      socketId: p.socketId,
      isConnected: p.isAI || p.socketId != null
    }));
    return {
      roomCode: room.roomCode,
      hostId: room.hostId,
      players,
      canStart: room.players.length >= 2 && room.players.length <= 4 && !room.gameStarted
    };
  }
  getSocketIdsInRoom(room) {
    return room.players.filter((p) => p.socketId != null).map((p) => p.socketId);
  }
};
var RoomManager = new RoomManagerClass();

// lib/game-engine/types.ts
var GEM_COLORS = ["diamond", "sapphire", "emerald", "ruby", "onyx"];
var ALL_GEM_TYPES = [...GEM_COLORS, "gold"];
function emptyGems() {
  return { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0 };
}
function emptyBonuses() {
  return { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0 };
}
function createPlayer(id, name, isAI, aiDifficulty) {
  return {
    id,
    name,
    isAI,
    aiDifficulty,
    gems: emptyGems(),
    bonuses: emptyBonuses(),
    purchasedCards: [],
    reservedCards: [],
    nobles: [],
    prestige: 0
  };
}

// lib/game-engine/rules.ts
function getInitialTokens(playerCount) {
  const gemCount = playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7;
  return {
    diamond: gemCount,
    sapphire: gemCount,
    emerald: gemCount,
    ruby: gemCount,
    onyx: gemCount,
    gold: 5
  };
}
function getNobleCount(playerCount) {
  return playerCount + 1;
}
function getTokenCount(player) {
  return Object.values(player.gems).reduce((sum, n2) => sum + n2, 0);
}
function canTakeThreeTokens(selected, bankTokens) {
  if (selected.length === 0 || selected.length > 3) return false;
  const unique = new Set(selected);
  if (unique.size !== selected.length) return false;
  if (!selected.every((color) => bankTokens[color] >= 1)) return false;
  const availableColors = GEM_COLORS.filter((c2) => bankTokens[c2] > 0);
  if (availableColors.length >= 3 && selected.length < 3) return false;
  if (availableColors.length < 3 && selected.length !== Math.min(availableColors.length, 3)) return false;
  return true;
}
function canTakeTwoTokens(color, bankTokens) {
  return bankTokens[color] >= 4;
}
function getAvailableTokenColors(bankTokens) {
  return GEM_COLORS.filter((c2) => bankTokens[c2] > 0);
}
function getEffectivePurchasePower(player, color) {
  return player.gems[color] + player.bonuses[color];
}
function canPurchaseCard(player, card) {
  let goldNeeded = 0;
  for (const color of GEM_COLORS) {
    const cost = card.cost[color] || 0;
    const power = getEffectivePurchasePower(player, color);
    if (cost > power) {
      goldNeeded += cost - power;
    }
  }
  return player.gems.gold >= goldNeeded;
}
function calculateGemPayment(player, card) {
  const payment = {
    diamond: 0,
    sapphire: 0,
    emerald: 0,
    ruby: 0,
    onyx: 0,
    gold: 0
  };
  for (const color of GEM_COLORS) {
    const cost = card.cost[color] || 0;
    const bonusDiscount = player.bonuses[color];
    const netCost = Math.max(0, cost - bonusDiscount);
    const gemsAvailable = player.gems[color];
    if (gemsAvailable >= netCost) {
      payment[color] = netCost;
    } else {
      payment[color] = gemsAvailable;
      payment.gold += netCost - gemsAvailable;
    }
  }
  return payment;
}
function canReserveCard(player) {
  return player.reservedCards.length < 3;
}
function getClaimableNobles(player, nobles) {
  return nobles.filter((noble) => {
    for (const color of GEM_COLORS) {
      const req = noble.requirements[color] || 0;
      if (player.bonuses[color] < req) return false;
    }
    return true;
  });
}
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function findCardOnBoard(board, cardId) {
  for (const tierKey of ["tier1", "tier2", "tier3"]) {
    const idx = board[tierKey].visible.findIndex((c2) => c2?.id === cardId);
    if (idx !== -1) return { tier: tierKey, index: idx };
  }
  return null;
}
function findCardInReserved(player, cardId) {
  return player.reservedCards.findIndex((c2) => c2.id === cardId);
}
function determineWinner(players) {
  const maxPrestige = Math.max(...players.map((p) => p.prestige));
  if (maxPrestige < 15) return null;
  const candidates = players.filter((p) => p.prestige === maxPrestige);
  if (candidates.length === 1) return candidates[0];
  const minCards = Math.min(...candidates.map((p) => p.purchasedCards.length));
  const winners = candidates.filter((p) => p.purchasedCards.length === minCards);
  return winners[0];
}

// lib/game-engine/cardData.ts
function c(id, tier, bonus, prestige, diamond, sapphire, emerald, ruby, onyx) {
  const cost = {};
  if (diamond) cost.diamond = diamond;
  if (sapphire) cost.sapphire = sapphire;
  if (emerald) cost.emerald = emerald;
  if (ruby) cost.ruby = ruby;
  if (onyx) cost.onyx = onyx;
  return { id, tier, bonus, prestige, cost };
}
var TIER1_CARDS = [
  // Diamond (white) bonus — 8 cards
  c("t1-01", 1, "diamond", 0, 0, 3, 0, 0, 0),
  c("t1-02", 1, "diamond", 0, 0, 0, 0, 2, 1),
  c("t1-03", 1, "diamond", 0, 0, 1, 1, 1, 1),
  c("t1-04", 1, "diamond", 0, 0, 2, 0, 0, 2),
  c("t1-05", 1, "diamond", 1, 0, 0, 4, 0, 0),
  c("t1-06", 1, "diamond", 0, 0, 1, 2, 1, 1),
  c("t1-07", 1, "diamond", 0, 0, 2, 2, 0, 1),
  c("t1-08", 1, "diamond", 0, 3, 1, 0, 0, 1),
  // Sapphire (blue) bonus — 8 cards
  c("t1-09", 1, "sapphire", 0, 1, 0, 0, 0, 2),
  c("t1-10", 1, "sapphire", 0, 0, 0, 0, 0, 3),
  c("t1-11", 1, "sapphire", 0, 1, 0, 1, 1, 1),
  c("t1-12", 1, "sapphire", 0, 0, 0, 2, 0, 2),
  c("t1-13", 1, "sapphire", 1, 0, 0, 0, 4, 0),
  c("t1-14", 1, "sapphire", 0, 1, 0, 1, 2, 1),
  c("t1-15", 1, "sapphire", 0, 1, 0, 2, 2, 0),
  c("t1-16", 1, "sapphire", 0, 0, 1, 3, 1, 0),
  // Emerald (green) bonus — 8 cards
  c("t1-17", 1, "emerald", 0, 2, 1, 0, 0, 0),
  c("t1-18", 1, "emerald", 0, 0, 0, 0, 3, 0),
  c("t1-19", 1, "emerald", 0, 1, 1, 0, 1, 1),
  c("t1-20", 1, "emerald", 0, 0, 2, 0, 2, 0),
  c("t1-21", 1, "emerald", 1, 0, 0, 0, 0, 4),
  c("t1-22", 1, "emerald", 0, 1, 1, 0, 1, 2),
  c("t1-23", 1, "emerald", 0, 0, 1, 0, 2, 2),
  c("t1-24", 1, "emerald", 0, 1, 3, 1, 0, 0),
  // Ruby (red) bonus — 8 cards
  c("t1-25", 1, "ruby", 0, 0, 2, 1, 0, 0),
  c("t1-26", 1, "ruby", 0, 3, 0, 0, 0, 0),
  c("t1-27", 1, "ruby", 0, 1, 1, 1, 0, 1),
  c("t1-28", 1, "ruby", 0, 2, 0, 0, 2, 0),
  c("t1-29", 1, "ruby", 1, 4, 0, 0, 0, 0),
  c("t1-30", 1, "ruby", 0, 2, 1, 1, 0, 1),
  c("t1-31", 1, "ruby", 0, 2, 0, 1, 0, 2),
  c("t1-32", 1, "ruby", 0, 1, 0, 0, 1, 3),
  // Onyx (black) bonus — 8 cards
  c("t1-33", 1, "onyx", 0, 0, 0, 2, 1, 0),
  c("t1-34", 1, "onyx", 0, 0, 0, 3, 0, 0),
  c("t1-35", 1, "onyx", 0, 1, 1, 1, 1, 0),
  c("t1-36", 1, "onyx", 0, 2, 0, 2, 0, 0),
  c("t1-37", 1, "onyx", 1, 0, 4, 0, 0, 0),
  c("t1-38", 1, "onyx", 0, 1, 2, 1, 1, 0),
  c("t1-39", 1, "onyx", 0, 2, 2, 0, 1, 0),
  c("t1-40", 1, "onyx", 0, 0, 0, 1, 3, 1)
];
var TIER2_CARDS = [
  // Diamond bonus — 6 cards
  c("t2-01", 2, "diamond", 2, 0, 0, 0, 5, 0),
  c("t2-02", 2, "diamond", 3, 6, 0, 0, 0, 0),
  c("t2-03", 2, "diamond", 1, 0, 0, 3, 2, 2),
  c("t2-04", 2, "diamond", 2, 0, 0, 1, 4, 2),
  c("t2-05", 2, "diamond", 1, 2, 3, 0, 3, 0),
  c("t2-06", 2, "diamond", 2, 0, 0, 0, 5, 3),
  // Sapphire bonus — 6 cards
  c("t2-07", 2, "sapphire", 2, 0, 0, 5, 0, 0),
  c("t2-08", 2, "sapphire", 3, 0, 0, 6, 0, 0),
  c("t2-09", 2, "sapphire", 1, 2, 3, 0, 0, 2),
  c("t2-10", 2, "sapphire", 1, 3, 0, 2, 3, 0),
  c("t2-11", 2, "sapphire", 2, 4, 2, 0, 0, 1),
  c("t2-12", 2, "sapphire", 2, 0, 5, 3, 0, 0),
  // Emerald bonus — 6 cards
  c("t2-13", 2, "emerald", 2, 0, 0, 5, 0, 0),
  c("t2-14", 2, "emerald", 3, 0, 0, 6, 0, 0),
  c("t2-15", 2, "emerald", 1, 2, 3, 0, 0, 2),
  c("t2-16", 2, "emerald", 1, 3, 0, 2, 3, 0),
  c("t2-17", 2, "emerald", 2, 4, 2, 0, 0, 1),
  c("t2-18", 2, "emerald", 2, 0, 5, 3, 0, 0),
  // Ruby bonus — 6 cards
  c("t2-19", 2, "ruby", 2, 0, 0, 0, 0, 5),
  c("t2-20", 2, "ruby", 3, 0, 0, 0, 6, 0),
  c("t2-21", 2, "ruby", 1, 2, 0, 0, 2, 3),
  c("t2-22", 2, "ruby", 2, 1, 4, 2, 0, 0),
  c("t2-23", 2, "ruby", 1, 0, 3, 0, 2, 3),
  c("t2-24", 2, "ruby", 2, 3, 0, 0, 0, 5),
  // Onyx bonus — 6 cards
  c("t2-25", 2, "onyx", 2, 0, 0, 0, 0, 5),
  c("t2-26", 2, "onyx", 3, 0, 0, 0, 0, 6),
  c("t2-27", 2, "onyx", 1, 3, 2, 2, 0, 0),
  c("t2-28", 2, "onyx", 2, 0, 1, 4, 2, 0),
  c("t2-29", 2, "onyx", 1, 3, 0, 3, 0, 2),
  c("t2-30", 2, "onyx", 2, 0, 0, 5, 3, 0)
];
var TIER3_CARDS = [
  // Diamond bonus — 4 cards
  c("t3-01", 3, "diamond", 4, 0, 0, 0, 0, 7),
  c("t3-02", 3, "diamond", 5, 3, 0, 0, 0, 7),
  c("t3-03", 3, "diamond", 4, 3, 0, 0, 3, 6),
  c("t3-04", 3, "diamond", 3, 0, 3, 3, 5, 3),
  // Sapphire bonus — 4 cards
  c("t3-05", 3, "sapphire", 4, 7, 0, 0, 0, 0),
  c("t3-06", 3, "sapphire", 5, 7, 3, 0, 0, 0),
  c("t3-07", 3, "sapphire", 4, 6, 3, 0, 0, 3),
  c("t3-08", 3, "sapphire", 3, 3, 0, 3, 3, 5),
  // Emerald bonus — 4 cards
  c("t3-09", 3, "emerald", 4, 0, 7, 0, 0, 0),
  c("t3-10", 3, "emerald", 5, 0, 7, 3, 0, 0),
  c("t3-11", 3, "emerald", 4, 3, 6, 3, 0, 0),
  c("t3-12", 3, "emerald", 3, 5, 3, 0, 3, 3),
  // Ruby bonus — 4 cards
  c("t3-13", 3, "ruby", 4, 0, 0, 7, 0, 0),
  c("t3-14", 3, "ruby", 5, 0, 0, 7, 3, 0),
  c("t3-15", 3, "ruby", 4, 0, 3, 6, 3, 0),
  c("t3-16", 3, "ruby", 3, 3, 5, 3, 0, 3),
  // Onyx bonus — 4 cards
  c("t3-17", 3, "onyx", 4, 0, 0, 0, 7, 0),
  c("t3-18", 3, "onyx", 5, 0, 0, 0, 7, 3),
  c("t3-19", 3, "onyx", 4, 0, 0, 3, 6, 3),
  c("t3-20", 3, "onyx", 3, 3, 3, 5, 3, 0)
];
function n(id, diamond, sapphire, emerald, ruby, onyx) {
  const requirements = {};
  if (diamond) requirements.diamond = diamond;
  if (sapphire) requirements.sapphire = sapphire;
  if (emerald) requirements.emerald = emerald;
  if (ruby) requirements.ruby = ruby;
  if (onyx) requirements.onyx = onyx;
  return { id, prestige: 3, requirements };
}
var ALL_NOBLES = [
  n("n-01", 3, 3, 0, 0, 3),
  n("n-02", 0, 3, 3, 3, 0),
  n("n-03", 3, 0, 0, 3, 3),
  n("n-04", 0, 0, 4, 4, 0),
  n("n-05", 0, 4, 4, 0, 0),
  n("n-06", 0, 0, 0, 4, 4),
  n("n-07", 4, 0, 0, 0, 4),
  n("n-08", 3, 3, 3, 0, 0),
  n("n-09", 0, 0, 3, 3, 3),
  n("n-10", 4, 4, 0, 0, 0)
];
var ALL_CARDS = [...TIER1_CARDS, ...TIER2_CARDS, ...TIER3_CARDS];

// node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState2;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState2 = state = createState(setState, getState, api);
  return api;
};
var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);

// node_modules/zustand/esm/react.mjs
var import_react = __toESM(require_react(), 1);
var identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = import_react.default.useSyncExternalStore(
    api.subscribe,
    import_react.default.useCallback(() => selector(api.getState()), [api, selector]),
    import_react.default.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  import_react.default.useDebugValue(slice);
  return slice;
}
var createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
var create = ((createState) => createState ? createImpl(createState) : createImpl);

// node_modules/immer/dist/immer.mjs
var NOTHING = /* @__PURE__ */ Symbol.for("immer-nothing");
var DRAFTABLE = /* @__PURE__ */ Symbol.for("immer-draftable");
var DRAFT_STATE = /* @__PURE__ */ Symbol.for("immer-state");
var errors = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(plugin) {
    return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
  },
  function(thing) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
  },
  "This object has been frozen and should not be mutated",
  function(data) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(thing) {
    return `'current' expects a draft, got: ${thing}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(thing) {
    return `'original' expects a draft, got: ${thing}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (process.env.NODE_ENV !== "production") {
    const e = errors[error];
    const msg = isFunction(e) ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var O = Object;
var getPrototypeOf = O.getPrototypeOf;
var CONSTRUCTOR = "constructor";
var PROTOTYPE = "prototype";
var CONFIGURABLE = "configurable";
var ENUMERABLE = "enumerable";
var WRITABLE = "writable";
var VALUE = "value";
var isDraft = (value) => !!value && !!value[DRAFT_STATE];
function isDraftable(value) {
  if (!value)
    return false;
  return isPlainObject(value) || isArray(value) || !!value[DRAFTABLE] || !!value[CONSTRUCTOR]?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = O[PROTOTYPE][CONSTRUCTOR].toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (!value || !isObjectish(value))
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null || proto === O[PROTOTYPE])
    return true;
  const Ctor = O.hasOwnProperty.call(proto, CONSTRUCTOR) && proto[CONSTRUCTOR];
  if (Ctor === Object)
    return true;
  if (!isFunction(Ctor))
    return false;
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === void 0) {
    ctorString = Function.toString.call(Ctor);
    cachedCtorStrings.set(Ctor, ctorString);
  }
  return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
  if (getArchtype(obj) === 0) {
    const keys = strict ? Reflect.ownKeys(obj) : O.keys(obj);
    keys.forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
var has = (thing, prop, type = getArchtype(thing)) => type === 2 ? thing.has(prop) : O[PROTOTYPE].hasOwnProperty.call(thing, prop);
var get = (thing, prop, type = getArchtype(thing)) => (
  // @ts-ignore
  type === 2 ? thing.get(prop) : thing[prop]
);
var set = (thing, propOrOldValue, value, type = getArchtype(thing)) => {
  if (type === 2)
    thing.set(propOrOldValue, value);
  else if (type === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
};
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
var isArray = Array.isArray;
var isMap = (target) => target instanceof Map;
var isSet = (target) => target instanceof Set;
var isObjectish = (target) => typeof target === "object";
var isFunction = (target) => typeof target === "function";
var isBoolean = (target) => typeof target === "boolean";
function isArrayIndex(value) {
  const n2 = +value;
  return Number.isInteger(n2) && String(n2) === value;
}
var latest = (state) => state.copy_ || state.base_;
var getFinalValue = (state) => state.modified_ ? state.copy_ : state.base_;
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (isArray(base))
    return Array[PROTOTYPE].slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = O.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc[WRITABLE] === false) {
        desc[WRITABLE] = true;
        desc[CONFIGURABLE] = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          [CONFIGURABLE]: true,
          [WRITABLE]: true,
          // could live with !!desc.set as well here...
          [ENUMERABLE]: desc[ENUMERABLE],
          [VALUE]: base[key]
        };
    }
    return O.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = O.create(proto);
    return O.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    O.defineProperties(obj, {
      set: dontMutateMethodOverride,
      add: dontMutateMethodOverride,
      clear: dontMutateMethodOverride,
      delete: dontMutateMethodOverride
    });
  }
  O.freeze(obj);
  if (deep)
    each(
      obj,
      (_key, value) => {
        freeze(value, true);
      },
      false
    );
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
var dontMutateMethodOverride = {
  [VALUE]: dontMutateFrozenCollections
};
function isFrozen(obj) {
  if (obj === null || !isObjectish(obj))
    return true;
  return O.isFrozen(obj);
}
var PluginMapSet = "MapSet";
var PluginPatches = "Patches";
var PluginArrayMethods = "ArrayMethods";
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var isPluginLoaded = (pluginKey) => !!plugins[pluginKey];
var currentScope;
var getCurrentScope = () => currentScope;
var createScope = (parent_, immer_) => ({
  drafts_: [],
  parent_,
  immer_,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: true,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: isPluginLoaded(PluginMapSet) ? getPlugin(PluginMapSet) : void 0,
  arrayMethodsPlugin_: isPluginLoaded(PluginArrayMethods) ? getPlugin(PluginArrayMethods) : void 0
});
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    scope.patchPlugin_ = getPlugin(PluginPatches);
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
var enterScope = (immer22) => currentScope = createScope(currentScope, immer22);
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
    }
    const { patchPlugin_ } = scope;
    if (patchPlugin_) {
      patchPlugin_.generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope
      );
    }
  } else {
    result = finalize(scope, baseDraft);
  }
  maybeFreeze(scope, result, true);
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    const finalValue = handleValue(value, rootScope.handledSet_, rootScope);
    return finalValue;
  }
  if (!isSameScope(state, rootScope)) {
    return value;
  }
  if (!state.modified_) {
    return state.base_;
  }
  if (!state.finalized_) {
    const { callbacks_ } = state;
    if (callbacks_) {
      while (callbacks_.length > 0) {
        const callback = callbacks_.pop();
        callback(rootScope);
      }
    }
    generatePatchesAndFinalize(state, rootScope);
  }
  return state.copy_;
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function markStateFinalized(state) {
  state.finalized_ = true;
  state.scope_.unfinalizedDrafts_--;
}
var isSameScope = (state, rootScope) => state.scope_ === rootScope;
var EMPTY_LOCATIONS_RESULT = [];
function updateDraftInParent(parent, draftValue, finalizedValue, originalKey) {
  const parentCopy = latest(parent);
  const parentType = parent.type_;
  if (originalKey !== void 0) {
    const currentValue = get(parentCopy, originalKey, parentType);
    if (currentValue === draftValue) {
      set(parentCopy, originalKey, finalizedValue, parentType);
      return;
    }
  }
  if (!parent.draftLocations_) {
    const draftLocations = parent.draftLocations_ = /* @__PURE__ */ new Map();
    each(parentCopy, (key, value) => {
      if (isDraft(value)) {
        const keys = draftLocations.get(value) || [];
        keys.push(key);
        draftLocations.set(value, keys);
      }
    });
  }
  const locations = parent.draftLocations_.get(draftValue) ?? EMPTY_LOCATIONS_RESULT;
  for (const location of locations) {
    set(parentCopy, location, finalizedValue, parentType);
  }
}
function registerChildFinalizationCallback(parent, child, key) {
  parent.callbacks_.push(function childCleanup(rootScope) {
    const state = child;
    if (!state || !isSameScope(state, rootScope)) {
      return;
    }
    rootScope.mapSetPlugin_?.fixSetContents(state);
    const finalizedValue = getFinalValue(state);
    updateDraftInParent(parent, state.draft_ ?? state, finalizedValue, key);
    generatePatchesAndFinalize(state, rootScope);
  });
}
function generatePatchesAndFinalize(state, rootScope) {
  const shouldFinalize = state.modified_ && !state.finalized_ && (state.type_ === 3 || state.type_ === 1 && state.allIndicesReassigned_ || (state.assigned_?.size ?? 0) > 0);
  if (shouldFinalize) {
    const { patchPlugin_ } = rootScope;
    if (patchPlugin_) {
      const basePath = patchPlugin_.getPath(state);
      if (basePath) {
        patchPlugin_.generatePatches_(state, basePath, rootScope);
      }
    }
    markStateFinalized(state);
  }
}
function handleCrossReference(target, key, value) {
  const { scope_ } = target;
  if (isDraft(value)) {
    const state = value[DRAFT_STATE];
    if (isSameScope(state, scope_)) {
      state.callbacks_.push(function crossReferenceCleanup() {
        prepareCopy(target);
        const finalizedValue = getFinalValue(state);
        updateDraftInParent(target, value, finalizedValue, key);
      });
    }
  } else if (isDraftable(value)) {
    target.callbacks_.push(function nestedDraftCleanup() {
      const targetCopy = latest(target);
      if (target.type_ === 3) {
        if (targetCopy.has(value)) {
          handleValue(value, scope_.handledSet_, scope_);
        }
      } else {
        if (get(targetCopy, key, target.type_) === value) {
          if (scope_.drafts_.length > 1 && (target.assigned_.get(key) ?? false) === true && target.copy_) {
            handleValue(
              get(target.copy_, key, target.type_),
              scope_.handledSet_,
              scope_
            );
          }
        }
      }
    });
  }
}
function handleValue(target, handledSet, rootScope) {
  if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
    return target;
  }
  if (isDraft(target) || handledSet.has(target) || !isDraftable(target) || isFrozen(target)) {
    return target;
  }
  handledSet.add(target);
  each(target, (key, value) => {
    if (isDraft(value)) {
      const state = value[DRAFT_STATE];
      if (isSameScope(state, rootScope)) {
        const updatedValue = getFinalValue(state);
        set(target, key, updatedValue, target.type_);
        markStateFinalized(state);
      }
    } else if (isDraftable(value)) {
      handleValue(value, handledSet, rootScope);
    }
  });
  return target;
}
function createProxyProxy(base, parent) {
  const baseIsArray = isArray(base);
  const state = {
    type_: baseIsArray ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let target = state;
  let traps = objectTraps;
  if (baseIsArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return [proxy, state];
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    let arrayPlugin = state.scope_.arrayMethodsPlugin_;
    const isArrayWithStringProp = state.type_ === 1 && typeof prop === "string";
    if (isArrayWithStringProp) {
      if (arrayPlugin?.isArrayOperationMethod(prop)) {
        return arrayPlugin.createMethodInterceptor(state, prop);
      }
    }
    const source = latest(state);
    if (!has(source, prop, state.type_)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (isArrayWithStringProp && state.operationMethod && arrayPlugin?.isMutatingArrayMethod(
      state.operationMethod
    ) && isArrayIndex(prop)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      const childKey = state.type_ === 1 ? +prop : prop;
      const childDraft = createProxy(state.scope_, value, state, childKey);
      return state.copy_[childKey] = childDraft;
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc?.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2?.[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_.set(prop, false);
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop, state.type_)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_.set(prop, true);
    handleCrossReference(state, prop, value);
    return true;
  },
  deleteProperty(state, prop) {
    prepareCopy(state);
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_.set(prop, false);
      markChanged(state);
    } else {
      state.assigned_.delete(prop);
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      [WRITABLE]: true,
      [CONFIGURABLE]: state.type_ !== 1 || prop !== "length",
      [ENUMERABLE]: desc[ENUMERABLE],
      [VALUE]: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
for (let key in objectTraps) {
  let fn = objectTraps[key];
  arrayTraps[key] = function() {
    const args = arguments;
    args[0] = args[0][0];
    return fn.apply(this, args);
  };
}
arrayTraps.deleteProperty = function(state, prop) {
  if (process.env.NODE_ENV !== "production" && isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (process.env.NODE_ENV !== "production" && prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  const desc = getDescriptorFromProto(source, prop);
  return desc ? VALUE in desc ? desc[VALUE] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    desc.get?.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.assigned_ = /* @__PURE__ */ new Map();
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.useStrictIteration_ = false;
    this.produce = (base, recipe, patchListener) => {
      if (isFunction(base) && !isFunction(recipe)) {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (!isFunction(recipe))
        die(6);
      if (patchListener !== void 0 && !isFunction(patchListener))
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(scope, base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || !isObjectish(base)) {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin(PluginPatches).generateReplacementPatches_(base, result, {
            patches_: p,
            inversePatches_: ip
          });
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (isFunction(base)) {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (isBoolean(config?.autoFreeze))
      this.setAutoFreeze(config.autoFreeze);
    if (isBoolean(config?.useStrictShallowCopy))
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    if (isBoolean(config?.useStrictIteration))
      this.setUseStrictIteration(config.useStrictIteration);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(scope, base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(value) {
    this.useStrictIteration_ = value;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin(PluginPatches).applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(rootScope, value, parent, key) {
  const [draft, state] = isMap(value) ? getPlugin(PluginMapSet).proxyMap_(value, parent) : isSet(value) ? getPlugin(PluginMapSet).proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent?.scope_ ?? getCurrentScope();
  scope.drafts_.push(draft);
  state.callbacks_ = parent?.callbacks_ ?? [];
  state.key_ = key;
  if (parent && key !== void 0) {
    registerChildFinalizationCallback(parent, state, key);
  } else {
    state.callbacks_.push(function rootDraftCleanup(rootScope2) {
      rootScope2.mapSetPlugin_?.fixSetContents(state);
      const { patchPlugin_ } = rootScope2;
      if (state.modified_ && patchPlugin_) {
        patchPlugin_.generatePatches_(state, [], rootScope2);
      }
    });
  }
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  let strict = true;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    strict = state.scope_.immer_.shouldUseStrictIteration();
  } else {
    copy = shallowCopy(value, true);
  }
  each(
    copy,
    (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    },
    strict
  );
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
var immer = new Immer2();
var produce = immer.produce;

// node_modules/zustand/esm/middleware/immer.mjs
var immerImpl = (initializer) => (set2, get2, store) => {
  store.setState = (updater, replace, ...args) => {
    const nextState = typeof updater === "function" ? produce(updater) : updater;
    return set2(nextState, replace, ...args);
  };
  return initializer(store.setState, get2, store);
};
var immer2 = immerImpl;

// lib/game-engine/gameState.ts
var initialState = {
  phase: "setup",
  players: [],
  currentPlayerIndex: 0,
  board: {
    tier1: { visible: [], deck: [] },
    tier2: { visible: [], deck: [] },
    tier3: { visible: [], deck: [] },
    nobles: [],
    tokens: emptyGems()
  },
  round: 0,
  lastRound: false,
  winner: null,
  turnLog: [],
  pendingAction: null,
  previousState: null
};
function saveSnapshot(state) {
  const { previousState: _, ...rest } = state;
  return JSON.parse(JSON.stringify(rest));
}
function drawCard(deck) {
  return deck.length > 0 ? deck.pop() : null;
}
function refillSlot(visible, deck, index) {
  visible[index] = drawCard(deck);
}
function addLog(state, message) {
  state.turnLog = [message, ...state.turnLog].slice(0, 20);
}
function checkDiscardNeeded(state) {
  const player = state.players[state.currentPlayerIndex];
  const total = getTokenCount(player);
  if (total > 10) {
    state.phase = "discardTokens";
    state.pendingAction = { type: "discard", tokensToDiscard: total - 10 };
    return true;
  }
  return false;
}
function checkNobles(state) {
  const player = state.players[state.currentPlayerIndex];
  const claimable = getClaimableNobles(player, state.board.nobles);
  if (claimable.length === 0) return false;
  if (claimable.length === 1) {
    const noble = claimable[0];
    player.nobles.push(noble);
    player.prestige += noble.prestige;
    state.board.nobles = state.board.nobles.filter((n2) => n2.id !== noble.id);
    addLog(state, `${player.name} claimed noble ${noble.id}`);
    return false;
  }
  state.phase = "nobleChoice";
  state.pendingAction = { type: "nobleChoice", nobleIds: claimable.map((n2) => n2.id) };
  return true;
}
function advanceTurn(state) {
  const reachedEnd = state.players.some((p) => p.prestige >= 15);
  if (reachedEnd) state.lastRound = true;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  if (state.currentPlayerIndex === 0) {
    state.round++;
    if (state.lastRound) {
      state.phase = "ended";
      state.winner = determineWinner(state.players);
      addLog(state, state.winner ? `${state.winner.name} wins!` : "Game ended in a tie!");
      return;
    }
  }
  state.phase = "playing";
  state.pendingAction = null;
}
function normalizeBoard(board) {
  const getDeck = (t) => {
    const d = board[t].deck;
    if (Array.isArray(d)) return { deck: d, count: d.length };
    return { deck: [], count: d.count };
  };
  const t1 = getDeck("tier1");
  const t2 = getDeck("tier2");
  const t3 = getDeck("tier3");
  const hasCounts = !Array.isArray(board.tier1.deck);
  return {
    board: {
      tier1: { visible: [...board.tier1.visible], deck: t1.deck },
      tier2: { visible: [...board.tier2.visible], deck: t2.deck },
      tier3: { visible: [...board.tier3.visible], deck: t3.deck },
      nobles: [...board.nobles],
      tokens: { ...board.tokens }
    },
    deckCounts: hasCounts ? { tier1: t1.count, tier2: t2.count, tier3: t3.count } : null
  };
}
var useGameStore = create()(
  immer2((set2, get2) => ({
    ...initialState,
    mode: "local",
    yourPlayerId: null,
    deckCounts: null,
    setMode: (mode) => {
      set2((state) => {
        state.mode = mode;
        if (mode === "local") {
          state.yourPlayerId = null;
          state.deckCounts = null;
        }
      });
    },
    setOnlineContext: (playerId) => {
      set2((state) => {
        state.yourPlayerId = playerId;
      });
    },
    syncState: (payload) => {
      set2((state) => {
        const { gameState, yourPlayerId } = payload;
        const { board, deckCounts } = normalizeBoard(gameState.board);
        state.phase = gameState.phase;
        state.players = JSON.parse(JSON.stringify(gameState.players));
        state.currentPlayerIndex = gameState.currentPlayerIndex;
        state.board = board;
        state.deckCounts = deckCounts;
        state.round = gameState.round;
        state.lastRound = gameState.lastRound;
        state.winner = gameState.winner ? { ...gameState.winner } : null;
        state.turnLog = [...gameState.turnLog];
        state.pendingAction = gameState.pendingAction;
        state.previousState = null;
        state.yourPlayerId = yourPlayerId;
        state.mode = "online";
      });
    },
    initGame: (setupPlayers) => {
      set2((state) => {
        state.mode = "local";
        state.yourPlayerId = null;
        state.deckCounts = null;
        const players = setupPlayers.map(
          (sp, i) => createPlayer(`p-${i}`, sp.name, sp.isAI, sp.aiDifficulty)
        );
        const tier1Deck = shuffleDeck([...TIER1_CARDS]);
        const tier2Deck = shuffleDeck([...TIER2_CARDS]);
        const tier3Deck = shuffleDeck([...TIER3_CARDS]);
        const tier1Visible = [];
        const tier2Visible = [];
        const tier3Visible = [];
        for (let i = 0; i < 4; i++) {
          tier1Visible.push(drawCard(tier1Deck));
          tier2Visible.push(drawCard(tier2Deck));
          tier3Visible.push(drawCard(tier3Deck));
        }
        const nobleCount = getNobleCount(players.length);
        const nobles = shuffleDeck([...ALL_NOBLES]).slice(0, nobleCount);
        const tokens = getInitialTokens(players.length);
        state.phase = "playing";
        state.players = players;
        state.currentPlayerIndex = 0;
        state.board = {
          tier1: { visible: tier1Visible, deck: tier1Deck },
          tier2: { visible: tier2Visible, deck: tier2Deck },
          tier3: { visible: tier3Visible, deck: tier3Deck },
          nobles,
          tokens
        };
        state.round = 1;
        state.lastRound = false;
        state.winner = null;
        state.turnLog = ["Game started!"];
        state.pendingAction = null;
        state.previousState = null;
      });
    },
    takeThreeTokens: (colors) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "playing") return;
        if (!canTakeThreeTokens(colors, state.board.tokens)) return;
        state.previousState = saveSnapshot(state);
        const player = state.players[state.currentPlayerIndex];
        for (const color of colors) {
          state.board.tokens[color]--;
          player.gems[color]++;
        }
        addLog(state, `${player.name} took ${colors.length} tokens: ${colors.join(", ")}`);
        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },
    takeTwoTokens: (color) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "playing") return;
        if (!canTakeTwoTokens(color, state.board.tokens)) return;
        state.previousState = saveSnapshot(state);
        const player = state.players[state.currentPlayerIndex];
        state.board.tokens[color] -= 2;
        player.gems[color] += 2;
        addLog(state, `${player.name} took 2 ${color} tokens`);
        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },
    purchaseCard: (cardId) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "playing") return;
        const player = state.players[state.currentPlayerIndex];
        let card = null;
        let source = "board";
        let boardLocation = null;
        let reservedIndex = -1;
        boardLocation = findCardOnBoard(state.board, cardId);
        if (boardLocation) {
          card = state.board[boardLocation.tier].visible[boardLocation.index];
          source = "board";
        } else {
          reservedIndex = findCardInReserved(player, cardId);
          if (reservedIndex !== -1) {
            const reservedCard = player.reservedCards[reservedIndex];
            if (!("hidden" in reservedCard)) {
              card = reservedCard;
              source = "reserved";
            }
          }
        }
        if (!card || !canPurchaseCard(player, card)) return;
        state.previousState = saveSnapshot(state);
        const payment = calculateGemPayment(player, card);
        for (const gemType of [...GEM_COLORS, "gold"]) {
          player.gems[gemType] -= payment[gemType];
          state.board.tokens[gemType] += payment[gemType];
        }
        player.purchasedCards.push(card);
        player.bonuses[card.bonus]++;
        player.prestige += card.prestige;
        if (source === "board" && boardLocation) {
          refillSlot(
            state.board[boardLocation.tier].visible,
            state.board[boardLocation.tier].deck,
            boardLocation.index
          );
        } else if (source === "reserved") {
          player.reservedCards.splice(reservedIndex, 1);
        }
        addLog(
          state,
          `${player.name} purchased ${card.bonus} card (${card.prestige}pts)`
        );
        if (!checkNobles(state)) {
          advanceTurn(state);
        }
      });
    },
    reserveCard: (cardId) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "playing") return;
        const player = state.players[state.currentPlayerIndex];
        if (!canReserveCard(player)) return;
        const boardLocation = findCardOnBoard(state.board, cardId);
        if (!boardLocation) return;
        const card = state.board[boardLocation.tier].visible[boardLocation.index];
        if (!card) return;
        state.previousState = saveSnapshot(state);
        player.reservedCards.push(card);
        refillSlot(
          state.board[boardLocation.tier].visible,
          state.board[boardLocation.tier].deck,
          boardLocation.index
        );
        if (state.board.tokens.gold > 0) {
          state.board.tokens.gold--;
          player.gems.gold++;
        }
        addLog(state, `${player.name} reserved a card`);
        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },
    reserveFromDeck: (tier) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "playing") return;
        const player = state.players[state.currentPlayerIndex];
        if (!canReserveCard(player)) return;
        const tierKey = `tier${tier}`;
        const deck = state.board[tierKey].deck;
        if (deck.length === 0) return;
        state.previousState = saveSnapshot(state);
        const card = deck.pop();
        player.reservedCards.push(card);
        if (state.board.tokens.gold > 0) {
          state.board.tokens.gold--;
          player.gems.gold++;
        }
        addLog(state, `${player.name} reserved from tier ${tier} deck`);
        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },
    discardTokens: (tokens) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "discardTokens") return;
        const player = state.players[state.currentPlayerIndex];
        let totalDiscarded = 0;
        for (const [gem, count] of Object.entries(tokens)) {
          const g = gem;
          const c2 = count || 0;
          if (c2 > player.gems[g]) return;
          totalDiscarded += c2;
        }
        if (state.pendingAction?.type !== "discard") return;
        if (totalDiscarded !== state.pendingAction.tokensToDiscard) return;
        for (const [gem, count] of Object.entries(tokens)) {
          const g = gem;
          const c2 = count || 0;
          player.gems[g] -= c2;
          state.board.tokens[g] += c2;
        }
        state.pendingAction = null;
        addLog(state, `${player.name} discarded ${totalDiscarded} tokens`);
        if (!checkNobles(state)) {
          advanceTurn(state);
        }
      });
    },
    claimNoble: (nobleId) => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "nobleChoice") return;
        const player = state.players[state.currentPlayerIndex];
        const noble = state.board.nobles.find((n2) => n2.id === nobleId);
        if (!noble) return;
        player.nobles.push(noble);
        player.prestige += noble.prestige;
        state.board.nobles = state.board.nobles.filter((n2) => n2.id !== nobleId);
        state.pendingAction = null;
        addLog(state, `${player.name} claimed noble ${nobleId}`);
        advanceTurn(state);
      });
    },
    endTurn: () => {
      if (get2().mode === "online") return;
      set2((state) => {
        if (state.phase !== "playing") return;
        advanceTurn(state);
      });
    },
    undo: () => {
      if (get2().mode === "online") return;
      const prev = get2().previousState;
      if (!prev) return;
      set2(() => ({ ...prev, previousState: null }));
    },
    executeAITurn: () => {
    }
  }))
);

// lib/game-engine/aiLogic.ts
function getAllVisibleCards(state) {
  return [
    ...state.board.tier1.visible,
    ...state.board.tier2.visible,
    ...state.board.tier3.visible
  ].filter(Boolean);
}
function getReservedAsCards(player) {
  return player.reservedCards.filter((c2) => !("hidden" in c2));
}
function getPurchasableCards(player, state) {
  const visible = getAllVisibleCards(state);
  const reserved = getReservedAsCards(player);
  return [...visible, ...reserved].filter((c2) => canPurchaseCard(player, c2));
}
function getValidTokenActions(state) {
  const actions = [];
  const available = getAvailableTokenColors(state.board.tokens);
  for (const color of GEM_COLORS) {
    if (canTakeTwoTokens(color, state.board.tokens)) {
      actions.push({ type: "takeTwo", color });
    }
  }
  if (available.length >= 3) {
    for (let i = 0; i < available.length - 2; i++) {
      for (let j = i + 1; j < available.length - 1; j++) {
        for (let k = j + 1; k < available.length; k++) {
          actions.push({ type: "takeThree", colors: [available[i], available[j], available[k]] });
        }
      }
    }
  } else if (available.length === 2) {
    actions.push({ type: "takeThree", colors: [available[0], available[1]] });
  } else if (available.length === 1) {
    actions.push({ type: "takeThree", colors: [available[0]] });
  }
  return actions;
}
function getAllValidActions(player, state) {
  const actions = [];
  const purchasable = getPurchasableCards(player, state);
  for (const card of purchasable) {
    actions.push({ type: "purchase", cardId: card.id });
  }
  if (canReserveCard(player)) {
    const visible = getAllVisibleCards(state);
    for (const card of visible) {
      actions.push({ type: "reserve", cardId: card.id });
    }
    for (const tier of [1, 2, 3]) {
      const tierKey = `tier${tier}`;
      if (state.board[tierKey].deck.length > 0) {
        actions.push({ type: "reserveDeck", tier });
      }
    }
  }
  actions.push(...getValidTokenActions(state));
  return actions;
}
function turnsToAfford(player, card) {
  let deficit = 0;
  for (const color of GEM_COLORS) {
    const cost = card.cost[color] || 0;
    const have = player.gems[color] + player.bonuses[color];
    if (cost > have) deficit += cost - have;
  }
  return Math.ceil(deficit / 3);
}
function cardAdvancesNoble(card, nobles) {
  let best = 0;
  for (const noble of nobles) {
    const req = noble.requirements[card.bonus] || 0;
    if (req > 0) best = Math.max(best, 1);
  }
  return best;
}
function easyAI(player, state) {
  const actions = getAllValidActions(player, state);
  if (actions.length === 0) {
    const available = getAvailableTokenColors(state.board.tokens);
    if (available.length > 0) {
      return { type: "takeThree", colors: available.slice(0, Math.min(3, available.length)) };
    }
    return { type: "reserveDeck", tier: 1 };
  }
  const purchases = actions.filter((a) => a.type === "purchase");
  if (purchases.length > 0 && Math.random() < 0.6) {
    return purchases[Math.floor(Math.random() * purchases.length)];
  }
  return actions[Math.floor(Math.random() * actions.length)];
}
function mediumAI(player, state) {
  const actions = getAllValidActions(player, state);
  if (actions.length === 0) {
    const available = getAvailableTokenColors(state.board.tokens);
    return { type: "takeThree", colors: available.slice(0, Math.min(3, available.length)) };
  }
  const scored = actions.map((action) => {
    let score = 0;
    if (action.type === "purchase") {
      const card = [...getAllVisibleCards(state), ...getReservedAsCards(player)].find((c2) => c2.id === action.cardId);
      if (card) {
        score += card.prestige * 20;
        score += cardAdvancesNoble(card, state.board.nobles) * 15;
        score += 10;
      }
    }
    if (action.type === "takeThree" || action.type === "takeTwo") {
      const allCards = getAllVisibleCards(state);
      const cheapest = allCards.filter((c2) => !canPurchaseCard(player, c2)).sort((a, b) => turnsToAfford(player, a) - turnsToAfford(player, b));
      if (cheapest.length > 0) {
        const target = cheapest[0];
        if (action.type === "takeThree") {
          for (const color of action.colors) {
            if ((target.cost[color] || 0) > player.gems[color] + player.bonuses[color]) {
              score += 3;
            }
          }
        } else {
          if ((target.cost[action.color] || 0) > player.gems[action.color] + player.bonuses[action.color]) {
            score += 5;
          }
        }
      }
      score += 2;
    }
    if (action.type === "reserve") {
      const card = getAllVisibleCards(state).find((c2) => c2.id === action.cardId);
      if (card && turnsToAfford(player, card) <= 2) {
        score += card.prestige * 5 + 5;
      } else {
        score += 1;
      }
    }
    if (action.type === "reserveDeck") {
      score += 1;
    }
    return { action, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].action;
}
function hardAI(player, state) {
  const actions = getAllValidActions(player, state);
  if (actions.length === 0) {
    const available = getAvailableTokenColors(state.board.tokens);
    return { type: "takeThree", colors: available.slice(0, Math.min(3, available.length)) };
  }
  const purchases = actions.filter((a) => a.type === "purchase");
  if (purchases.length > 0) {
    let bestPurchase = purchases[0];
    let bestScore = -Infinity;
    for (const action of purchases) {
      const card = [...getAllVisibleCards(state), ...getReservedAsCards(player)].find((c2) => c2.id === action.cardId);
      if (!card) continue;
      let score = card.prestige * 20;
      score += cardAdvancesNoble(card, state.board.nobles) * 15;
      const claimableAfter = getClaimableNobles(
        {
          ...player,
          bonuses: { ...player.bonuses, [card.bonus]: player.bonuses[card.bonus] + 1 },
          prestige: player.prestige + card.prestige
        },
        state.board.nobles
      );
      score += claimableAfter.length * 30;
      if (score > bestScore) {
        bestScore = score;
        bestPurchase = action;
      }
    }
    return bestPurchase;
  }
  const opponents = state.players.filter((p) => p.id !== player.id);
  const opponentTargetColors = /* @__PURE__ */ new Set();
  for (const opp of opponents) {
    for (const color of GEM_COLORS) {
      if (opp.gems[color] >= 3) opponentTargetColors.add(color);
    }
  }
  const reserveActions = actions.filter((a) => a.type === "reserve");
  if (reserveActions.length > 0 && player.reservedCards.length < 2) {
    const visible = getAllVisibleCards(state);
    const highValue = visible.filter((c2) => c2.prestige >= 3 && turnsToAfford(player, c2) <= 2).sort((a, b) => b.prestige - a.prestige);
    if (highValue.length > 0) {
      return { type: "reserve", cardId: highValue[0].id };
    }
    for (const opp of opponents) {
      if (opp.prestige >= 12) {
        const oppPurchasable = visible.filter((c2) => canPurchaseCard(opp, c2) && c2.prestige >= 2);
        if (oppPurchasable.length > 0) {
          return { type: "reserve", cardId: oppPurchasable[0].id };
        }
      }
    }
  }
  const tokenActions = actions.filter(
    (a) => a.type === "takeThree" || a.type === "takeTwo"
  );
  if (tokenActions.length > 0) {
    const allCards = [...getAllVisibleCards(state), ...getReservedAsCards(player)];
    const nearPurchase = allCards.sort((a, b) => {
      const scoreA = a.prestige * 3 + cardAdvancesNoble(a, state.board.nobles) * 2 - turnsToAfford(player, a);
      const scoreB = b.prestige * 3 + cardAdvancesNoble(b, state.board.nobles) * 2 - turnsToAfford(player, b);
      return scoreB - scoreA;
    });
    const target = nearPurchase[0];
    if (target) {
      const neededColors = [];
      for (const color of GEM_COLORS) {
        const cost = target.cost[color] || 0;
        const have = player.gems[color] + player.bonuses[color];
        if (cost > have) neededColors.push(color);
      }
      const takeThreeMatch = tokenActions.filter((a) => {
        if (a.type !== "takeThree") return false;
        return a.colors.some((c2) => neededColors.includes(c2));
      });
      if (takeThreeMatch.length > 0) {
        takeThreeMatch.sort((a, b) => {
          if (a.type !== "takeThree" || b.type !== "takeThree") return 0;
          const aMatch = a.colors.filter((c2) => neededColors.includes(c2)).length;
          const bMatch = b.colors.filter((c2) => neededColors.includes(c2)).length;
          return bMatch - aMatch;
        });
        return takeThreeMatch[0];
      }
      const takeTwoMatch = tokenActions.filter(
        (a) => a.type === "takeTwo" && neededColors.includes(a.color)
      );
      if (takeTwoMatch.length > 0) return takeTwoMatch[0];
    }
    return tokenActions[0];
  }
  return actions[0];
}
function getAIAction(player, state) {
  switch (player.aiDifficulty) {
    case "easy":
      return easyAI(player, state);
    case "medium":
      return mediumAI(player, state);
    case "hard":
      return hardAI(player, state);
    default:
      return easyAI(player, state);
  }
}
function getAIDiscardTokens(player, tokensToDiscard) {
  const discard = {};
  let remaining = tokensToDiscard;
  const priority = ["onyx", "ruby", "emerald", "sapphire", "diamond", "gold"];
  for (const color of priority) {
    if (remaining <= 0) break;
    const available = player.gems[color];
    if (available > 0) {
      const take = Math.min(available, remaining);
      discard[color] = take;
      remaining -= take;
    }
  }
  return discard;
}

// server/GameRoom.ts
function drawCard2(deck) {
  return deck.length > 0 ? deck.pop() : null;
}
function refillSlot2(visible, deck, index) {
  visible[index] = drawCard2(deck);
}
function addLog2(state, message) {
  state.turnLog = [message, ...state.turnLog].slice(0, 20);
}
function checkDiscardNeeded2(state) {
  const player = state.players[state.currentPlayerIndex];
  const total = getTokenCount(player);
  if (total > 10) {
    state.phase = "discardTokens";
    state.pendingAction = { type: "discard", tokensToDiscard: total - 10 };
    return true;
  }
  return false;
}
function checkNobles2(state) {
  const player = state.players[state.currentPlayerIndex];
  const claimable = getClaimableNobles(player, state.board.nobles);
  if (claimable.length === 0) return false;
  if (claimable.length === 1) {
    const noble = claimable[0];
    player.nobles.push(noble);
    player.prestige += noble.prestige;
    state.board.nobles = state.board.nobles.filter((n2) => n2.id !== noble.id);
    addLog2(state, `${player.name} claimed noble ${noble.id}`);
    return false;
  }
  state.phase = "nobleChoice";
  state.pendingAction = { type: "nobleChoice", nobleIds: claimable.map((n2) => n2.id) };
  return true;
}
function advanceTurn2(state) {
  const reachedEnd = state.players.some((p) => p.prestige >= 15);
  if (reachedEnd) state.lastRound = true;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  if (state.currentPlayerIndex === 0) {
    state.round++;
    if (state.lastRound) {
      state.phase = "ended";
      state.winner = determineWinner(state.players);
      addLog2(state, state.winner ? `${state.winner.name} wins!` : "Game ended in a tie!");
      return;
    }
  }
  state.phase = "playing";
  state.pendingAction = null;
}
var GameRoomLogic = class {
  state;
  onStateChange = null;
  constructor(room) {
    const setupPlayers = room.players.map((p) => ({
      name: p.playerName,
      isAI: p.isAI,
      aiDifficulty: p.aiDifficulty
    }));
    const players = setupPlayers.map(
      (sp, i) => createPlayer(room.players[i].playerId, sp.name, sp.isAI, sp.aiDifficulty)
    );
    const tier1Deck = shuffleDeck([...TIER1_CARDS]);
    const tier2Deck = shuffleDeck([...TIER2_CARDS]);
    const tier3Deck = shuffleDeck([...TIER3_CARDS]);
    const tier1Visible = [];
    const tier2Visible = [];
    const tier3Visible = [];
    for (let i = 0; i < 4; i++) {
      tier1Visible.push(drawCard2(tier1Deck));
      tier2Visible.push(drawCard2(tier2Deck));
      tier3Visible.push(drawCard2(tier3Deck));
    }
    const nobleCount = getNobleCount(players.length);
    const nobles = shuffleDeck([...ALL_NOBLES]).slice(0, nobleCount);
    const tokens = getInitialTokens(players.length);
    this.state = {
      phase: "playing",
      players,
      currentPlayerIndex: 0,
      board: {
        tier1: { visible: tier1Visible, deck: tier1Deck },
        tier2: { visible: tier2Visible, deck: tier2Deck },
        tier3: { visible: tier3Visible, deck: tier3Deck },
        nobles,
        tokens
      },
      round: 1,
      lastRound: false,
      winner: null,
      turnLog: ["Game started!"],
      pendingAction: null,
      previousState: null
    };
  }
  getState() {
    return this.state;
  }
  postAction() {
    const state = this.state;
    if (!checkDiscardNeeded2(state)) {
      if (!checkNobles2(state)) {
        advanceTurn2(state);
        this.maybeRunAI();
      }
    }
    this.onStateChange?.();
  }
  maybeRunAI() {
    const state = this.state;
    if (state.phase === "ended") return;
    const current2 = state.players[state.currentPlayerIndex];
    if (!current2.isAI) return;
    setTimeout(() => this.runAITurn(), 800 + Math.random() * 700);
  }
  runAITurn() {
    const state = this.state;
    const player = state.players[state.currentPlayerIndex];
    if (!player.isAI) return;
    if (state.phase === "discardTokens" && state.pendingAction?.type === "discard") {
      const toDiscard = getAIDiscardTokens(player, state.pendingAction.tokensToDiscard);
      this.applyDiscardTokens(toDiscard);
      this.onStateChange?.();
      return;
    }
    if (state.phase === "nobleChoice" && state.pendingAction?.type === "nobleChoice") {
      this.applyClaimNoble(state.pendingAction.nobleIds[0]);
      this.onStateChange?.();
      return;
    }
    if (state.phase === "playing") {
      const aiAction = getAIAction(player, state);
      const payload = this.aiActionToPayload(aiAction);
      if (payload) this.applyAction(payload);
    }
  }
  aiActionToPayload(aiAction) {
    switch (aiAction.type) {
      case "takeThree":
        return { type: "takeThreeTokens", payload: { colors: aiAction.colors } };
      case "takeTwo":
        return { type: "takeTwoTokens", payload: { color: aiAction.color } };
      case "purchase":
        return { type: "purchaseCard", payload: { cardId: aiAction.cardId } };
      case "reserve":
        return { type: "reserveCard", payload: { cardId: aiAction.cardId } };
      case "reserveDeck":
        return { type: "reserveFromDeck", payload: { tier: aiAction.tier } };
      default:
        return null;
    }
  }
  applyAction(payload) {
    switch (payload.type) {
      case "takeThreeTokens":
        this.applyTakeThreeTokens(payload.payload.colors);
        break;
      case "takeTwoTokens":
        this.applyTakeTwoTokens(payload.payload.color);
        break;
      case "purchaseCard":
        this.applyPurchaseCard(payload.payload.cardId);
        break;
      case "reserveCard":
        this.applyReserveCard(payload.payload.cardId);
        break;
      case "reserveFromDeck":
        this.applyReserveFromDeck(payload.payload.tier);
        break;
      case "discardTokens":
        this.applyDiscardTokens(payload.payload.tokens);
        break;
      case "claimNoble":
        this.applyClaimNoble(payload.payload.nobleId);
        break;
    }
  }
  applyTakeThreeTokens(colors) {
    const state = this.state;
    if (state.phase !== "playing" || !canTakeThreeTokens(colors, state.board.tokens)) return;
    const player = state.players[state.currentPlayerIndex];
    for (const color of colors) {
      state.board.tokens[color]--;
      player.gems[color]++;
    }
    addLog2(state, `${player.name} took ${colors.length} tokens: ${colors.join(", ")}`);
    this.postAction();
  }
  applyTakeTwoTokens(color) {
    const state = this.state;
    if (state.phase !== "playing" || !canTakeTwoTokens(color, state.board.tokens)) return;
    const player = state.players[state.currentPlayerIndex];
    state.board.tokens[color] -= 2;
    player.gems[color] += 2;
    addLog2(state, `${player.name} took 2 ${color} tokens`);
    this.postAction();
  }
  applyPurchaseCard(cardId) {
    const state = this.state;
    if (state.phase !== "playing") return;
    const player = state.players[state.currentPlayerIndex];
    let card = null;
    let source = "board";
    let boardLocation = null;
    let reservedIndex = -1;
    boardLocation = findCardOnBoard(state.board, cardId);
    if (boardLocation) {
      card = state.board[boardLocation.tier].visible[boardLocation.index];
      source = "board";
    } else {
      reservedIndex = findCardInReserved(player, cardId);
      if (reservedIndex !== -1) {
        const reservedCard = player.reservedCards[reservedIndex];
        if (!("hidden" in reservedCard)) {
          card = reservedCard;
          source = "reserved";
        }
      }
    }
    if (!card || !canPurchaseCard(player, card)) return;
    const payment = calculateGemPayment(player, card);
    for (const gemType of [...GEM_COLORS, "gold"]) {
      player.gems[gemType] -= payment[gemType];
      state.board.tokens[gemType] += payment[gemType];
    }
    player.purchasedCards.push(card);
    player.bonuses[card.bonus]++;
    player.prestige += card.prestige;
    if (source === "board" && boardLocation) {
      refillSlot2(
        state.board[boardLocation.tier].visible,
        state.board[boardLocation.tier].deck,
        boardLocation.index
      );
    } else if (source === "reserved") {
      player.reservedCards.splice(reservedIndex, 1);
    }
    addLog2(state, `${player.name} purchased ${card.bonus} card (${card.prestige}pts)`);
    if (!checkNobles2(state)) {
      advanceTurn2(state);
      this.maybeRunAI();
    }
    this.onStateChange?.();
  }
  applyReserveCard(cardId) {
    const state = this.state;
    if (state.phase !== "playing") return;
    const player = state.players[state.currentPlayerIndex];
    if (!canReserveCard(player)) return;
    const boardLocation = findCardOnBoard(state.board, cardId);
    if (!boardLocation) return;
    const card = state.board[boardLocation.tier].visible[boardLocation.index];
    if (!card) return;
    player.reservedCards.push(card);
    refillSlot2(
      state.board[boardLocation.tier].visible,
      state.board[boardLocation.tier].deck,
      boardLocation.index
    );
    if (state.board.tokens.gold > 0) {
      state.board.tokens.gold--;
      player.gems.gold++;
    }
    addLog2(state, `${player.name} reserved a card`);
    this.postAction();
  }
  applyReserveFromDeck(tier) {
    const state = this.state;
    if (state.phase !== "playing") return;
    const player = state.players[state.currentPlayerIndex];
    if (!canReserveCard(player)) return;
    const tierKey = `tier${tier}`;
    const deck = state.board[tierKey].deck;
    if (deck.length === 0) return;
    const card = deck.pop();
    player.reservedCards.push(card);
    if (state.board.tokens.gold > 0) {
      state.board.tokens.gold--;
      player.gems.gold++;
    }
    addLog2(state, `${player.name} reserved from tier ${tier} deck`);
    this.postAction();
  }
  applyDiscardTokens(tokens) {
    const state = this.state;
    if (state.phase !== "discardTokens") return;
    const player = state.players[state.currentPlayerIndex];
    let totalDiscarded = 0;
    for (const [gem, count] of Object.entries(tokens)) {
      const g = gem;
      const c2 = count ?? 0;
      if (c2 > player.gems[g]) return;
      totalDiscarded += c2;
    }
    if (state.pendingAction?.type !== "discard") return;
    if (totalDiscarded !== state.pendingAction.tokensToDiscard) return;
    for (const [gem, count] of Object.entries(tokens)) {
      const g = gem;
      const c2 = count ?? 0;
      player.gems[g] -= c2;
      state.board.tokens[g] += c2;
    }
    state.pendingAction = null;
    addLog2(state, `${player.name} discarded ${totalDiscarded} tokens`);
    if (!checkNobles2(state)) {
      advanceTurn2(state);
      this.maybeRunAI();
    }
  }
  applyClaimNoble(nobleId) {
    const state = this.state;
    if (state.phase !== "nobleChoice") return;
    const player = state.players[state.currentPlayerIndex];
    const noble = state.board.nobles.find((n2) => n2.id === nobleId);
    if (!noble) return;
    player.nobles.push(noble);
    player.prestige += noble.prestige;
    state.board.nobles = state.board.nobles.filter((n2) => n2.id !== nobleId);
    state.pendingAction = null;
    addLog2(state, `${player.name} claimed noble ${nobleId}`);
    advanceTurn2(state);
    this.maybeRunAI();
    this.onStateChange?.();
  }
  handleAction(playerId, payload) {
    const state = this.state;
    const current2 = state.players[state.currentPlayerIndex];
    if (current2.id !== playerId) return "Not your turn";
    switch (payload.type) {
      case "takeThreeTokens":
        if (state.phase !== "playing") return "Invalid phase";
        if (!canTakeThreeTokens(payload.payload.colors, state.board.tokens)) return "Invalid token selection";
        this.applyTakeThreeTokens(payload.payload.colors);
        break;
      case "takeTwoTokens":
        if (state.phase !== "playing") return "Invalid phase";
        if (!canTakeTwoTokens(payload.payload.color, state.board.tokens)) return "Cannot take 2 of that color";
        this.applyTakeTwoTokens(payload.payload.color);
        break;
      case "purchaseCard":
        if (state.phase !== "playing") return "Invalid phase";
        this.applyPurchaseCard(payload.payload.cardId);
        break;
      case "reserveCard":
        if (state.phase !== "playing") return "Invalid phase";
        this.applyReserveCard(payload.payload.cardId);
        break;
      case "reserveFromDeck":
        if (state.phase !== "playing") return "Invalid phase";
        this.applyReserveFromDeck(payload.payload.tier);
        break;
      case "discardTokens":
        if (state.phase !== "discardTokens") return "Invalid phase";
        this.applyDiscardTokens(payload.payload.tokens);
        break;
      case "claimNoble":
        if (state.phase !== "nobleChoice") return "Invalid phase";
        this.applyClaimNoble(payload.payload.nobleId);
        break;
      default:
        return "Unknown action";
    }
    return null;
  }
};

// server/sanitize.ts
function sanitizeForPlayer(state, playerId) {
  const players = state.players.map((p) => {
    const base = { ...p, gems: { ...p.gems }, bonuses: { ...p.bonuses } };
    if (p.id === playerId) {
      return { ...base, purchasedCards: [...p.purchasedCards], reservedCards: [...p.reservedCards], nobles: [...p.nobles] };
    }
    const hiddenReserved = p.reservedCards.map((_, i) => ({
      id: `hidden-${p.id}-${i}`,
      tier: 1,
      hidden: true
    }));
    return { ...base, purchasedCards: [...p.purchasedCards], reservedCards: hiddenReserved, nobles: [...p.nobles] };
  });
  const board = {
    tier1: { visible: [...state.board.tier1.visible], deck: { count: state.board.tier1.deck.length } },
    tier2: { visible: [...state.board.tier2.visible], deck: { count: state.board.tier2.deck.length } },
    tier3: { visible: [...state.board.tier3.visible], deck: { count: state.board.tier3.deck.length } },
    nobles: [...state.board.nobles],
    tokens: { ...state.board.tokens }
  };
  return {
    phase: state.phase,
    players,
    currentPlayerIndex: state.currentPlayerIndex,
    board,
    round: state.round,
    lastRound: state.lastRound,
    winner: state.winner ? { ...state.winner, reservedCards: [] } : null,
    turnLog: [...state.turnLog],
    pendingAction: state.pendingAction,
    previousState: null
  };
}

// server/protocol.ts
var CLIENT_EVENTS = {
  createRoom: "createRoom",
  joinRoom: "joinRoom",
  leaveRoom: "leaveRoom",
  addAI: "addAI",
  startGame: "startGame",
  action: "action",
  rejoinRoom: "rejoinRoom"
};
var SERVER_EVENTS = {
  roomCreated: "roomCreated",
  roomJoined: "roomJoined",
  roomUpdate: "roomUpdate",
  roomClosed: "roomClosed",
  gameState: "gameState",
  actionError: "actionError",
  playerDisconnected: "playerDisconnected",
  playerReconnected: "playerReconnected"
};

// server/index.ts
var PORT = process.env.GAME_SERVER_PORT ? parseInt(process.env.GAME_SERVER_PORT, 10) : 3001;
var CORS_ORIGINS = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : ["http://localhost:3000", "http://127.0.0.1:3000", "http://172.17.121.16:3000"];
var app = express();
var httpServer = createServer(app);
var DISCONNECT_GRACE_MS = 15e3;
var io = new Server(httpServer, {
  pingTimeout: 6e4,
  pingInterval: 25e3,
  cors: {
    origin: (origin, cb) => {
      if (!origin || CORS_ORIGINS.includes(origin)) return cb(null, true);
      if (!process.env.CORS_ORIGIN && /^https?:\/\/[^/]+:3000\/?$/.test(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"]
  }
});
var pendingDisconnects = /* @__PURE__ */ new Map();
var gameRooms = /* @__PURE__ */ new Map();
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "splendor-game-server" });
});
function broadcastRoomUpdate(roomCode) {
  const room = RoomManager.getRoom(roomCode);
  if (!room) return;
  const payload = RoomManager.toRoomUpdatePayload(room);
  const socketIds = RoomManager.getSocketIdsInRoom(room);
  for (const id of socketIds) {
    io.to(id).emit(SERVER_EVENTS.roomUpdate, payload);
  }
}
function broadcastGameState(roomCode) {
  const game = gameRooms.get(roomCode);
  const room = RoomManager.getRoom(roomCode);
  if (!game || !room) return;
  const state = game.getState();
  const socketIds = RoomManager.getSocketIdsInRoom(room);
  for (const rp of room.players) {
    if (rp.socketId) {
      const sanitized = sanitizeForPlayer(state, rp.playerId);
      io.to(rp.socketId).emit(SERVER_EVENTS.gameState, { gameState: sanitized, yourPlayerId: rp.playerId });
    }
  }
}
io.on("connection", (socket) => {
  socket.on(CLIENT_EVENTS.createRoom, (payload) => {
    const result = RoomManager.createRoom(socket.id, payload.playerName.trim() || "Player");
    if (!result) {
      socket.emit(SERVER_EVENTS.actionError, { message: "Failed to create room" });
      return;
    }
    socket.join(result.roomCode);
    socket.emit(SERVER_EVENTS.roomCreated, { roomCode: result.roomCode, playerId: result.playerId });
    broadcastRoomUpdate(result.roomCode);
  });
  socket.on(CLIENT_EVENTS.joinRoom, (payload) => {
    const result = RoomManager.joinRoom(payload.roomCode, socket.id, payload.playerName.trim() || "Player");
    if (!result) {
      socket.emit(SERVER_EVENTS.actionError, { message: "Room not found, full, or game already started" });
      return;
    }
    socket.join(payload.roomCode.toUpperCase().trim());
    socket.emit(SERVER_EVENTS.roomJoined, { roomCode: payload.roomCode.toUpperCase().trim(), playerId: result.playerId });
    broadcastRoomUpdate(payload.roomCode.toUpperCase().trim());
  });
  socket.on(CLIENT_EVENTS.leaveRoom, () => {
    const result = RoomManager.leaveRoom(socket.id);
    if (result) {
      socket.leave(result.roomCode);
      broadcastRoomUpdate(result.roomCode);
    }
  });
  socket.on(CLIENT_EVENTS.addAI, (payload) => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const ok = RoomManager.addAI(info.room.roomCode, socket.id, payload.difficulty);
    if (ok) broadcastRoomUpdate(info.room.roomCode);
  });
  socket.on(CLIENT_EVENTS.rejoinRoom, (payload) => {
    const pending = pendingDisconnects.get(payload.playerId);
    if (pending) {
      clearTimeout(pending.timer);
      pendingDisconnects.delete(payload.playerId);
    }
    const ok = RoomManager.rejoinRoom(payload.roomCode, payload.playerId, socket.id);
    if (!ok) {
      socket.emit(SERVER_EVENTS.actionError, { message: "Could not rejoin room" });
      return;
    }
    const code = payload.roomCode.toUpperCase().trim();
    const room = RoomManager.getRoom(code);
    if (room) {
      socket.join(room.roomCode);
      const payloadUpdate = RoomManager.toRoomUpdatePayload(room);
      socket.emit(SERVER_EVENTS.roomUpdate, payloadUpdate);
      const game = gameRooms.get(room.roomCode);
      if (game) {
        const sanitized = sanitizeForPlayer(game.getState(), payload.playerId);
        socket.emit(SERVER_EVENTS.gameState, { gameState: sanitized, yourPlayerId: payload.playerId });
      }
      io.to(room.roomCode).emit(SERVER_EVENTS.playerReconnected, { playerId: payload.playerId });
      broadcastRoomUpdate(code);
    }
  });
  socket.on(CLIENT_EVENTS.startGame, () => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const { room } = info;
    if (room.hostId !== info.playerId) return;
    if (room.gameStarted) return;
    if (room.players.length < 2 || room.players.length > 4) return;
    RoomManager.setGameStarted(room.roomCode);
    const game = new GameRoomLogic(room);
    game.onStateChange = () => broadcastGameState(room.roomCode);
    gameRooms.set(room.roomCode, game);
    broadcastGameState(room.roomCode);
    const currentPlayer = game.getState().players[game.getState().currentPlayerIndex];
    if (currentPlayer?.isAI) {
      game.runAITurn();
    }
  });
  socket.on(CLIENT_EVENTS.action, (payload) => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const game = gameRooms.get(info.room.roomCode);
    if (!game) return;
    const err = game.handleAction(info.playerId, payload);
    if (err) {
      socket.emit(SERVER_EVENTS.actionError, { message: err });
      return;
    }
    broadcastGameState(info.room.roomCode);
  });
  socket.on("disconnect", () => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const { room, playerId } = info;
    const player = room.players.find((p) => p.playerId === playerId);
    if (!player || player.isAI) return;
    const roomCode = room.roomCode;
    const playerName = player.playerName;
    const oldSocketId = socket.id;
    socket.leave(roomCode);
    RoomManager.setPlayerDisconnected(oldSocketId);
    broadcastRoomUpdate(roomCode);
    const timer = setTimeout(() => {
      pendingDisconnects.delete(playerId);
      io.to(roomCode).emit(SERVER_EVENTS.playerDisconnected, {
        playerId,
        playerName
      });
    }, DISCONNECT_GRACE_MS);
    pendingDisconnects.set(playerId, {
      socketId: oldSocketId,
      roomCode,
      playerId,
      playerName,
      timer
    });
  });
});
httpServer.listen(PORT, () => {
  console.log(`Splendor game server listening on port ${PORT}`);
  console.log(`CORS origins: ${CORS_ORIGINS.join(", ")}`);
});
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=index.mjs.map
