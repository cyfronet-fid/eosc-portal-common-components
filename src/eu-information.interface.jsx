import { Component } from "preact";
import PropTypes from "prop-types";
import { environment } from "../env/env";
import { fieldsToCamelCase, usePropTypes } from "../core/utils";
import { renderComponent } from "../core/render";

/**
 * @version 1.0
 */
class EoscCommonEuInformation extends Component {
  static propTypes = {
    description: PropTypes.string,
    "btn-conf": PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    description: environment.euInformationConfig.description,
    "btn-conf": environment.euInformationConfig.btn,
  };

  render(props) {
    const { description, btnConf } = fieldsToCamelCase(usePropTypes(props, EoscCommonEuInformation));
    return (
      <div className={`eosc-common eu-information p-4 ${environment.production ? "" : "demo"}`}>
        <div className="container">
          <p className="mb-1">
            {description}
            &nbsp;
            <a href={btnConf.url}>{btnConf.label}</a>
          </p>
        </div>
      </div>
    );
  }
}

renderComponent(EoscCommonEuInformation, {
  tagName: "eosc-common-eu-information",
  className: "eosc-common-eu-information",
  idName: "eosc-common-eu-information",
});
renderComponent(EoscCommonEuInformation, { tagName: EoscCommonEuInformation.name });
window.EoscCommonEuInformation = EoscCommonEuInformation;

export default EoscCommonEuInformation;
