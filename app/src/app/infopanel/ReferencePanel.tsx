import { useState } from "react";
import { Reference } from "../../database/db_node_components";
import "./ReferencePanel.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface ExpandableMenuItemProps {
    title: string;
    content: Reference[];
    isOpen?: boolean; // Optional prop for initial open state
    onToggle?: () => void; // Optional callback for toggle events
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
            <ul>
              {content.map((item, index) => (
                <li key={index}>{item.resource}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default ExpandableMenuItem;