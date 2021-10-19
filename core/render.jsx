import { render } from "preact";
import { fetchPropertiesFrom } from "./parsers";
import rwdHOC from "./rwd.hoc";
import { GRID_KEYS } from "./globals";

// TODO: Render selector deprecation
/**
 *
 * @param {String} params.selector HTML DOM Element tag to be replaced with Component
 * @param {Array.<GRID_KEYS>|String[]} [params.rwd] Sizes of gri when component will be displayed. By default all
 * @constructor
 */
export default function Render(params) {
  function _renderWrapper(WrappedComponent) {
    const elementsToBeReplaced = [
      ...Array.from(document.getElementsByTagName(params.selector)),
      ...Array.from(document.getElementsByTagName(WrappedComponent.name)),
    ];

    console.log(elementsToBeReplaced);

    const displayOnGrid = !!params.rwd && params.rwd.length > 0 ? params.rwd : GRID_KEYS;
    const shouldAddRwdWrapper = params.rwd && params.rwd.length > 0;
    elementsToBeReplaced.forEach((element) => {
      const props = fetchPropertiesFrom(element);
      const RenderedComponent = shouldAddRwdWrapper ? rwdHOC(WrappedComponent, displayOnGrid) : WrappedComponent;
      render(<RenderedComponent {...props} />, element);
    });
  }
  return _renderWrapper;
}
