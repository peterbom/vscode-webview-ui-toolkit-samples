export interface ErrorViewProps {
  message: string
}

export function ErrorView(props: ErrorViewProps) {
  return (
    <>
      {props.message}
    </>
  );
}