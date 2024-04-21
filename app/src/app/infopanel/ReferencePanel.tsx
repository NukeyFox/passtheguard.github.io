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
                  <li key={index} className="youtube-content">
                    <span>(Video) {reference.resource_name}</span>
                <LiteYouTubeEmbed 
                  id={reference.resource}
                  title={reference.resource_name || "Youtube reference"}
                  playerClass="youtube-content"
                  /></li>
                 )}
            case ResourceType.Article:{
                 return (
                    <li key={index} className="article-content">
                        <a href={reference.resource} target="_blank" rel="noopener noreferrer">(Article) {reference.resource_name}</a>
                    </li>
                 )}
            case ResourceType.Image: {
                 return (
                    <li key = {index} className="image-content">
                      <span>{reference.resource_name}</span>
                      <img src= {reference.resource} alt={reference.resource_name || undefined} className="image-content"/>
                    </li>

                 )}
            case ResourceType.Instructional:  {
              return (
              <li key={index} className="article-content">
                  <a href={reference.resource} target="_blank" rel="noopener noreferrer">(Instructional) {reference.resource_name}</a>
              </li>
           )}

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