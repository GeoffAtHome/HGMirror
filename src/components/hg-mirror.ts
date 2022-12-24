import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import './main-app';
import './user-login';

@customElement('hg-mirror')
export class HgMirror extends LitElement {
  @property({ type: String }) title = 'My app';

  @property({ type: Boolean })
  private _loggedIn: boolean = false;

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--hg-mirror-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  render() {
    return this._loggedIn
      ? html`<my-app></my-app>`
      : html`<user-login></user-login>`;
  }
}
