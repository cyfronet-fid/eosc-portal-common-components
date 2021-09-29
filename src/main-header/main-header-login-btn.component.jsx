import React, { PureComponent } from "react";
import uniqueId from "lodash-es/uniqueId";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import { getCookieConfig, LOGIN_ATTEMPT_COOKIE_NAME } from "./auto-login.utils";
import { callAll, isJsScript } from "../../lib/core";

class EoscMainHeaderLoginBtn extends PureComponent {
  render() {
    const { loginUrl, "(onLogin)": onLogin } = this.props;
    return (
      <li key={uniqueId("eosc-main-header-li")} id="login-btn">
        <strong>
          <a
            href={loginUrl || "#!"}
            onClick={(event) => {
              Cookies.set(LOGIN_ATTEMPT_COOKIE_NAME, LOGIN_ATTEMPT_COOKIE_NAME, getCookieConfig(location.hostname)); // eslint-disable-line
              callAll(event, onLogin);
            }}
          >
            Login
          </a>
        </strong>
      </li>
    );
  }
}

EoscMainHeaderLoginBtn.propTypes = {
  loginUrl: requiredIf(PropTypes.string, (props) => !props["(onLogin)"] || props["(onLogin)"].trim() === ""),
  "(onLogin)": requiredIf(isJsScript, (props) => !props.loginUrl || props.loginUrl.trim() === ""),
};
EoscMainHeaderLoginBtn.defaultProps = {
  loginUrl: "",
  "(onLogin)": "",
};

export default EoscMainHeaderLoginBtn;
