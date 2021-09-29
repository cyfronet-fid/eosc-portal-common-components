import React from "react";

function EoscMainFooterLogoBar() {
  return (
    <div className="row h-100">
      <div className="col-md-3 my-auto">
        <a className="eosc-logo-mono d-block" href="https://eosc-portal.eu">
          <img src="assets/eosc-logo-mono.png" alt="" />
        </a>
      </div>
      <div className="col-md-9 my-auto copyright">
        <span className="copy-text">Copyright 2021 - All rights reserved</span>
        <a className="ml-4 text-uppercase" href="https://eosc-portal.eu/privacy-policy-summary">
          privacy policy
        </a>
      </div>
    </div>
  );
}

export default EoscMainFooterLogoBar;
