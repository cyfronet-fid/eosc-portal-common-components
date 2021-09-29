import React from "react";
import uniqueId from "lodash-es/uniqueId";
import PropTypes from "prop-types";

class EoscMainHeaderBtn extends React.PureComponent {
  render() {
    const { url, label, isActive } = this.props;
    return (
      <li key={uniqueId("eosc-main-header-li")}>
        <a className={isActive ? "active" : ""} href={url}>
          {label}
        </a>
      </li>
    );
  }
}

EoscMainHeaderBtn.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default EoscMainHeaderBtn;
