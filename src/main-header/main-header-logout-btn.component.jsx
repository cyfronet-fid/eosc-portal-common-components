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
import Dropdown from "react-bootstrap/Dropdown";
import * as React from 'react';

const AccountToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        className={"account-dropdown"}
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        <FasUserIcon />
    </a>
));

export default class EoscMainHeaderLogoutBtn extends Component {
  static propTypes = {
    username: PropTypes.string,
    profileLinks: PropTypes.array,
    logoutUrl: requiredIf(PropTypes.string, (props) => !props["(onLogout)"] || props["(onLogout)"].trim() === ""),
    "(onLogout)": requiredIf(isJsScript, (props) => !props.logoutUrl || props.logoutUrl.trim() === ""),
  };

  static defaultProps = {
    username: "",
    profileLinks: [],
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
          My EOSC
          <Dropdown>
            <Dropdown.Toggle as={AccountToggle} />
            <Dropdown.Menu>
                {props.profileLinks.map((link) => (
                    <Dropdown.Item {...link}>{link.caption}</Dropdown.Item>
                ))}
              <Dropdown.Item href={logoutUrl || "#!"}
                             id="logout-btn"
                             data-e2e="logout"
                             onClick={(event) => {
                               Cookies.set(
                                   LOGOUT_ATTEMPT_COOKIE_NAME,
                                   LOGOUT_ATTEMPT_COOKIE_NAME,
                                   getCookieConfig(window.location.hostname)
                               );
                               const { autoLoginDomains } = environment.defaultConfiguration;
                               autoLoginDomains.forEach((domain) =>
                                   Cookies.remove(AUTOLOGIN_COOKIE_NAME, getCookieConfig(domain))
                               );
                               if (onLogout && onLogout.trim() !== "") {
                                 callAll(event, onLogout);
                               }
                             }}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </Fragment>
    );
  }
}
