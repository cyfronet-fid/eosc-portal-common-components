### Description

Common EOSC header at top of the application.

### Examples

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
  w
></EoscCommonMainHeader>
```
