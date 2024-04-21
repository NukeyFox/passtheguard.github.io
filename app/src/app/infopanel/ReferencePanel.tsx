import { useState } from "react";
import { Reference, ResourceType } from "../../database/db_node_components";
import "./ReferencePanel.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

interface ExpandableMenuItemProps {
    title: string;
    content: Reference[];
    isOpen?: boolean; // Optional prop for initial open state
    onToggle?: () => void; // Optional callback for toggle events
  }


function formatReference(reference : Reference, index : number) : JSX.Element {
          console.log(reference);
          switch (reference.resource_type) {
            case ResourceType.YoutubeVideo: {
              return (
                <p key={index}>
                  <div className="youtube-content">
                <LiteYouTubeEmbed 
                  id={reference.resource}
                  title={reference.resource_name || "Youtube reference"}
                  /></div>
                  </p>)}
            case ResourceType.Article: break;
            case ResourceType.Image: break;
            case ResourceType.Instructional: break;

          }
          return (<li key={index}>Resource not found</li>)
        }
  
  const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({
    title,
    content,
    isOpen = false,
    onToggle,
  }) => {
    const [isExpanded, setIsExpanded] = useState(isOpen);
  
    const handleClick = () => {
      setIsExpanded(!isExpanded);
      onToggle?.();
    };
  
    const icon = isExpanded ? faChevronUp : faChevronDown;

    return (
      <div className="expandable-menu-item">
        <button className="menu-title" onClick={handleClick}>
          {title}
          <FontAwesomeIcon icon={icon} className="menu-icon" />
        </button>
        {isExpanded && (
          <div className="menu-content">
              {content.map((item, index) => (
                formatReference(item, index)
              ))}
          </div>
        )}
      </div>
    );
  };
  
  export default ExpandableMenuItem;