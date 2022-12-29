/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, state } from 'lit/decorators.js';
import { SharedStyles } from './shared-styles';

import './zone-header';
import './battery-level';
import './last-seen';
import { loadGoogleCharts } from './chart-loader';
import { GoogleViz } from './chart-types';
import { ZoneData } from '../actions/hg-data';

@customElement('time-zone')
export class TimeZone extends LitElement {
  @state()
  protected chart!: GoogleViz | any;

  @state()
  protected googleApi: any = null;

  @property({ type: Object })
  private zone!: ZoneData;

  @property({ type: Boolean })
  private loaded = false;

  @property({ type: Object })
  private loading: Object | undefined;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
          padding: 10px;
          width: 100%;
        }

        :host([hidden]) {
          display: none;
        }

        #chartId {
          width: 100%;
          height: 350px;
        }
      `,
    ];
  }

  protected render() {
    return html`<div id="chartId"></div>`;
  }

  private initChart(google: any): boolean {
    const chartId = this.renderRoot.querySelector('#chartId');
    if (chartId) {
      this.googleApi = google;
    }
    return true;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    const chartId = this.renderRoot.querySelector('#chartId');
    if (chartId && this.googleApi !== null) {
      const chart = new this.googleApi.visualization.Timeline(chartId);
      const dataTable = new this.googleApi.visualization.DataTable();
      const d = new Date();
      const tz = d.getTimezoneOffset() * 60 * 1000;
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const results = [];
      const data = this.zone?.objTimer;

      if (data !== undefined) {
        // eslint-disable-next-line no-plusplus
        for (let day = 0; day < 7; day++) {
          const today = data.filter(item => item.iDay === day);
          let lastTime = 0;
          let setPoint = 0;
          for (const event of today) {
            if (lastTime !== event.iTm && event.iTm !== -1) {
              results.push([
                days[day],
                this.getText(setPoint),
                new Date(lastTime * 1000 + tz),
                new Date(event.iTm * 1000 + tz),
              ]);
            }
            setPoint = event.fSP;
            lastTime = Math.max(0, event.iTm);
          }
          if (lastTime !== 86400) {
            results.push([
              days[day],
              this.getText(setPoint),
              new Date(lastTime * 1000 + tz),
              new Date(24 * 60 * 60 * 1000 - 1 + tz),
            ]);
          }
          lastTime = 0;
        }
        dataTable.addColumn({
          id: 'Day',
          type: 'string',
        });
        dataTable.addColumn({
          id: 'State',
          type: 'string',
        });
        dataTable.addColumn({
          id: 'Start',
          type: 'date',
        });
        dataTable.addColumn({
          id: 'End',
          type: 'date',
        });
        dataTable.addRows(results);

        const options = {
          width: '100%',
          height: '850px',
          tooltip: {
            isHtml: false,
          },
        };
        chart.draw(dataTable, options);
      }
    }
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    loadGoogleCharts('current', { packages: ['timeline', 'map'] }).then(
      google => {
        this.initChart(google);
      }
    );
  }

  /* ready() {
    super.ready();
    // do something that requires access to the shadow tree
    if (this.loading === undefined) {
      this.loading = GoogleCharts.load(null, 'timeline');
      this.loading.then(() => {
        this.loaded = true;
        this.dispatchEvent(
          new CustomEvent('refresh', {
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }
  */

  /*
  private getData(zone: Object) {
    if (zone !== undefined && zone !== null && this.loaded === true) {
      this.hidden = false;
      const chart = new GoogleCharts.api.visualization.Timeline(this.$.chart);
      const dataTable = new GoogleCharts.api.visualization.DataTable();
      const d = new Date();
      const tz = d.getTimezoneOffset() * 60 * 1000;
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const results = [];
      const data = this.zone.objTimer;

      for (let day = 0; day < 7; day++) {
        const today = data.filter(item => item.iDay === day);
        let lastTime = 0;
        let setPoint = 0;
        for (const key of Object.keys(today)) {
          const event = today[key];
          if (lastTime !== event.iTm && event.iTm !== -1) {
            results.push([
              days[day],
              this.getText(setPoint),
              new Date(lastTime * 1000 + tz),
              new Date(event.iTm * 1000 + tz),
            ]);
          }
          setPoint = event.fSP;
          lastTime = Math.max(0, event.iTm);
        }
        if (lastTime !== 86400) {
          results.push([
            days[day],
            this.getText(setPoint),
            new Date(lastTime * 1000 + tz),
            new Date(24 * 60 * 60 * 1000 - 1 + tz),
          ]);
        }
        lastTime = 0;
      }
      dataTable.addColumn({
        id: 'Day',
        type: 'string',
      });
      dataTable.addColumn({
        id: 'State',
        type: 'string',
      });
      dataTable.addColumn({
        id: 'Start',
        type: 'date',
      });
      dataTable.addColumn({
        id: 'End',
        type: 'date',
      });
      dataTable.addRows(results);

      const options = {
        tooltip: {
          isHtml: false,
        },
      };
      chart.draw(dataTable, options);
    } else {
      this.hidden = true;
    }
  }
   */

  private getText(setPoint: number) {
    if (this.zone.isSwitch) {
      if (setPoint === 0) {
        return 'Off';
      }
      return 'On';
    }
    return `${String(setPoint)}℃`;
  }
}
