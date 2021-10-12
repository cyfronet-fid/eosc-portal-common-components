/**
 * Run scripts from the strings
 * @param {object} event
 * @param {string} JSscripts
 * @return void
 */
import { isStaticallyValid } from "./callback.validators";

export default function callAll(event, ...JSscripts) {
  JSscripts.forEach((script) => _call(script, event));
}

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
  if (isStaticallyValid(JSscript)) {
    callbacks = JSscript.split(";").filter((callback) => isStaticallyValid(callback));
  }
  return callbacks;
}
