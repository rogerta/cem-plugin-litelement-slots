# cem-plugin-litelement-slots

A plugin for [@custom-elements-manifest/analyzer](https://github.com/open-wc/custom-elements-manifest) that maps `<slot>` elements in [Lit](https://lit.dev)-based web components to the "slots" property of the Custom Elements Manifests without requiring JSDoc `@slot` tags.

## Usage

### Install:

```bash
npm i --save-dev cem-plugin-litelement-slots
```

### Import

`custom-elements-manifest.config.js`:
```js
import slotsPlugin from 'cem-plugin-litelement-slots';

export default {
  plugins: [
    slotsPlugin()
  ]
}
```

## Supported syntax

```ts
@customElement('my-element')
export class MyElement extends LitElement {
  // ...

  render() {
    return [
      html`
        <div part="header">
          <!-- An optional header. -->
          <slot name="header"></slot>
        </div>
        <div part="body">
          <!-- The main body of the element. -->
          <!-- Multiple comments are supported. -->
          <!-- Multi-line
               comments
               also work,
               with all leading and trailing space trimmed.
          -->
          <slot></slot>
        </div>
      `,
      this.renderFooter_()
    ]
  }

  private renderFooter_() {
    return html`
      <div part="footer">
        <!-- An optional footer. -->
        <slot name="footer"></slot>
      </div>
    `
  }

  // ...
}
```

The plugin supports multiple web component classes per source file.  Multiple html template strings can appear within a component.  Caveats:

- any html template string that is defined before any web component class is ignored.  To include it, move the definition to after the web component class.
- any html template string that is defined outside of a web component class is attributed to the class that immediately preceeds it.  If this is a helper function that is used by multiple web component classes, use the explit JSDoc `@slot` tag in earlier classes.

## Expected output

The expected output for the custom elements defined above:

```diff
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "fixtures/default/sourcecode/default.ts",
      "declarations": [
        {
          "kind": "class",
          "description": "",
          "name": "MyElement",
          "members": [
            {
              "kind": "method",
              "name": "renderFooter_",
              "privacy": "private"
            }
          ],
          "superclass": {
            "name": "LitElement",
            "package": "lit"
          },
+         "slots": [
+           {
+             "name": "header",
+             "description": "An optional header."
+           },
+           {
+             "name": "",
+             "description": "The main body of the element. Multiple comments are supported. Multi-line comments also work, with all leading and trailing space trimmed."
+           },
+           {
+             "name": "footer",
+             "description": "An optional footer."
+           }
+         ],
          "tagName": "my-element",
          "customElement": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "MyElement",
          "declaration": {
            "name": "MyElement",
            "module": "fixtures/default/sourcecode/default.ts"
          }
        },
        {
          "kind": "custom-element-definition",
          "name": "my-element",
          "declaration": {
            "name": "MyElement",
            "module": "fixtures/default/sourcecode/default.ts"
          }
        }
      ]
    }
  ]
}
```
