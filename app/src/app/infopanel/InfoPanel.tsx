import React, { useState, useRef, useEffect } from 'react';
import './Infopanel.css';
import { BJJPosition, BJJPositionType, Sports } from '../../database/db_node_components';

interface PanelOverlayProps {
    isOpen?: boolean;          // Optional prop to control panel visibility (defaults to false)
    onClose?: () => void;      // Callback function to be triggered when the panel is closed
    pos : BJJPosition | undefined;
    children: React.ReactNode; // Content to be displayed inside the panel
  }


function formatPositionContent(pos : BJJPosition) : JSX.Element {
    return (
        <>
        <p className="content-title">{pos?.name}</p>
        <p className='content-subtext'>{pos?.description}</p>
        <p className='content-subtext'>
            <strong>Also known as:</strong> {pos?.aliases.join(", ")}</p>

        <p className='content-subtext'>
            <strong>Position type:</strong> {pos?.pos_type}</p>

        <p className='content-subtext'>
            { (pos)  
             ? <><strong>Valid in: </strong> {pos.valid_in_sports.join(", ")}</> 
             : <>Not valid in any sport</>}
            {pos?.valid_in_sports}</p>
        

        
        <p className='content-subtext'>
            <strong>Variations: </strong> To be implemented</p>
       
        <p className='content-references-title'>References</p>
        <p className='content-subtext'>To be implemented</p>
        <p>{pos?.reference.map((ref)=>ref.resource_name)}</p>
       
        <p>{pos?.reference.map((ref)=>ref.resource_name)}</p>
        <p className='content-subtext'>{pos.comments}</p>
        </>
    );
}

const PanelOverlay: React.FC<PanelOverlayProps> = ({
  isOpen = false,
  onClose,
  pos
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.(); // Call the provided onClose callback if it exists
  };

  const handleClickOutside :  (event: MouseEvent) => void = (event: MouseEvent) => {
    if (event.currentTarget === overlayRef.current) {
        handleClose();
      }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Remove on cleanup
    };
  }, []); // Empty dependency array to run only once

  return (
    ( isVisible ?  ((pos || null) &&
     ( 
     
     <div
        ref={overlayRef}
        className={`panel-overlay ${isVisible ? 'open' : ''}`}
      >
        <div className="panel-content">
            {(pos && formatPositionContent(pos)) || <p>No content found!</p>}
            <button className="panel-close" onClick={handleClose}>
                <span aria-label="Close Panel">&#x2716;</span>
            </button>
        </div>
      </div>))  : null
    )
  );
};

export default PanelOverlay;