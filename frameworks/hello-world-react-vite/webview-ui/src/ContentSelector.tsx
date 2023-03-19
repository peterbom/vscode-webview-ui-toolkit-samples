import { useState } from "react";
import "./ContentSelector.css"

export interface ContentSelectorProps {
  contentMap: { [contentId: string]: () => JSX.Element }
}

export function ContentSelector(props: ContentSelectorProps) {
    const [selected, setSelected] = useState("");
  
    return (
      <>
        <ul className="sidebar">
        {
          Object.keys(props.contentMap).map(id => (
            <li key={id}>
              <a href="#" className="content-link" onClick={() => setSelected(id)}>{id}</a>
            </li>
          ))
        }
        </ul>
        {
          selected && (
            <div className="main">
              {props.contentMap[selected]()}
            </div>
          )
        }
      </>
    );
  }