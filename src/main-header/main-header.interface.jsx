import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import { Component } from "preact";
import { environment } from "../../env/env";
import { isAutologinOn, tryAutologin } from "./auto-login.utils";
import EoscMainHeaderBtn from "./main-header-btn.component";
import { getAuthBtn, isBtnActive } from "./main-header.utils";
import { isJsScript } from "../../core/callback.validators";
import { renderComponent } from "../../core/render";
import { fieldsToCamelCase, usePropTypes } from "../../core/utils";
import RWD from "../../core/rwd.hoc";

/**
 * @version 1.1
 */
class EoscCommonMainHeader extends Component {
  static propTypes = {
    /**
     * Username property
     */
    username: PropTypes.string,
    "login-url": requiredIf(PropTypes.string, (props) => !props["(onLogin)"] || props["(onLogin)"].trim() === ""),
    "logout-url": requiredIf(PropTypes.string, (props) => !props["(onLogout)"] || props["(onLogout)"].trim() === ""),
    "on-login": requiredIf(isJsScript, (props) => !props.loginUrl || props.loginUrl.trim() === ""),
    "on-logout": requiredIf(isJsScript, (props) => !props.logoutUrl || props.logoutUrl.trim() === ""),
    autoLogin: PropTypes.bool,
  };

  static defaultProps = {
    username: "",
    "login-url": "",
    "logout-url": "",
    "on-login": "",
    "on-logout": "",
    autoLogin: true,
  };

  render(props) {
    /**
     * IMPORTANT!!! By default is on
     */
    const parsedProps = fieldsToCamelCase(usePropTypes(props, EoscCommonMainHeader));
    const { autoLogin } = parsedProps;
    if (isAutologinOn(autoLogin)) {
      tryAutologin(parsedProps);
    }

    return (
      <RWD showOn={["lg", "xl"]}>
        <nav className={`eosc-common top ${environment.production ? "" : "demo"}`}>
          <div className="container">
            <ul className="right-links">
              {environment.mainHeaderConfig.map((config) => (
                <EoscMainHeaderBtn
                  {...{
                    ...config,
                    isActive: isBtnActive(
                      environment.mainHeaderConfig.map((btn) => btn.url),
                      config.url
                    ),
                  }}
                />
              ))}
              {getAuthBtn(parsedProps)}
            </ul>
          </div>
        </nav>
      </RWD>
    );
  }
}

renderComponent(EoscCommonMainHeader.name, EoscCommonMainHeader);
renderComponent(".eosc-common-main-header", EoscCommonMainHeader);
renderComponent("#eosc-common-main-header", EoscCommonMainHeader);
renderComponent("eosc-common-main-header", EoscCommonMainHeader);
window[environment.windowTagName].renderMainHeader = (cssSelector, elementAttr = {}) => {
  renderComponent(cssSelector, EoscCommonMainHeader, elementAttr);
};

export default EoscCommonMainHeader;
