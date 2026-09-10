import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getTimeOffsetSec,
  setTimeOffsetSec,
  addTimeOffsetSec,
  getEffectiveCurrentTime
} from '../services/mockStorage';

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  const [offsetSec, setOffsetSec] = useState(getTimeOffsetSec());
  const [simulatedDate, setSimulatedDate] = useState(new Date(getEffectiveCurrentTime()));

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedDate(new Date(getEffectiveCurrentTime()));
    }, 1000);

    const handleTimeChange = () => {
      setOffsetSec(getTimeOffsetSec());
      setSimulatedDate(new Date(getEffectiveCurrentTime()));
    };

    window.addEventListener('dropick_time_changed', handleTimeChange);
    return () => {
      clearInterval(timer);
      window.removeEventListener('dropick_time_changed', handleTimeChange);
    };
  }, []);

  const fastForward = (seconds) => {
    addTimeOffsetSec(seconds);
  };

  const resetSimulation = () => {
    setTimeOffsetSec(0);
  };

  return (
    <SimulationContext.Provider
      value={{
        offsetSec,
        simulatedDate,
        fastForward,
        resetSimulation,
        isSimulated: offsetSec > 0,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
