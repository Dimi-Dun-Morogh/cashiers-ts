import {
  shopNames as shopName, shiftNames as shiftName, days, shiftTimes,
} from './const';

export type Shopname = typeof shopName[number];
export type Shiftname = typeof shiftName[number];
export type Dayname = typeof days[number];
export type ShiftTime = typeof shiftTimes[number];

export type Shop = {
  id?: number
  name: Shopname
  city: string
  address: string
};

export type WorkingSchedule = {
  id?: number
  dayOfTheWeek: Dayname
  shiftName: Shiftname
  time: ShiftTime
};

export type Cashier = {
  id?: number
  age: number
  sex: string
  yearsOfExperience: number
  worksInShifts: Shiftname[]
};

export type CashRegister = {
  id?: number
  shopId: number
  number: number
};

export type ID = string | number;
