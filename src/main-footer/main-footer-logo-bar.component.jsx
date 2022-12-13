export default function EoscMainFooterLogoBar() {
    return (
        <div className="row h-100">
            <div className="col-md-3 my-auto">
                <a className="logo-one d-block" href="https://eosc-portal.eu">
                    &nbsp;
                </a>
            </div>
            <div className="col-md-3 my-auto socials">
                <a href={"https://twitter.com/EoscPortal"} className="social-logo twitter-logo" target="_blank">@EOSCPortal</a>
            </div>
            <div className="col-md-3 my-auto socials">
                <a href={"https://www.youtube.com/channel/UCHsaUFy5LJ3rJ28qDg2StGA"} className="social-logo yt-logo" target="_blank">@EOSCPortal</a>
            </div>
        </div>
    );
}
