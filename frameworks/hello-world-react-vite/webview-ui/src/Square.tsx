import React from "react";

interface SquareProps {
  value: string | null
  onClick: () => void
}

interface SquareState {
}

export class Square extends React.Component<SquareProps, SquareState> {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        { this.props.value }
      </button>
    );
  }
}
  