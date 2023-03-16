import React from "react";
import { Board, SquareValues } from "./Board";
import './Game.css';

interface GameProps {}

interface GameState {
  history: SquareValues[]
  turnIndex: number
  winner: string | null
}

export class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [
        Array(9).fill(null)
      ],
      turnIndex: 0,
      winner: null
    }
  }

  getNextPlayer() {
    return this.state.turnIndex % 2 === 0 ? 'X' : 'O';
  }

  handleSquareClick(i: number) {
    if (this.state.winner) {
      return;
    }

    const turnSquares = this.state.history[this.state.turnIndex].slice();
    if (turnSquares[i]) {
      return;
    }

    turnSquares[i] = this.getNextPlayer();
    const previousHistory = this.state.history.slice(0, this.state.turnIndex + 1);

    this.setState({
      history: [...previousHistory, turnSquares],
      turnIndex: this.state.turnIndex + 1,
      winner: calculateWinner(turnSquares)
    });
  }

  jumpTo(turnIndex: number) {
    this.setState({
      history: this.state.history,
      turnIndex,
      winner: calculateWinner(this.state.history[turnIndex])
    });
  }

  render() {
    const history = this.state.history;
    const turnSquares = history[this.state.turnIndex];
    const status = this.state.winner ? `Winner: ${this.state.winner}` : `Next player: ${this.getNextPlayer()}`;

    const moves = history.map((_squareValues, turnIndex) => {
      const msg = turnIndex === 0 ? 'Restart game' : `Go to move ${turnIndex + 1}`;
      return (
        <li key={turnIndex}>
          <button onClick={() => this.jumpTo(turnIndex)}>{msg}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={turnSquares} onSquareClick={i => this.handleSquareClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: SquareValues): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const line = lines.find(l => {
    const [a, b, c] = l;
    return squares[a] && squares[a] === squares[b] && squares[b] === squares[c];
  });

  return line && squares[line[0]] || null;
}
