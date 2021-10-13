import { render } from "preact";
import { fetchPropertiesAsCamelCaseFrom } from "./parsers";
import rwdHOC from "./rwd.hoc";
import { GRID_KEYS } from "./globals";

/**
 *
 * @param {String} params.selector HTML DOM Element tag to be replaced with Component
 * @param {Array.<GRID_KEYS>|String[]} [params.rwd] Sizes of gri when component will be displayed. By default all
 * @constructor
 */
export default function Render(params) {
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
}

/**
 * @param {Element} element
 * @param {{ new(props: T): Component<T, S, any> } | { (props: T): JSX.Element }} WrappedComponent
 * @return void
 */
function _render(element, WrappedComponent) {
  const props = fetchPropertiesAsCamelCaseFrom(element);
  element.classList.add("eosc-common");
  render(<WrappedComponent {...props} />, element);
}
