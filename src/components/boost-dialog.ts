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
  @query('#temperature')
  private temperature!: any;

  @query('#time')
  private time!: any;

  @query('time-picker')
  private timePicker!: any;

  @query('mwc-dialog')
  private boostDialog: any;

  @property({ type: String })
  private name = 'Test heading';

  @property({ type: String })
  private duration = '2:30';

  @property({ type: Boolean, reflect: true })
  _open = false;

  static get styles() {
    return [SharedStyles, css``];
  }

  render() {
    return html`
      <mwc-dialog heading="Boost ${this.name}">
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
  </div><div>
            <mwc-textfield
            id="time"
              label="Time"
              @click=${this.openTimePicker}
            ></mwc-textfield>
          </div>
          </div>
        </div>
        <mwc-button id="addUpdate" slot="secondaryAction" @click="${this.close}">Cancel</mwc-button>
        <mwc-button slot="primaryAction">Apply</mwc-button>
        </mwc-dialog>
        <time-picker .time=${this.duration} duration @time-picker-cancelled=${this.timePickerCancelled} @time-picker-ok=${this.timePickerOK}></time-picker>
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
    this.boostDialog.close();
    this.timePicker.show();
  }

  // eslint-disable-next-line class-methods-use-this
  timePickerCancelled(_e: Event) {
    this.boostDialog.show();
  }

  // eslint-disable-next-line class-methods-use-this
  timePickerOK(event: Event) {
    this.boostDialog.show();

    const target = event.target as any;
    this.time.value = target.time;
  }
}
