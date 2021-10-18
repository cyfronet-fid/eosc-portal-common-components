import PropTypes from "prop-types";
import { Component, Fragment } from "preact";
import { environment } from "../../env/env";
import { usePropTypes } from "../../core/utils";

export default class EoscMainFooterCols extends Component {
  static propTypes = {
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

  static defaultProps = {
    cols: environment.mainFooterConfig.cols,
  };

  render(props) {
    const { cols } = usePropTypes(props, EoscMainFooterCols);
    return (
      <div className="row">
        {cols.map((col) => (
          <div className="col-md">
            <ul>
              <li>
                <div className="title">{col.url ? <a href={col.url}>{col.label}</a> : col.label}</div>
              </li>
              {!!col.navBtns && col.navBtns.length > 0 ? (
                col.navBtns.map((btn) => (
                  <li className="mb-1">{btn.url ? <a href={btn.url}>{btn.label}</a> : btn.label}</li>
                ))
              ) : (
                <Fragment />
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}
