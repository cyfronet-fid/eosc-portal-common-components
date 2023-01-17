import { mount } from "enzyme";
import EoscCommonMainFooter from "./main-footer.interface";
import EoscMainFooterCols from "./main-footer-cols.component";

describe("Main Footer Component", () => {
  test("Should display nth columns", () => {
    const wrapper = mount(<EoscCommonMainFooter />);

    expect(wrapper.find("EoscMainFooterCols .col-md")).toHaveLength(EoscMainFooterCols.defaultProps.cols.length);
  });
});
