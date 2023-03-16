import React from "react";
import { Square } from "./Square";

export type SquareValue = string | null;
export type SquareValues = SquareValue[];

interface BoardProps {
  squares: SquareValues
  onSquareClick: (index: number) => void
}

interface BoardState {}

export class Board extends React.Component<BoardProps, BoardState> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onSquareClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
