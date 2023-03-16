import React from "react";

interface SquareProps {
  value: number
}

interface SquareState {}

export class Square extends React.Component<SquareProps, SquareState> {
    render() {
      return (
        <button className="square">
          { this.props.value }
        </button>
      );
    }
  }
  