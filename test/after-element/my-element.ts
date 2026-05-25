import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

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

function renderFooter() {
  return html`
    <div part="footer">
      <!-- An optional footer. -->
      <slot name="footer"></slot>
    </div>
  `
}
