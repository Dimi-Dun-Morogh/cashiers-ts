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
  cashRegisterId: number
  cashierId:number
  shopId:number
};

export type Cashier = {
  id?: number
  age: number
  sex: string
  yearsOfExperience: number
  name: string
  worksInShifts: Shiftname[]
};

export type CashRegister = {
  id?: number
  shopId: number
  number: number
};

export type Filters = {
  [key:string] : number | string
};

export type ID = string | number;

export enum ROUTES {
  CASHIERS = '/api/cashiers',
  SHOPS = '/api/shops',
  CASHREGS = '/api/cashregs',
  WORKSCHEDULES = '/api/workschedule',
}
