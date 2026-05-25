import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

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