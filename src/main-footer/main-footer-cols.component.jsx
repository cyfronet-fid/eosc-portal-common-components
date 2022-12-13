import PropTypes from "prop-types";
import { Component, Fragment } from "preact";
import { environment } from "../../env/env";
import { usePropTypes } from "../../core/utils";

export default class EoscMainFooterCols extends Component {
    static propTypes = {
        cols: PropTypes.arrayOf(
            PropTypes.arrayOf(
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
            )
        ),
    };

    static defaultProps = {
        cols: environment.mainFooterConfig.cols,
    };

    render(props) {
        const { cols } = usePropTypes(props, EoscMainFooterCols);
        return (
            <div className="row mt-5 pb-2">
                {cols.map((col) => (
                    <div className="col-md">
                        {col.map((list) => (
                            <ul>
                                <li>
                                    <div className="title">{list.url ? <a href={list.url}>{list.label}</a> : list.label}</div>
                                </li>
                                {!!list.navBtns && list.navBtns.length > 0 ? (
                                    list.navBtns.map((btn) => <li>{btn.url ? <a href={btn.url}>{btn.label}</a> : btn.label}</li>)
                                ) : (
                                    <Fragment />
                                )}
                            </ul>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
