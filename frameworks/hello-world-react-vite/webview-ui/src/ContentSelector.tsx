import { useState } from "react";
import styles from "./ContentSelector.module.css"

export interface ContentSelectorProps {
  contentMap: { [contentId: string]: () => JSX.Element },
  onContentChange: (contentId: string) => void
}

export function ContentSelector(props: ContentSelectorProps) {
  const [selected, setSelected] = useState("");

  function handleLinkClick(contentId: string) {
    setSelected(contentId);
    props.onContentChange(contentId);
  }

  return (
    <>
      <ul className={styles.sidebar}>
      {
        Object.keys(props.contentMap).map(id => (
          <li key={id}>
            <a href="#" className={styles.contentLink} onClick={() => handleLinkClick(id)}>{id}</a>
          </li>
        ))
      }
      </ul>
      {
        selected && (
          <div className={styles.main}>
            {props.contentMap[selected]()}
          </div>
        )
      }
    </>
  );
}