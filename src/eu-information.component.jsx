import React from "react";
import { environment } from "../env/env";
import { EoscPureComponent, Render } from "../lib/core";

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
class EoscEuInformationComponent extends EoscPureComponent {
  render() {
    return (
      <div className="eu-information p-4">
        <div className="container">
          <p className="mb-1">
            {environment.euInformationConfig.description}
            &nbsp;
            <a href={environment.euInformationConfig.btn.url}>{environment.euInformationConfig.btn.label}</a>
          </p>
        </div>
      </div>
    );
  }
}
Render({ selector: "eosc-common-eu-information" })(EoscEuInformationComponent);

export default EoscEuInformationComponent;
