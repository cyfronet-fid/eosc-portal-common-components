# EOSC Portal common

[![Deploy stable lib](https://github.com/cyfronet-fid/eosc-portal-common/actions/workflows/deploy-stable.yaml/badge.svg?branch=master)](https://s3.cloud.cyfronet.pl/eosc-portal-common/docs/index.html)
[![Deploy latest lib](https://github.com/cyfronet-fid/eosc-portal-common/actions/workflows/deploy-latest.yaml/badge.svg?branch=develop)](https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/docs/index.html)

### Table of contents

- [Description](#description)
- [Requirements](#requirements)
- [Dependencies installation](#dependencies-installation)
- [Development](#development)
- [Building](#building)
- [Pushing to gihtub pages](#pushing-to-gihtub-pages)
- [Unit testing](#unit-testing)
- [Documentation](#documentation)
  - [Prerequisites](#prerequisites)
  - [Quickstart](#quickstart)
  - [Versions urls](#versions-urls)
- [How to contribute](#how-to-contribute)

### Description

Library contains the custom UI components of the EOSC Portal services. Uses the JS scripts, and the SCSS styles for
consistent visualization and events triggering through many services.

### Requirements

Only for build purposes

- nodejs >= 14.17.1 LTE

### Dependencies installation

Only for building purposes

```bash
npm install -g gulp-cli
npm i
```

### Development

- [Install dependencies](#dependencies-installation)
- Run development mode locally
  > Browser will be opened at http://localhost:3000/documentation/index.html
  ```bash
  npm start
  ```

### Building

Building produce `*.min.js`, `*.min.css` files into `dist` folder.
`index.min.js` and `index.mn.css` contains all library components. Other scripts and styles will be named as components.

**Params**

- production
  > Flag. When added library will be:
  >
  > - uglified
  > - optimized with bundle size
  > - source maps (help in debugging for developers) won't be added
- env
  > A relative path to a configuration

Examples

```bash
gulp build_lib --mode development --env env/env.production.js
```

```bash
gulp build_lib --mode development --env env/env.development.js
```

### Unit testing

Only for build purposes

```bash
npm run test
```

### Documentation

##### Prerequisites

You'll need to know a bit of HTML and JS. For refresher see [HTML tutorial](https://www.w3schools.com/html/)
or [JS tutorial](https://www.w3schools.com/js/default.asp).

##### Quickstart

- Attaching all components at once

  > Add script and styles to file with extension `.html`. It can be done by appending it into `<body>...</body>` section.

  **Examples**

  - Using public version

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body>
        <eosc-common-main-header
          username="name surname"
          login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
          logout-url="https://marketplace.eosc-portal.eu/users/logout"
        ></eosc-common-main-header>

        <script src="https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.min.js"></script>
        <link rel="stylesheet" href="https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.min.css" />
      </body>
    </html>
    ```

  - Using local build

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body>
        <eosc-common-main-header
          username="name surname"
          login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
          logout-url="https://marketplace.eosc-portal.eu/users/logout"
        ></eosc-common-main-header>

        <script src="../dist/index.production.min.js"></script>
        <link rel="stylesheet" href="../dist/index.production.min.css" />
      </body>
    </html>
    ```

- Attaching specific component from [list](https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.html)
  by its name

  > Add script and styles to file with extension `.html`. It can be done by appending it into `<body>...</body>` section.

  **Examples**

  - Using public version

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body>
        <eosc-common-main-header
          username="name surname"
          login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
          logout-url="https://marketplace.eosc-portal.eu/users/logout"
        ></eosc-common-main-header>

        <script src="https://s3.cloud.cyfronet.pl/eosc-portal-common/main-header.production.min.js"></script>
        <link rel="stylesheet" href="https://s3.cloud.cyfronet.pl/eosc-portal-common/main-header.production.min.css" />
      </body>
    </html>
    ```

  - Using local build

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body>
        <eosc-common-main-header
          username="name surname"
          login-url="https://marketplace.eosc-portal.eu/users/auth/checkin"
          logout-url="https://marketplace.eosc-portal.eu/users/logout"
        ></eosc-common-main-header>

        <script src="../dist/main-header.production.min.js"></script>
        <link rel="stylesheet" href="../dist/main-header.production.min.css" />
      </body>
    </html>
    ```

### Versions URLs

The URL pattern for:

- stable version

  ```text
    https://s3.cloud.cyfronet.pl/eosc-portal-common/<file-name>.production.<extension>
  ```

- versions **other than stable**

  ```text
  https://s3.cloud.cyfronet.pl/eosc-portal-common/<lib-version>/<file-name>.<data-instance>.<extension>
  ```

  The lib versions:

  - `pr-<pull-request-number>`
  - `latest`

Data instances:

- development
- production
- beta

The files name's and its extensions:

- [the components names](https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.html)
  - extensions
    - `.js`
    - `.css`
- index
  - extensions
    - `.html`
    - `.js`
    - `.css`

**Examples**

- stable

  - documentation file
    ```text
    https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.html
    ```
  - all components
    - styles
    ```text
     https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.css
    ```
    - scripts
    ```text
     https://s3.cloud.cyfronet.pl/eosc-portal-common/index.production.js
    ```

- latest
  - documentation file with development data
    ```text
    https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/index.development.html
    ```
  - all components
    - styles with production data
    ```text
     https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/index.production.css
    ```
    - scripts with development data
    ```text
     https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/index.development.js
    ```

### How to contribute

1. Go to file you want to edit (for example https://github.com/cyfronet-fid/eosc-portal-common/blob/develop/configurations/configuration.production.json)
2. Click `pen icon`
   ![config](https://user-images.githubusercontent.com/31220811/138041697-ed2af299-65b5-4c2e-9080-5188c92a8b76.png)
3. Provide changes in edition field
   ![edition](https://user-images.githubusercontent.com/31220811/138041903-534a21e1-973a-4d8b-9f48-5139df12ec63.png)
4. Click `Propose changes`
   ![propose changes](https://user-images.githubusercontent.com/31220811/138042013-65286f41-7f58-4788-9432-439d4e0b8649.png)
5. See provided changes and confirm them by clicking `Create pull request`
   ![Provided changes](https://user-images.githubusercontent.com/31220811/138042232-0be21178-25f0-4eb1-94eb-f181e66e338d.png)
