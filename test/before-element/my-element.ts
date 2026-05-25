import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'


function renderFooter() {
  return html`
    <div part="footer">
      <!-- An optional footer. -->
      <slot name="footer"></slot>
    </div>
  `
}

@customElement('my-element')
export class MyElement extends LitElement {
  // ...

  render() {
    return [
      html`
        <div part="body"></div>
      `,
      renderFooter()
    ]
  }
  // ...
}
