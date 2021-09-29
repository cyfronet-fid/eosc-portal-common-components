import React, { PureComponent } from "react";
import uniqueId from "lodash-es/uniqueId";
import PropTypes from "prop-types";
import { environment } from "../../env/env";

class EoscMainFooterCols extends PureComponent {
  render() {
    const { cols } = this.props;
    return (
      <div className="row">
        {cols.map((col) => (
          <div key={uniqueId("main-footer-col")} className="col-md">
            <ul>
              <li key={uniqueId("eosc-main-footer-li")}>
                <div className="title">{col.url ? <a href={col.url}>{col.label}</a> : col.label}</div>
              </li>
              {!!col.navBtns && col.navBtns.length > 0 ? (
                col.navBtns.map((btn) => (
                  <li className="mb-1" key={uniqueId("eosc-main-footer-li")}>
                    {btn.url ? <a href={btn.url}>{btn.label}</a> : btn.label}
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

EoscMainFooterCols.propTypes = {
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
      navBtns: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
};

EoscMainFooterCols.defaultProps = {
  cols: environment.mainFooterConfig.cols,
};

export default EoscMainFooterCols;
