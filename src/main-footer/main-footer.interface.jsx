import PropTypes from "prop-types";
import { Component } from "preact";
import { environment } from "../../env/env";
import EoscMainFooterLogoBar from "./main-footer-logo-bar.component";
import EoscMainFooterCols from "./main-footer-cols.component";
import { fieldsToCamelCase, usePropTypes } from "../../core/utils";
import { renderComponent } from "../../core/render";

/**
 * @version 1.1
 */
// eslint-disable-next-line no-unused-vars
class EoscCommonMainFooter extends Component {
  static propTypes = {
    production: PropTypes.bool,
    socialIcons: PropTypes.arrayOf(
      PropTypes.shape({
        class: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
  };

  static defaultProps = {
    production: environment.production,
    socialIcons: environment.mainFooterConfig.socials,
  };

  render(props) {
    const { production, socialIcons } = fieldsToCamelCase(usePropTypes(props, EoscCommonMainFooter));
    return (
      <footer className={`eosc-common footer pt-3 pb-3 ${production ? "" : "demo"}`}>
        <div className="container">
          <a className="arrow-up" href="#" /> {/* eslint-disable-line */}
          <EoscMainFooterLogoBar />
          <hr className="mb-4" />
          <EoscMainFooterCols />
          <div className="row mt-4 socials">
            <div className="col-md-6">
              {socialIcons.map((social) => {
                return (
                  <a className={social.class} href={social.url}>
                    &nbsp;
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

renderComponent(EoscCommonMainFooter, {
  tagName: "eosc-common-main-footer",
  className: "eosc-common-main-footer",
  idName: "eosc-common-main-footer",
});
renderComponent(EoscCommonMainFooter, { tagName: EoscCommonMainFooter.name });
window.EoscCommonMainFooter = EoscCommonMainFooter;

export default EoscCommonMainFooter;
