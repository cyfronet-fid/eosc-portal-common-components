import startCase from "lodash-es/startCase";

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
