import React, { useState, useEffect } from "react";
import moment from "moment";
import { Header } from "./components/layout/Header";
import { GameSection } from "./components/layout/GameSection";
import { StatusSection } from "./components/layout/StatusSection";
import { getUniqueSudoku } from "./solver/UniqueSudoku";
import { useSudokuContext } from "./context/SudokuContext";

export const Game: React.FC<{}> = () => {
  let {
    setNumberSelected,
    gameArray,
    setGameArray,
    difficulty,
    setDifficulty,
    setTimeGameStarted,
    cellSelected,
    setCellSelected,
    initArray,
    setInitArray,
    setWon,
  } = useSudokuContext();
  const [history, setHistory] = useState<string[][]>([]);
  const [solvedArray, setSolvedArray] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<boolean>(false);
  const _createNewGame = (e?: React.ChangeEvent<HTMLSelectElement>) => {
    let [temporaryInitArray, temporarySolvedArray] = getUniqueSudoku(
      difficulty,
      e
    );

    setInitArray(temporaryInitArray);
    setGameArray(temporaryInitArray);
    setSolvedArray(temporarySolvedArray);
    setNumberSelected("0");
    setTimeGameStarted(moment());
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
  };

  const _isSolved = (index: number, value: string) => {
    if (
      gameArray.every((cell: string, cellIndex: number) => {
        if (cellIndex === index) return value === solvedArray[cellIndex];
        else return cell === solvedArray[cellIndex];
      })
    ) {
      return true;
    }
    return false;
  };

  const _fillCell = (index: number, value: string) => {
    if (initArray[index] === "0") {
      let tempArray = gameArray.slice();
      let tempHistory = history.slice();

      tempHistory.push(gameArray.slice());
      setHistory(tempHistory);

      tempArray[index] = value;
      setGameArray(tempArray);

      if (_isSolved(index, value)) {
        setOverlay(true);
        setWon(true);
      }
    }
  };

  const _userFillCell = (index: number, value: string) => {
    if (value === solvedArray[index]) {
      _fillCell(index, value);
      let x = document.getElementsByTagName("td");
      x[index].style.color = "#7793b6";
    } else {
      let x = document.getElementsByTagName("td");
      x[index].style.color = "crimson";
      _fillCell(index, value);
    }
  };

  const onClickNewGame = () => {
    _createNewGame();
  };

  const onClickCell = (indexOfArray: number) => {
    setCellSelected(indexOfArray);
  };

  const onChangeDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
    _createNewGame(e);
  };

  const onClickNumber = (number: string) => {
    _userFillCell(cellSelected, number);
  };

  const onClickUndo = () => {
    if (history.length) {
      let tempHistory = history.slice();
      let tempArray = tempHistory.pop();
      setHistory(tempHistory);
      if (tempArray !== undefined) setGameArray(tempArray);
    }
  };

  const onClickErase = () => {
    if (cellSelected !== -1 && gameArray[cellSelected] !== "0") {
      _fillCell(cellSelected, "0");
    }
  };

  const onClickHint = () => {
    if (cellSelected !== -1) {
      _fillCell(cellSelected, solvedArray[cellSelected]);
    }
  };

  const onClickOverlay = () => {
    setOverlay(false);
    _createNewGame();
  };

  useEffect(() => {
    _createNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={overlay ? "container blur" : "container"}>
        <Header
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onChangeDifficulty(e)
          }
        />
        <div className="innercontainer">
          <GameSection
            onClick={(indexOfArray: number) => onClickCell(indexOfArray)}
            solvedArray={solvedArray}
          />
          <StatusSection
            onClick={onClickNewGame}
            onClickNumber={(number: string) => onClickNumber(number)}
            onClickUndo={onClickUndo}
            onClickErase={onClickErase}
            onClickHint={onClickHint}
          />
        </div>
      </div>
      <div
        className={overlay ? "overlay overlay--visible" : "overlay"}
        onClick={onClickOverlay}
      >
        <h2 className="overlay__text">
          You <span className="overlay__textspan1">solved</span>{" "}
          <span className="overlay__textspan2">it!</span>
        </h2>
      </div>
    </>
  );
};
