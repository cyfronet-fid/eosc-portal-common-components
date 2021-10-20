import Cookies from "js-cookie";
import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import { Component, Fragment } from "preact";
import { environment } from "../../env/env";
import { AUTOLOGIN_COOKIE_NAME, getCookieConfig, LOGOUT_ATTEMPT_COOKIE_NAME } from "./auto-login.utils";
import { isJsScript } from "../../core/callback.validators";
import callAll from "../../core/callback";
import FasUserIcon from "../../core/icons/fas-user.icon";
import { usePropTypes } from "../../core/utils";

export default class EoscMainHeaderLogoutBtn extends Component {
  static propTypes = {
    username: PropTypes.string,
    logoutUrl: requiredIf(PropTypes.string, (props) => !props["(onLogout)"] || props["(onLogout)"].trim() === ""),
    "(onLogout)": requiredIf(isJsScript, (props) => !props.logoutUrl || props.logoutUrl.trim() === ""),
  };

  static defaultProps = {
    username: "",
    logoutUrl: "",
    "(onLogout)": "",
  };

  render(props) {
    // TODO: deprecate braces around properties names
    const onLogout = props["(onLogout)"] && props["(onLogout)"].trim() !== "" ? props["(onLogout)"] : props.onLogout;
    const { username, logoutUrl } = usePropTypes(props, EoscMainHeaderLogoutBtn);
    return (
      <Fragment>
        <li>
          <FasUserIcon />
          {username}
        </li>
        <li id="logout-btn">
          <strong>
            <a
              href={logoutUrl || "#!"}
              onClick={(event) => {
                Cookies.set(
                  LOGOUT_ATTEMPT_COOKIE_NAME,
                  LOGOUT_ATTEMPT_COOKIE_NAME,
                  getCookieConfig(window.location.hostname)
                );
                const { autoLoginDomains } = environment.defaultConfiguration;
                autoLoginDomains.forEach((domain) => Cookies.remove(AUTOLOGIN_COOKIE_NAME, getCookieConfig(domain)));
                if (onLogout && onLogout.trim() !== "") {
                  callAll(event, onLogout);
                }
              }}
              data-e2e="logout"
            >
              Logout
            </a>
          </strong>
        </li>
      </Fragment>
    );
  }
}
