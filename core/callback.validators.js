/**
 * Valid dynamically (a string can be parsed to a function?)
 * @param {string} JSscripts
 * @return {boolean}
 */
export function allValidScripts(...JSscripts) {
  if (!JSscripts && JSscripts.some((script) => !isStaticallyValid(script))) {
    return false;
  }

  return !JSscripts.map((script) => script.split(";"))
    .reduce((acc, callbacks) => [...acc, ...callbacks])
    .filter((callback) => {
      return isStaticallyValid(callback);
    })
    .some((callback) => !isDynamicallyValid(callback));
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
export const isStaticallyValid = (callback) => !!callback && callback.trim() !== "";
/**
 * Can a string be parsed to a function
 * @param {string} callback
 * @param {object} event
 * @return {boolean}
 */
export const isDynamicallyValid = (callback, event = {}) => {
  try {
    if (callback.includes("$event")) {
      return !!new Function("$event", callback); // eslint-disable-line
    }
    return !!new Function(`{ return ${callback} };`); // eslint-disable-line
  } catch (e) {
    throw new Error(`Calling ${callback} on ${event.type} ${event.target} has been crashed: ${e}`);
  }
};
