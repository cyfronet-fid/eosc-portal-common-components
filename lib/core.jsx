import React, { PureComponent } from "react";
import uniqueId from "lodash-es/uniqueId";
import { render } from "react-dom";
import startCase from "lodash-es/startCase";
import { GRID_KEYS } from "./globals";
import rwdHOC from "./rwd.hoc";

export class EoscPureComponent extends PureComponent {
  constructor(props) {
    super(props);

    if (EoscPureComponent.defaultProps) {
      Object.keys(EoscPureComponent.defaultProps)
        .filter((key) => this[key] === undefined)
        .forEach((key) => {
          this[key] = EoscPureComponent.defaultProps[key];
        });
    }
  }
}

/// /////////////////////////////////////
// CALLBACKS
/// /////////////////////////////////////

/**
 * Run scripts from the strings
 * @param {object} event
 * @param {string} JSscripts
 * @return void
 */
export const callAll = (event, ...JSscripts) => JSscripts.forEach((script) => _call(script, event));

/**
 * Run script from a string
 * @param {string} JSscript
 * @param {object} event
 */
function _call(JSscript, event = {}) {
  _toCallbacks(JSscript).forEach((callback) => {
    try {
      if (callback.includes("$event")) {
        new Function("$event", callback)(event); // eslint-disable-line
      } else {
        new Function(`{ return ${callback} };`).call(null); // eslint-disable-line
      }
    } catch (e) {
      throw new Error(`Calling ${callback} on ${event.type} ${event.target} has been crashed: ${e}`);
    }
  });
}

/**
 * Valid statically and split a script to the callbacks
 * @param {string} JSscript
 */
function _toCallbacks(JSscript) {
  let callbacks = [];
  if (_isStaticallyValid(JSscript)) {
    callbacks = JSscript.split(";").filter((callback) => _isStaticallyValid(callback));
  }
  return callbacks;
}

/**
 * Valid dynamically (a string can be parsed to a function?)
 * @param {string} JSscripts
 * @return {boolean}
 */
export function allValidScripts(...JSscripts) {
  if (!JSscripts && JSscripts.some((script) => !_isStaticallyValid(script))) {
    return false;
  }

  return !JSscripts.map((script) => script.split(";"))
    .reduce((acc, callbacks) => [...acc, ...callbacks])
    .filter((callback) => {
      return _isStaticallyValid(callback);
    })
    .some((callback) => !_isDynamicallyValid(callback));
}

/**
 * Property type validation of a JS script
 * @param props
 * @param propName
 * @returns {Error | null}
 */
export const isJsScript = (props, propName) => {
  if (!allValidScripts(props[propName])) {
    return new Error(`Invalid property ${propName}. JS script isn't valid.`);
  }

  return null;
};
/**
 * Is non empty string
 * @param {String} callback
 * @return {boolean}
 */
const _isStaticallyValid = (callback) => !!callback && callback.trim() !== "";
/**
 * Can a string be parsed to a function
 * @param {string} callback
 * @param {object} event
 * @return {boolean}
 */
const _isDynamicallyValid = (callback, event = {}) => {
  try {
    if (callback.includes("$event")) {
      return !!new Function("$event", callback); // eslint-disable-line
    }
    return !!new Function(`{ return ${callback} };`); // eslint-disable-line
  } catch (e) {
    throw new Error(`Calling ${callback} on ${event.type} ${event.target} has been crashed: ${e}`);
  }
};

/// /////////////////////////////////////
// PARSING
/// /////////////////////////////////////

/**
 * Fetch snake case attributes as with camel case names
 * @param {Element} element
 * @return {{camelCaseProperty: any}}
 */
export const fetchPropertiesAsCamelCaseFrom = (element) => {
  const properties = {};

  const toCamelCase = (sentence) => {
    const [firstWord, ...restOfWords] = sentence.split("-");
    if (restOfWords.length === 0) {
      return firstWord;
    }

    const functionBracelet = firstWord.includes("(") ? ")" : "";
    const camelCasedWords = startCase(restOfWords.join(" ")).replace(" ", "");
    return firstWord + camelCasedWords + functionBracelet;
  };
  Object.assign(
    properties,
    ...Array.from(element.attributes).map((attribute) => ({
      [toCamelCase(attribute.nodeName)]: attribute.nodeValue,
    }))
  );
  return properties;
};

/**
 *
 * @param {string} url
 * @param {function(error, data)} callback
 */
export function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  function handleResponse() {
    callback(xhr.status === 200 ? xhr.status : null, xhr.response);
  }
  xhr.onload = handleResponse;
  xhr.send();
}

/// /////////////////////////////////////
// RENDERING
/// /////////////////////////////////////

/**
 *
 * @param {String} params.selector HTML DOM Element tag to be replaced with Component
 * @param {Array.<GRID_KEYS>|String[]} [params.rwd] Sizes of gri when component will be displayed. By default all
 * @constructor
 */
export const Render = function (params) {
  function _renderWrapper(WrappedComponent) {
    const elementsToBeReplaced = Array.from(document.getElementsByTagName(params.selector));
    const displayOnGrid = !!params.rwd && params.rwd.length > 0 ? params.rwd : GRID_KEYS;
    const hasRwdWrapper = params.rwd && params.rwd.length > 0;
    elementsToBeReplaced.forEach((element) => {
      if (hasRwdWrapper) {
        _render(element, rwdHOC(WrappedComponent, displayOnGrid));
      } else {
        _render(element, WrappedComponent);
      }
    });
  }
  return _renderWrapper;
};

/**
 * @param {Element} element
 * @param {{ new(props: T): Component<T, S, any> } | { (props: T): JSX.Element }} WrappedComponent
 * @return void
 */
function _render(element, WrappedComponent) {
  const properties = fetchPropertiesAsCamelCaseFrom(element);
  element.classList.add("eosc-common");
  const UID = uniqueId(`${element.tagName}-${WrappedComponent.name}-`);
  render(<WrappedComponent key={UID} {...properties} />, element);
}
