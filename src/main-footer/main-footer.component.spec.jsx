import { mount } from "enzyme";
import EoscMainFooter from "./main-footer.component";
import EoscMainFooterCols from "./main-footer-cols.component";

describe("Main Footer Component", () => {
  test("Should display nth columns", () => {
    const wrapper = mount(<EoscMainFooter />);

    expect(wrapper.find(".col-md")).toHaveLength(EoscMainFooterCols.defaultProps.cols.length);
  });
});
