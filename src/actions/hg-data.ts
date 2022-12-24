/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Action, ActionCreator } from 'redux';

export const HG_DATA = 'HG_DATA';

/* name – identifier for the district
id – numeric number for the district
streets – array of streets the district is responsible for
rounds – array of rounds the district is responsible for
notes – notes about the district
contact_details – name, phone number, email address….. */
export interface HgData {
  data: Object;
}

// Mode_Off: 1,
// Mode_Timer: 2,
// Mode_Footprint: 4,
// Mode_Away: 8,
// Mode_Boost: 16,
// Mode_Early: 32,
// Mode_Test: 64,
// Mode_Linked: 128,
// Mode_Other: 256

// eslint-disable-next-line no-shadow
export enum ZoneMode {
  ModeOff = 1,
  ModeTimer = 2,
  ModeFootprint = 4,
  ModeAway = 8,
  ModeBoost = 16,
  ModeEarly = 32,
  ModeTest = 64,
  ModeLinked = 128,
  ModeOther = 256,
}

export interface ZoneData {
  name: string;
  id: string;
  mode: ZoneMode;
  isSwitch: boolean;
  boost: number;
}

export const defaultZoneData: ZoneData = {
  name: '',
  id: '',
  mode: ZoneMode.ModeTest,
  isSwitch: false,
  boost: -1,
};

export interface HgDataState {
  _data: HgData;
  _zones: Array<ZoneData>;
}

export interface HgDataAction extends Action<'HG_DATA'> {
  _data: HgData;
  _zones: Array<ZoneData>;
}

export type HgDataActions = HgDataAction;

export const hgDataSetData: ActionCreator<HgDataAction> = (_data, _zones) => ({
  type: HG_DATA,
  _data,
  _zones,
});
