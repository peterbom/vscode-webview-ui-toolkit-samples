import { useState } from "react";
import styles from "./ContentSelector.module.css"

export interface ContentSelectorProps {
  testScenarioNames: string[]
  onTestScenarioChange: (contentName: string) => JSX.Element
}

export function ContentSelector(props: ContentSelectorProps) {
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [selected, setSelected] = useState<string>("");

  function handleTestScenarioChange(name: string) {
    setSelected(name);
    const newContent = props.onTestScenarioChange(name);
    setContent(newContent);
  }

  function getLinkClassNames(name: string): string {
    return [styles.contentLink, selected === name && styles.selected].filter(s => s).join(' ');
  }

  return (
    <>
      <ul className={styles.sidebar}>
      {
        props.testScenarioNames.map(name => (
          <li key={name}>
            <a href="#" className={getLinkClassNames(name)} onClick={() => handleTestScenarioChange(name)}>{name}</a>
          </li>
        ))
      }
      </ul>
      {
        content && <div className={styles.main}>{content}</div>
      }
    </>
  );
}