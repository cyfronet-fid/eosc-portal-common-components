import React, { PureComponent } from "react";
import uniqueId from "lodash-es/uniqueId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import { environment } from "../../env/env";
import { AUTOLOGIN_COOKIE_NAME, getCookieConfig, LOGOUT_ATTEMPT_COOKIE_NAME } from "./auto-login.utils";
import { callAll, isJsScript } from "../../lib/core";

class EoscMainHeaderLogoutBtn extends PureComponent {
  render() {
    const { username, logoutUrl, "(onLogout)": onLogout } = this.props;
    return (
      <>
        <li key={uniqueId("eosc-main-header-li")}>
          <FontAwesomeIcon icon={faUser} />
          {username}
        </li>
        <li key={uniqueId("eosc-main-header-li")} id="logout-btn">
          <strong>
            <a
              href={logoutUrl || "#!"}
              onClick={(event) => {
                Cookies.set(LOGOUT_ATTEMPT_COOKIE_NAME, LOGOUT_ATTEMPT_COOKIE_NAME, getCookieConfig(location.hostname)); // eslint-disable-line
                const { autoLoginDomains } = environment.defaultConfiguration;
                autoLoginDomains.forEach((domain) => Cookies.remove(AUTOLOGIN_COOKIE_NAME, getCookieConfig(domain)));
                callAll(event, onLogout);
              }}
              data-e2e="logout"
            >
              Logout
            </a>
          </strong>
        </li>
      </>
    );
  }
}

EoscMainHeaderLogoutBtn.propTypes = {
  username: PropTypes.string,
  logoutUrl: requiredIf(PropTypes.string, (props) => !props["(onLogout)"] || props["(onLogout)"].trim() === ""),
  "(onLogout)": requiredIf(isJsScript, (props) => !props.logoutUrl || props.logoutUrl.trim() === ""),
};

EoscMainHeaderLogoutBtn.defaultProps = {
  username: "",
  logoutUrl: "",
  "(onLogout)": "",
};

export default EoscMainHeaderLogoutBtn;
