### Description

Common EOSC header at top of the application.

### Component URLs

#### stable

https://s3.cloud.cyfronet.pl/eosc-portal-common/main-header.production.css

https://s3.cloud.cyfronet.pl/eosc-portal-common/main-header.production.js

#### latest

https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/main-header.production.css

https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/main-header.production.js

### Rendering examples

Render using class

```html
<div
  class="eosc-common-main-header"
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></div>
```

Render using id

**IMPORTANT!!! Only first element with the id will be rendered!**

```html
<div
  id="eosc-common-main-header"
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></div>
```

Render using camel case

```html
<EoscCommonMainHeader
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></EoscCommonMainHeader>
```

Render using snake case

```html
<eosc-common-main-header
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></eosc-common-main-header>
```

Render using build in tools

**IMPORTANT!!!**

- **Preferred for client side UI frameworks like Angular, AngularJS, ReactJS, VueJS, ...**
- **Attach script and styles in page header instead of the end of page body**

```html
<div
  id="custom-css-class"
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></div>
<script>
  window.renderCustomComponent(window.EoscCommonMainHeader, { id: "custom-css-class" });
</script>

<div
  class="custom-css-class"
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></div>
<script>
  window.renderCustomComponent(window.EoscCommonMainHeader, { className: "custom-css-class" });
</script>

<custom-tag-name
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></custom-tag-name>
<script>
  window.renderCustomComponent(window.EoscCommonMainHeader, { tagName: "custom-tag-name" });
</script>
```

Render using data attributes

**IMPORTANT!!! Preferred for client side UI frameworks like Angular, AngularJS, ReactJS, VueJS, ...**

```html
<div
  class="eosc-common-main-header"
  data-username="name surname"
  data-login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  data-logout-url="https://marketplace.eosc-portal.eu/users/logout"
></div>
```

### Working examples

The user isn't logged in

```js
<EoscCommonMainHeader
  username=""
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></EoscCommonMainHeader>
```

A user is logged

```js
<EoscCommonMainHeader
  username="name surname"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></EoscCommonMainHeader>
```

Handle onLogin with event argument (substitute of loginUrl)

```js
<EoscCommonMainHeader
  username=""
  on-login="alert($event.type + 'on login btn')"
  logout-url="https://marketplace.eosc-portal.eu/users/logout"
></EoscCommonMainHeader>
```

Handle onLogout with event argument (substitute of logoutUrl)

```js
<EoscCommonMainHeader
  username="name surname"
  on-logout="alert($event.type + ' on logout btn')"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
></EoscCommonMainHeader>
```

Handle multiple callbacks in onLogout (substitute of logoutUrl)

```js
<EoscCommonMainHeader
  username="name surname"
  on-logout="alert('logout btn'); alert('second call'); alert($event.type)"
  login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
></EoscCommonMainHeader>
```
