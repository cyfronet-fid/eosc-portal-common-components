import Cookies from "js-cookie";
import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import { Component } from "preact";
import { getCookieConfig, LOGIN_ATTEMPT_COOKIE_NAME } from "./auto-login.utils";
import usePropTypes from "../../core/utils";
import { isJsScript } from "../../core/callback.validators";
import callAll from "../../core/callback";

export default class EoscMainHeaderLoginBtn extends Component {
  static propTypes = {
    loginUrl: requiredIf(PropTypes.string, (props) => !props["(onLogin)"] || props["(onLogin)"].trim() === ""),
    "(onLogin)": requiredIf(isJsScript, (props) => !props.loginUrl || props.loginUrl.trim() === ""),
  };

  static defaultProps = {
    loginUrl: "",
    "(onLogin)": "",
  };

  render(props) {
    const { loginUrl, "(onLogin)": onLogin } = usePropTypes(props, EoscMainHeaderLoginBtn);
    return (
      <li id="login-btn">
        <strong>
          <a
            href={loginUrl || "#!"}
            onClick={(event) => {
              Cookies.set(
                LOGIN_ATTEMPT_COOKIE_NAME,
                LOGIN_ATTEMPT_COOKIE_NAME,
                getCookieConfig(window.location.hostname)
              );
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
