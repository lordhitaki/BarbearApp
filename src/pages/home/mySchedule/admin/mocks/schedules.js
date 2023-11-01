import {useState} from 'react';

let schedulesData = [];

export function setSchedules(newSchedules) {
  schedulesData = newSchedules;
}

export function getSchedules() {
  return schedulesData;
}

export function useSchedules() {
  const [schedules, setLocalSchedules] = useState(schedulesData);

  const setSchedulesWrapper = newSchedules => {
    setLocalSchedules(newSchedules);
    setSchedules(newSchedules);
  };

  return [schedules, setSchedulesWrapper];
}
