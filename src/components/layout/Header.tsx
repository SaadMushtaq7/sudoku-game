import React from "react";
import { Difficulty } from "../Difficulty";
import { Timer } from "../Timer";

type HeaderProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
export const Header = (props: HeaderProps) => {
  return (
    <header className="header">
      <h1>Sudoku</h1>
      <Difficulty onChange={props.onChange} />
      <Timer />
    </header>
  );
};
