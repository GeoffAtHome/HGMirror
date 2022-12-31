/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query } from 'lit/decorators.js';
import './time-picker';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-button';
import { SharedStyles } from './shared-styles';

@customElement('boost-dialog')
export class BootDialog extends LitElement {
  @query('time-picker')
  private timePicker!: any;

  @query('mwc-dialog')
  private boostDialog: any;

  @property({ type: String })
  private name = 'Test heading';

  @property({ type: Boolean, reflect: true })
  _open = false;

  static get styles() {
    return [SharedStyles, css``];
  }

  render() {
    return html`
      <mwc-dialog id="boost" heading="${this.name}">
      <div>
          <div>
            <mwc-textfield
              id="temperature"
              type="text"
              label="Temperature"
              validationMessage="A name is required"
              required
              minlength="1"
            ></mwc-textfield>
            <mwc-button >Temperature</mwc-button></div>
          <div>
            <mwc-textfield
              label="Time"
              @click=${this.openTimePicker}
            ></mwc-textfield>
          </div>
          </div>
        </div>
        <mwc-button id="addUpdate" slot="secondaryAction" @click="${this.close}">Cancel</mwc-button>
        <mwc-button slot="primaryAction">Apply</mwc-button>
        </mwc-dialog>
        <time-picker></time-picker>
    `;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (this._open) this.boostDialog.show();
    else this.boostDialog.close();
  }

  private close() {
    this._open = false;
  }

  openTimePicker(_event: Event) {
    this.timePicker.open();
  }
}
