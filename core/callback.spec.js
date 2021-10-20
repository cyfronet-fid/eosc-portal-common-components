import callAll from "./callback";
import { allValidScripts, isDynamicallyValid, isStaticallyValid } from "./callback.validators";

describe("Callback", () => {
  test("should call all scripts", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    callAll(null, "console.log('test'); console.log('test1');", "console.log('test2')");
    expect(consoleLogSpy).toHaveBeenCalledWith("test");
    expect(consoleLogSpy).toHaveBeenCalledWith("test1");
    expect(consoleLogSpy).toHaveBeenCalledWith("test2");
  });
  test("should call all scripts with event", () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    callAll("test", "console.log($event); console.log($event + '1');", "console.log($event + '2')");
    expect(consoleLogSpy).toHaveBeenCalledWith("test");
    expect(consoleLogSpy).toHaveBeenCalledWith("test1");
    expect(consoleLogSpy).toHaveBeenCalledWith("test2");
  });
  test("should valid all scripts", () => {
    expect(allValidScripts("console.log(); ", "")).toEqual(false);
    expect(allValidScripts("console.log(); cosaas(")).toEqual(false);
    expect(allValidScripts("console.log(); console.log('')")).toEqual(true);
  });
  test("should valid statically", () => {
    expect(isStaticallyValid("console.log()")).toBe(true);
    expect(isStaticallyValid("")).toBe(false);
    expect(isStaticallyValid(null)).toBe(false);
  });
  test("should valid dynamically", () => {
    expect(isDynamicallyValid("console.log('test')")).toEqual(true);
    expect(isDynamicallyValid("console.log($event)")).toEqual(true);
    expect(isDynamicallyValid("console.log($event)", { test: "" })).toEqual(true);

    const call = () => isDynamicallyValid("console.log(");
    expect(call).toThrowError(Error);
  });
  test("should valid scripts", () => {
    const call = () => callAll(null, "con; test';");
    expect(call).toThrowError(Error);
  });
});
