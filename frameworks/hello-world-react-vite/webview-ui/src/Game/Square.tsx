import styles from './Square.module.css';

interface SquareProps {
  value: string | null
  onClick: () => void
}

export function Square(props: SquareProps) {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
