import {useState} from 'react';

let schedulesData = []; // Inicialize com um valor vazio

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
    setSchedules(newSchedules); // Atualize a variável global quando o estado local for atualizado
  };

  return [schedules, setSchedulesWrapper];
}
