const shopNames = ['ATB', 'METRO'] as const;
const shiftNames = ['nightShift', 'dayShift', 'morningShift'] as const;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'] as const;
const shiftTimes = ['07:00-15:00', '23:00-07:00', '15:00-23:00'] as const;

export {
  shopNames,
  shiftNames,
  days,
  shiftTimes,
};
