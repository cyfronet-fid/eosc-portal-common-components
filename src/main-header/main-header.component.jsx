import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import uniqueId from "lodash-es/uniqueId";
import { Component } from "preact";
import { environment } from "../../env/env";
import { isAutologinOn, tryAutologin } from "./auto-login.utils";
import EoscMainHeaderBtn from "./main-header-btn.component";
import { getAuthBtn, isBtnActive } from "./main-header.utils";
import { isJsScript } from "../../core/callback.validators";
import usePropTypes from "../../core/utils";
import Render from "../../core/renders";

/**
 * @version 1.0
 * @summary Common EOSC header at top of the application..
 * @hideconstructor
 *
 * @component
 * @example
 * <!-- The user isn't logged in -->
 * <eosc-common-main-header
 *   username=""
 *   login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
 *   logout-url="https://marketplace.eosc-portal.eu/users/logout"
 * ></eosc-common-main-header>
 *
 * @component
 * @example
 * <!-- A user is logged -->
 * <eosc-common-main-header
 *   username="name surname"
 *   login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
 *   logout-url="https://marketplace.eosc-portal.eu/users/logout"
 * ></eosc-common-main-header>
 *
 * @component
 * @example
 * <!-- Handle onLogin with event argument (substitute of loginUrl) -->
 * <eosc-common-main-header
 *   username=""
 *   (on-login)="alert($event.type + 'on login btn')"
 *   logout-url="https://marketplace.eosc-portal.eu/users/logout"
 * ></eosc-common-main-header>
 *
 * @component
 * @example
 * <!-- Handle onLogout with event argument (substitute of logoutUrl) -->
 * <eosc-common-main-header
 *   username="name surname"
 *   (on-logout)="alert($event.type + ' on logout btn')"
 *   login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
 * ></eosc-common-main-header>
 *
 * @component
 * @example
 * <!-- Handle multiple callbacks in onLogout (substitute of logoutUrl) -->
 * <eosc-common-main-header
 *   username="name surname"
 *   (on-logout)="alert('logout btn'); alert('second call'); alert($event.type)"
 *   login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"w
 * ></eosc-common-main-header>
 */
@Render({
  selector: "eosc-common-main-header",
  rwd: ["lg", "xl"],
})
// eslint-disable-next-line no-unused-vars
class EoscMainHeader extends Component {
  static propTypes = {
    /**
     * Username property
     */
    username: PropTypes.string,
    loginUrl: requiredIf(PropTypes.string, (props) => !props["(onLogin)"] || props["(onLogin)"].trim() === ""),
    logoutUrl: requiredIf(PropTypes.string, (props) => !props["(onLogout)"] || props["(onLogout)"].trim() === ""),
    "(onLogin)": requiredIf(isJsScript, (props) => !props.loginUrl || props.loginUrl.trim() === ""),
    "(onLogout)": requiredIf(isJsScript, (props) => !props.logoutUrl || props.logoutUrl.trim() === ""),
    autoLogin: PropTypes.bool,
  };

  static defaultProps = {
    username: "",
    loginUrl: "",
    logoutUrl: "",
    "(onLogout)": "",
    "(onLogin)": "",
    autoLogin: true,
  };

  render(props) {
    /**
     * IMPORTANT!!! By default is on
     */
    const { autoLogin } = usePropTypes(props, EoscMainHeader);
    if (isAutologinOn(autoLogin)) {
      tryAutologin(props);
    }

    return (
      <nav className={`top ${environment.production ? "" : "demo"}`}>
        <div className="container">
          <ul className="right-links">
            {environment.mainHeaderConfig.map((config) => (
              <EoscMainHeaderBtn
                key={uniqueId("eosc-main-header-btn")}
                {...{
                  ...config,
                  isActive: isBtnActive(
                    environment.mainHeaderConfig.map((btn) => btn.url),
                    config.url
                  ),
                }}
              />
            ))}
            {getAuthBtn(usePropTypes(props, EoscMainHeader))}
          </ul>
        </div>
      </nav>
    );
  }
}
