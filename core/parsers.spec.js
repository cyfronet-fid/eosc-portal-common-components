import { fetchPropertiesAsCamelCaseFrom } from "./parsers";

describe("Parsers", () => {
  test("should get element attributes in camel case", () => {
    const element = {
      attributes: [
        {
          nodeName: "(on-login)",
          nodeValue: "console.log();",
        },
        {
          nodeName: "login-url",
          nodeValue: "https://test.pl",
        },
      ],
    };
    const parsedAttributes = fetchPropertiesAsCamelCaseFrom(element);
    expect(Object.keys(parsedAttributes).sort()).toEqual(["(onLogin)", "loginUrl"].sort());
    expect(parsedAttributes["(onLogin)"]).toEqual(element.attributes[0].nodeValue);
    expect(parsedAttributes.loginUrl).toEqual(element.attributes[1].nodeValue);
  });
});
