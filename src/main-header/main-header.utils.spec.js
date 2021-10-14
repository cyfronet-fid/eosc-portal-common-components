import { isBtnActive } from "./main-header.utils";

describe("Main header btns underline", () => {
  test("should underline on each subpage", () => {
    const urls = ["https://localhost"];
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      get() {
        return {
          hostname: "localhost",
          protocol: "https:",
          pathname: "/",
        };
      },
    });
    expect(isBtnActive(urls, urls[0])).toBe(true);
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      get() {
        return {
          hostname: "localhost",
          protocol: "https:",
          pathname: "/news",
        };
      },
    });
    expect(isBtnActive(urls, urls[0])).toBe(true);
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      get() {
        return {
          hostname: "localhost",
          protocol: "https:",
          pathname: "/contact-us",
        };
      },
    });
    expect(isBtnActive(urls, urls[0])).toBe(true);
  });
  test("should underline on each page except certain subpage", () => {
    const urls = ["https://localhost", "https://localhost/contact-us"];
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      get() {
        return {
          hostname: "localhost",
          protocol: "https:",
          pathname: "/",
        };
      },
    });
    expect(isBtnActive(urls, urls[0])).toBe(true);
    expect(isBtnActive(urls, urls[1])).toBe(false);
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      get() {
        return {
          hostname: "localhost",
          protocol: "https:",
          pathname: "/news",
        };
      },
    });
    expect(isBtnActive(urls, urls[0])).toBe(true);
    expect(isBtnActive(urls, urls[1])).toBe(false);
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      get() {
        return {
          hostname: "localhost",
          protocol: "https:",
          pathname: "/contact-us",
        };
      },
    });
    expect(isBtnActive(urls, urls[0])).toBe(false);
    expect(isBtnActive(urls, urls[1])).toBe(true);
  });
});
