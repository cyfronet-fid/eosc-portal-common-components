import PropTypes from "prop-types";
import { Component } from "preact";
import { environment } from "../../env/env";
import EoscMainFooterLogoBar from "./main-footer-logo-bar.component";
import EoscMainFooterCols from "./main-footer-cols.component";
import { fieldsToCamelCase, usePropTypes } from "../../core/utils";
import { renderComponent } from "../../core/render";

/**
 * @version 1.1
 */
// eslint-disable-next-line no-unused-vars
class EoscCommonMainFooter extends Component {
  static propTypes = {
    production: PropTypes.bool,
    socialIcons: PropTypes.arrayOf(
        PropTypes.shape({
          class: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
    ),
    termsOfUse: PropTypes.string,
    privacyPolicy: PropTypes.string
  };

  static defaultProps = {
    production: environment.production,
    socialIcons: environment.mainFooterConfig.socials,
  };

  render(props) {
    const { production, termsOfUse, privacyPolicy} = fieldsToCamelCase(usePropTypes(props, EoscCommonMainFooter));
    return (
        <div>
          <footer className={`eosc-common footer pt-3 pb-3 ${production ? "" : "demo"}`}>
            <div className="container">
              <EoscMainFooterCols termsOfUse={termsOfUse} privacyPolicy={privacyPolicy} />
            </div>
          </footer>
          <div className="eosc-common copyright container">
            <span className="copy-text">Copyright 2023 &nbsp;&nbsp; | &nbsp;&nbsp; All rights reserved</span> &nbsp;&nbsp; |  &nbsp;&nbsp;
            <a href="https://eosc-portal.eu/privacy-policy-summary">
              Privacy policy
            </a>
          </div>
        </div>
    );
  }
}

renderComponent(EoscCommonMainFooter.name, EoscCommonMainFooter);
renderComponent("eosc-common-main-footer", EoscCommonMainFooter);
renderComponent(".eosc-common-main-footer", EoscCommonMainFooter);
renderComponent("#eosc-common-main-footer", EoscCommonMainFooter);
window[environment.windowTagName].renderMainFooter = (cssSelector, elementAttr) => {
  renderComponent(cssSelector, EoscCommonMainFooter, elementAttr);
};

export default EoscCommonMainFooter;
