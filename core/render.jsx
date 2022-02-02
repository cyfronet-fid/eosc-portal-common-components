import { render } from "preact";
import { fetchPropertiesFrom } from "./parsers";

/**
 * @param {Component} Component Commons lib component
 *
 * @param selectors {object} HTML selectors by which HTML elements will be found
 * @param {String=} selectors.tagName HTML DOM Element tag to be replaced with a component
 * @param {String=} selectors.className Css class name to be replaced with a component
 * @param {String=} selectors.id Css id name to be replaced with a component
 * @constructor
 */
export function renderComponent(Component, selectors = { tagName: Component.name }) {
  const elementsToBeRendered = getElementsBy(selectors);

  if (elementsToBeRendered.length === 0) {
    const { tagName, className, id } = selectors;
    // eslint-disable-next-line no-console
    console.warn(`
      The custom component: ${Component.name} can't be rendered. 
      No elements to be rendered can be found with CSS/HTML selectors: 
      .${className}, #${id}, ${tagName}
    `);
    return;
  }

  elementsToBeRendered.forEach((element) => {
    render(<Component {...fetchPropertiesFrom(element)} />, element);
  });
}
window.renderCustomComponent = renderComponent;

export function getElementsBy({ tagName, className, id }) {
  const elements = [];
  if (tagName) {
    elements.push(...Array.from(document.getElementsByTagName(tagName)));
  }

  if (className) {
    elements.push(...Array.from(document.getElementsByClassName(className)));
  }

  const element = document.getElementById(id);
  if (id && element) {
    elements.push(element);
  }

  return elements;
}
