import { mount } from "enzyme";
import EoscEuInformation from "./eu-information.interface";

describe("Eu Information Component", () => {
  test("Should display the default description and the default URL", () => {
    const wrapper = mount(<EoscEuInformation />);
    expect(wrapper.text()).toContain(EoscEuInformation.defaultProps.description);
    expect(wrapper.text()).toContain(EoscEuInformation.defaultProps["btn-conf"].label);
  });
  test("Should display a new description", () => {
    const description = "Lorem ipsum ...";
    const wrapper = mount(<EoscEuInformation description={description} />);
    expect(wrapper.text()).toContain(description);
  });
});
