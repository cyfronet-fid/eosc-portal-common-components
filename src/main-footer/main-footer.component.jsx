import uniqueId from "lodash-es/uniqueId";
import PropTypes from "prop-types";
import { Component } from "preact";
import { environment } from "../../env/env";
import EoscMainFooterLogoBar from "./main-footer-logo-bar.component";
import EoscMainFooterCols from "./main-footer-cols.component";
import usePropTypes from "../../core/utils";
import Render from "../../core/renders";

/**
 * @version 1.0
 * @summary Common EOSC footer at bottom of the application.
 * @hideconstructor
 *
 * @component
 * @example
 * <!-- Default footer -->
 * <eosc-common-main-footer></eosc-common-main-footer>
 *
 */
@Render({
  selector: "eosc-common-main-footer",
})
// eslint-disable-next-line no-unused-vars
class EoscMainFooter extends Component {
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
    const { production, socialIcons } = usePropTypes(props, EoscMainFooter);
    return (
      <footer className={`footer pt-3 pb-3 ${production ? "" : "demo"}`}>
        <div className="container">
          <a className="arrow-up" href="#" /> {/* eslint-disable-line */}
          <EoscMainFooterLogoBar />
          <hr className="mb-4" />
          <EoscMainFooterCols />
          <div className="row mt-4 socials">
            <div className="col-md-6">
              {socialIcons.map((social) => {
                return (
                  <a key={uniqueId("main-footer-social-icon")} className={social.class} href={social.url}>
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

export default EoscMainFooter;
