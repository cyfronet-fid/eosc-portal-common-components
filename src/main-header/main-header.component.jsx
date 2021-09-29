import React from "react";
import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import uniqueId from "lodash-es/uniqueId";
import { environment } from "../../env/env";
import { tryAutologin } from "./auto-login.utils";
import { EoscPureComponent, isJsScript, Render } from "../../lib/core";
import EoscMainHeaderBtn from "./main-header-btn.component";
import EoscMainHeaderLogoutBtn from "./main-header-logout-btn.component";
import EoscMainHeaderLoginBtn from "./main-header-login-btn.component";

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
class EoscMainHeader extends EoscPureComponent {
  static _isBtnActive(btnsUrls, btnUrl) {
    const currentUrlBase = location.protocol + "//" + location.hostname; // eslint-disable-line
    if (!btnUrl.includes(currentUrlBase)) {
      return false;
    }

    const allBtnsSubpages = btnsUrls
      .filter((url) => !!url && url.trim() !== "")
      .map((url) => new URL(url).pathname)
      .filter((path) => path !== "/");
    const parsedBtnUrl = new URL(btnUrl);
    const shouldBeActivatedOnSubpages = parsedBtnUrl.pathname === "/" && !allBtnsSubpages.includes(location.pathname); //eslint-disable-line
    const isSpecificSubpage = location.pathname !== "/" && new URL(btnUrl).pathname.includes(location.pathname); // eslint-disable-line
    return shouldBeActivatedOnSubpages || isSpecificSubpage;
  }

  componentDidMount() {
    /**
     * IMPORTANT!!! By default is on
     */
    const { autoLogin } = this.props;
    const isAutoLoginOn = autoLogin === "true" || autoLogin === "1" || autoLogin === 1 || autoLogin === undefined;
    if (isAutoLoginOn) {
      tryAutologin(this.props);
    }
  }

  _getAuthBtn() {
    const { username } = this.props;
    const isLoggedIn = !!username && username.trim() !== "";
    return isLoggedIn ? <EoscMainHeaderLogoutBtn {...this.props} /> : <EoscMainHeaderLoginBtn {...this.props} />;
  }

  render() {
    return (
      <nav className={`top ${environment.production ? "" : "demo"}`}>
        <div className="container">
          <ul className="right-links">
            {environment.mainHeaderConfig.map((config) => (
              <EoscMainHeaderBtn
                key={uniqueId("eosc-main-header-btn")}
                {...{
                  ...config,
                  isActive: EoscMainHeader._isBtnActive(
                    environment.mainHeaderConfig.map((btn) => btn.url),
                    config.url
                  ),
                }}
              />
            ))}
            {this._getAuthBtn()}
          </ul>
        </div>
      </nav>
    );
  }
}

EoscMainHeader.propTypes = {
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

EoscMainHeader.defaultProps = {
  username: "",
  loginUrl: "",
  logoutUrl: "",
  "(onLogout)": "",
  "(onLogin)": "",
  autoLogin: true,
};

Render({
  selector: "eosc-common-main-header",
  rwd: ["lg", "xl"],
})(EoscMainHeader);
