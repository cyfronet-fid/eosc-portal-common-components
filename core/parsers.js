/**
 * Fetch snake case attributes as with camel case names
 * @param {Element} element
 * @return {{camelCaseProperty: any}}
 */
export const fetchPropertiesAsCamelCaseFrom = (element) => {
  const properties = {};
  Object.assign(
    properties,
    ...Array.from(element.attributes).map((attribute) => ({
      [_toCamelCase(attribute.nodeName)]: attribute.nodeValue,
    }))
  );
  return properties;
};

const _toCamelCase = (sentence) => {
  const [firstWord, ...restOfWords] = sentence.split("-");
  if (restOfWords.length === 0) {
    return firstWord;
  }
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const camelCasedWords = restOfWords.map(capitalize).join("");
  return firstWord + camelCasedWords;
};

/**
 *
 * @param {string} url
 * @param {function(error, data)} callback
 */
// export function getJSON(url, callback) {
//   const xhr = new XMLHttpRequest();
//   xhr.open("GET", url, true);
//   xhr.responseType = "json";
//   function handleResponse() {
//     callback(xhr.status === 200 ? xhr.status : null, xhr.response);
//   }
//   xhr.onload = handleResponse;
//   xhr.send();
// }
