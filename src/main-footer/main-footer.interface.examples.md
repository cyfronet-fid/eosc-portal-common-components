### Description

Common EOSC footer at bottom of the application.

### Component URLs

#### stable

https://s3.cloud.cyfronet.pl/eosc-portal-common/main-footer.production.css

https://s3.cloud.cyfronet.pl/eosc-portal-common/main-footer.production.js

#### latest

https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/main-footer.production.css

https://s3.cloud.cyfronet.pl/eosc-portal-common/latest/main-footer.production.js

### Rendering examples

Render using class

```html
<div class="eosc-common-main-footer"></div>
```

Render using id

**IMPORTANT!!! Only first element with the id will be rendered!**

```html
<div id="eosc-common-main-footer"></div>
```

Render using camel case

```html
<EoscCommonMainFooter></EoscCommonMainFooter>
```

Render using snake case

```html
<eosc-common-main-footer></eosc-common-main-footer>
```

Render using build in tools

**IMPORTANT!!!**

- **Preferred for client side UI frameworks like Angular, AngularJS, ReactJS, VueJS, ...**
- **Attach script and styles in page header instead of the end of page body**

```html
<div id="custom-css-class"></div>
<script>
  window.renderCustomComponent(window.EoscCommonMainFooter, { id: "custom-css-class" });
</script>

<div class="custom-css-class"></div>
<script>
  window.renderCustomComponent(window.EoscCommonMainFooter, { className: "custom-css-class" });
</script>

<custom-tag-name></custom-tag-name>
<script>
  window.renderCustomComponent(window.EoscCommonMainFooter, { tagName: "custom-tag-name" });
</script>
```

### Working examples

```js
<EoscCommonMainFooter></EoscCommonMainFooter>
```
