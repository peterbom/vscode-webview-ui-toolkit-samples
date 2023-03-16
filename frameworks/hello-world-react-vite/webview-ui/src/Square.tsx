import React from "react";

interface SquareProps {
  value: string | null
  onClick: () => void
}

export function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
