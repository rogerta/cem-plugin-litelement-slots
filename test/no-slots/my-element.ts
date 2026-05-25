import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-element')
export class MyElement extends LitElement {
  // ...

  render() {
    return [
      html`
        <div></div>
      `,
    ]
  }

  // ...
}