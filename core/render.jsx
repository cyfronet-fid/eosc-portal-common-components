import { render } from "preact";
import { fetchPropertiesFrom } from "./parsers";

/**
 * @param {Component} Component Commons lib component
 *
 * @param params {object}
 * @param {String=} params.tagName HTML DOM Element tag to be replaced with a component
 * @param {String=} params.className Css class name to be replaced with a component
 * @param {String=} params.idName Css id name to be replaced with a component
 * @constructor
 */
export function renderComponent(Component, params = {}) {
  getElementsBy({ ...params, tagName: Component.name }).forEach((element) => {
    render(<Component {...fetchPropertiesFrom(element)} />, element);
  });
}
window.renderCustomComponent = renderComponent;

export function getElementsBy({ tagName, className, idName }) {
  const elements = [];
  if (tagName) {
    elements.push(...Array.from(document.getElementsByTagName(tagName)));
  }

  if (className) {
    elements.push(...Array.from(document.getElementsByClassName(className)));
  }

  const element = document.getElementById(idName);
  if (idName && element) {
    elements.push(element);
  }

  return elements;
}
