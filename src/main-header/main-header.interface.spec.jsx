import { mount } from "enzyme";
import Cookies from "js-cookie";
import { environment } from "../../env/env";
import EoscCommonMainHeader from "./main-header.interface";
import * as AutoLoginUtils from "./auto-login.utils";
import * as CallbackUtils from "../../core/callback";
import "window-resizeto/polyfill";

import {
  AUTOLOGIN_COOKIE_NAME,
  getCookieConfig,
  LOGIN_ATTEMPT_COOKIE_NAME,
  LOGOUT_ATTEMPT_COOKIE_NAME,
} from "./auto-login.utils";

describe("Main Header Component", () => {
  test("should run on logout script", async () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const props = {
      username: "username",
      "login-url": "https://test.pl",
      "on-logout": "console.log('test')",
    };

    const wrapper = mount(<EoscCommonMainHeader {...props} />);
    expect(wrapper.text()).toContain("Logout");

    const logoutBtn = wrapper
      .findWhere((node) => {
        return node.type() === "li" && node.name() && node.text() === "Logout";
      })
      .find("a");
    logoutBtn.simulate("click");
    await Promise.resolve();
    expect(consoleLogSpy).toHaveBeenCalledWith("test");
  });
  test("should run on login script", async () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    const props = {
      username: "",
      "logout-url": "https://test.pl",
      "on-login": "console.log('test')",
    };
    const wrapper = mount(<EoscCommonMainHeader {...props} />);
    expect(wrapper.text()).toContain("Login");
    expect(wrapper.text()).toContain(props.username);

    const loginBtn = wrapper
      .findWhere((node) => {
        return node.type() === "li" && node.name() && node.text() === "Login";
      })
      .find("a");
    await loginBtn.simulate("click");
    expect(consoleLogSpy).toHaveBeenCalledWith("test");
  });
  test("should display all hrefs", () => {
    const props = {
      username: "",
      "logout-url": "https://test.pl",
      "login-url": "https://test1.pl",
    };
    const wrapper = mount(<EoscCommonMainHeader {...props} />);
    const wrapperTextContent = wrapper.text();
    environment.mainHeaderConfig.forEach((config) => {
      expect(wrapperTextContent).toContain(config.label);
    });
  });
  test("should display username", () => {
    const props = {
      username: "username",
      "logout-url": "https://test.pl",
      "login-url": "https://test1.pl",
    };
    const wrapper = mount(<EoscCommonMainHeader {...props} />);
    expect(wrapper.text()).toContain(props.username);
  });

  describe("Autologin", () => {
    test("should try autologin with url", () => {
      global.window = Object.create(window);
      Object.defineProperty(window, "location", {
        value: {
          href: null,
        },
      });
      jest.spyOn(Cookies, "get").mockImplementation((cookieName) => cookieName === AUTOLOGIN_COOKIE_NAME);
      // eslint-disable-next-line no-restricted-globals
      const props = {
        username: "",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      new EoscCommonMainHeader().render(props);
      expect(window.location.href).toEqual(props["login-url"]);
    });
    test("should try autologin with callback", () => {
      jest.spyOn(Cookies, "get").mockImplementation((cookieName) => cookieName === AUTOLOGIN_COOKIE_NAME);
      const callAllSpy = jest.spyOn(CallbackUtils, "default");
      const props = {
        username: "",
        "logout-url": "https://test.pl",
        "on-login": "console.log('test');",
      };
      new EoscCommonMainHeader().render(props);
      expect(callAllSpy).toHaveBeenCalledWith(null, props["on-login"]);
    });
    test("[Deprecated use with braces] should try autologin with callback", () => {
      jest.spyOn(Cookies, "get").mockImplementation((cookieName) => cookieName === AUTOLOGIN_COOKIE_NAME);
      const callAllSpy = jest.spyOn(CallbackUtils, "default");
      const props = {
        username: "",
        "logout-url": "https://test.pl",
        "(on-login)": "console.log('test');",
      };
      new EoscCommonMainHeader().render(props);
      expect(callAllSpy).toHaveBeenCalledWith(null, props["(on-login)"]);
    });
    test("should try login by default", () => {
      const autoLoginCallSpy = jest.spyOn(AutoLoginUtils, "tryAutologin");
      const props = {
        username: "",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      new EoscCommonMainHeader().render(props);
      expect(autoLoginCallSpy).toHaveBeenCalled();
    });
    test("should create login attempt cookie", async () => {
      const props = {
        username: "",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      const wrapper = mount(<EoscCommonMainHeader {...props} />);
      const loginBtn = wrapper.find("#login-btn").find("a");
      const setCookieSpy = jest.spyOn(Cookies, "set");
      loginBtn.simulate("click");
      await Promise.resolve();
      expect(setCookieSpy).toHaveBeenCalledWith(LOGIN_ATTEMPT_COOKIE_NAME, LOGIN_ATTEMPT_COOKIE_NAME, {
        // eslint-disable-next-line no-restricted-globals
        ...getCookieConfig(location.hostname),
        expires: expect.anything(),
      });
    });
    test("should create logout attempt cookie", async () => {
      const props = {
        username: "logged in user",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      const wrapper = mount(<EoscCommonMainHeader {...props} />);
      const logoutBtn = wrapper.find("#logout-btn").find("a");
      const setCookieSpy = jest.spyOn(Cookies, "set");
      logoutBtn.simulate("click");
      await Promise.resolve();
      expect(setCookieSpy).toHaveBeenCalledWith(LOGOUT_ATTEMPT_COOKIE_NAME, LOGOUT_ATTEMPT_COOKIE_NAME, {
        // eslint-disable-next-line no-restricted-globals
        ...getCookieConfig(location.hostname),
        expires: expect.anything(),
      });
    });
    test("should create autologin cookie", () => {
      const props = {
        username: "logged in user",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      jest.spyOn(Cookies, "get").mockImplementation((cookieName) => cookieName === LOGIN_ATTEMPT_COOKIE_NAME);
      const setCookieSpy = jest.spyOn(Cookies, "set");
      const removeCookieSpy = jest.spyOn(Cookies, "remove");
      new EoscCommonMainHeader().render(props);
      // eslint-disable-next-line no-restricted-globals
      expect(removeCookieSpy).toHaveBeenCalledWith(LOGIN_ATTEMPT_COOKIE_NAME, {
        // eslint-disable-next-line no-restricted-globals
        ...getCookieConfig(location.hostname),
        expires: expect.anything(),
      });
      environment.defaultConfiguration.autoLoginDomains.forEach((domain) => {
        expect(setCookieSpy).toHaveBeenCalledWith(AUTOLOGIN_COOKIE_NAME, AUTOLOGIN_COOKIE_NAME, {
          ...getCookieConfig(domain),
          expires: expect.anything(),
        });
      });
    });
    test("should remove autologin cookie on missing username", () => {
      const props = {
        username: "",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      jest.spyOn(Cookies, "get").mockImplementation((cookieName) => cookieName === LOGIN_ATTEMPT_COOKIE_NAME);
      const removeCookieSpy = jest.spyOn(Cookies, "remove");
      new EoscCommonMainHeader().render(props);
      expect(removeCookieSpy).toHaveBeenCalledWith(LOGIN_ATTEMPT_COOKIE_NAME, {
        // eslint-disable-next-line no-restricted-globals
        ...getCookieConfig(location.hostname),
        expires: expect.anything(),
      });
      environment.defaultConfiguration.autoLoginDomains.forEach((domain) => {
        expect(removeCookieSpy).toHaveBeenCalledWith(AUTOLOGIN_COOKIE_NAME, {
          ...getCookieConfig(domain),
          expires: expect.anything(),
        });
      });
    });
    test("should skip autologin on logout attempt", async () => {
      const props = {
        username: "logged in username",
        "logout-url": "https://test.pl",
        "login-url": "https://test1.pl",
      };
      jest.spyOn(Cookies, "get").mockImplementation((cookieName) => {
        return cookieName === LOGOUT_ATTEMPT_COOKIE_NAME || cookieName === AUTOLOGIN_COOKIE_NAME;
      });
      const setCookieSpy = jest.spyOn(Cookies, "set");
      const removeCookieSpy = jest.spyOn(Cookies, "remove");
      const wrapper = mount(<EoscCommonMainHeader {...props} />);
      const logoutBtn = wrapper.find("#logout-btn").find("a");
      logoutBtn.simulate("click");
      await Promise.resolve();
      expect(setCookieSpy).toHaveBeenCalledWith(LOGOUT_ATTEMPT_COOKIE_NAME, LOGOUT_ATTEMPT_COOKIE_NAME, {
        // eslint-disable-next-line no-restricted-globals
        ...getCookieConfig(location.hostname),
        expires: expect.anything(),
      });
      // eslint-disable-next-line no-restricted-globals
      expect(removeCookieSpy).toHaveBeenCalledWith(LOGOUT_ATTEMPT_COOKIE_NAME, {
        // eslint-disable-next-line no-restricted-globals
        ...getCookieConfig(location.hostname),
        expires: expect.anything(),
      });
      environment.defaultConfiguration.autoLoginDomains.forEach((domain) => {
        expect(removeCookieSpy).toHaveBeenCalledWith(AUTOLOGIN_COOKIE_NAME, {
          ...getCookieConfig(domain),
          expires: expect.anything(),
        });
      });
      expect(setCookieSpy).not.toHaveBeenCalledWith(AUTOLOGIN_COOKIE_NAME);
    });
  });
});
