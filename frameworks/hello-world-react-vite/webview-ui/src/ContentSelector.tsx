import { useState } from "react";
import "./ContentSelector.css"

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
        <ul className="sidebar">
        {
          Object.keys(props.contentMap).map(id => (
            <li key={id}>
              <a href="#" className="content-link" onClick={() => handleLinkClick(id)}>{id}</a>
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