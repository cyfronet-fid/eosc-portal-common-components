import PropTypes from "prop-types";
import { Component } from "preact";
import { environment } from "../../env/env";
import { isAutologinOn, tryAutologin } from "./auto-login.utils";
import EoscMainHeaderBtn from "./main-header-btn.component";
import { getAuthBtn, isBtnActive } from "./main-header.utils";
import { isJsScript } from "../../core/callback.validators";
import { renderComponent } from "../../core/render";
import { fieldsToCamelCase, usePropTypes } from "../../core/utils";
import React from 'react';
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
    "login-url": PropTypes.string,
    "logout-url": PropTypes.string,
    "on-login": isJsScript,
    "on-logout": isJsScript,
    autoLogin: PropTypes.bool,
    "profile-links": PropTypes.string
  };

  static defaultProps = {
    username: "",
    "login-url": "",
    "logout-url": "",
    "on-login": "",
    "on-logout": "",
    autoLogin: true,
    "profile-links": '[]'
  };

  render(props) {
    /**
     * IMPORTANT!!! By default is on
     */
    const parsedProps = fieldsToCamelCase(usePropTypes(props, EoscCommonMainHeader));
    parsedProps.profileLinks = JSON.parse(parsedProps.profileLinks)
    const { autoLogin } = parsedProps;
    if (isAutologinOn(autoLogin)) {
      tryAutologin(parsedProps);
    }

    return (
      <RWD showOn={["lg", "xl"]}>
        <nav className={`eosc-common top ${environment.production ? "" : "demo"}`}>
          <div className="container">
            <div className="left-links">
              <a href="https://eosc-portal.eu" className="header-logo">
                &nbsp;
              </a>
            </div>
            <ul className="center-links">
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
            </ul>
            <ul className="right-links">
              <li className="browse-link">
                <a href="https://search.eosc-portal.eu/search/all?q=*">Browse Marketplace</a>
              </li>
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
