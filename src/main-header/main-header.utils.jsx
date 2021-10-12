import EoscMainHeaderLogoutBtn from "./main-header-logout-btn.component";
import EoscMainHeaderLoginBtn from "./main-header-login-btn.component";

export function isBtnActive(btnsUrls, btnUrl) {
  const currentUrlBase = location.protocol + "//" + location.hostname; // eslint-disable-line
  if (!btnUrl.includes(currentUrlBase)) {
    return false;
  }

  const allBtnsSubpages = btnsUrls
    .filter((url) => !!url && url.trim() !== "")
    .map((url) => new URL(url).pathname)
    .filter((path) => path !== "/");
  const parsedBtnUrl = new URL(btnUrl);
  const shouldBeActivatedOnSubpages = parsedBtnUrl.pathname === "/" && !allBtnsSubpages.includes(location.pathname); //eslint-disable-line
  const isSpecificSubpage = location.pathname !== "/" && new URL(btnUrl).pathname.includes(location.pathname); // eslint-disable-line
  return shouldBeActivatedOnSubpages || isSpecificSubpage;
}

export function getAuthBtn(props) {
  const { username } = props;
  const isLoggedIn = !!username && username.trim() !== "";
  return isLoggedIn ? <EoscMainHeaderLogoutBtn {...props} /> : <EoscMainHeaderLoginBtn {...props} />;
}
