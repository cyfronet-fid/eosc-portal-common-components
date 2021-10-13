import { Component } from "preact";
import PropTypes from "prop-types";
import { environment } from "../env/env";
import usePropTypes from "../core/utils";
import Render from "../core/renders";

/**
 * @version 1.0
 * @summary The information's about agreement made with UE.
 * @hideconstructor
 *
 * @component
 * @example
 * <!-- Default EU Information -->
 * <eosc-common-eu-information />
 */
@Render({
  selector: "eosc-common-eu-information",
})
class EoscEuInformation extends Component {
  static propTypes = {
    description: PropTypes.string,
    btnConf: PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    description: environment.euInformationConfig.description,
    btnConf: environment.euInformationConfig.btn,
  };

  render(props) {
    const { description, btnConf } = usePropTypes(props, EoscEuInformation);
    return (
      <div className={`eu-information p-4 ${environment.production ? "" : "demo"}`}>
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

export default EoscEuInformation;
