import React, { useState, useEffect } from "react";
import { useSudokuContext } from "../context/SudokuContext";
import moment from "moment";

export const Timer = () => {
  let [currentTime, setCurrentTime] = useState(moment());
  let { timeGameStarted, won } = useSudokuContext();

  const tick = () => {
    setCurrentTime(moment());
  };

  const getTimer = () => {
    let secondsTotal = currentTime.diff(timeGameStarted, "seconds");
    if (secondsTotal <= 0) return "00:00";
    let duration = moment.duration(secondsTotal, "seconds");
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let stringTimer = "";

    stringTimer += hours ? "" + hours + ":" : "";
    stringTimer += minutes ? (minutes < 10 ? "0" : "") + minutes + ":" : "00:";
    stringTimer += seconds < 10 ? "0" + seconds : seconds;

    return stringTimer;
  };

  useEffect(() => {
    if (!won) setTimeout(() => tick(), 1000);
  });

  return <div className="status__time">{getTimer()}</div>;
};
