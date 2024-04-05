import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Infopanel.css';
import { BJJPosition, BJJPositionType, BJJTransition, Sports } from '../../database/db_node_components';
import { Choices } from './infopanel_components';


function formatPositionContent(pos : BJJPosition) : JSX.Element {
  return (
      <>
      <p className="content-title">{pos?.label}</p>
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

interface PanelOverlayProps {
    selection : Choices | undefined,
    data : BJJPosition | BJJTransition | undefined,
    children: React.ReactNode; // Content to be displayed inside the panel
  }




const PanelOverlay: React.FC<PanelOverlayProps> = ({selection, data}) => {

  const overlayRef = useRef<HTMLDivElement>(null);
  const [elem, setElem] = useState<JSX.Element>(<p>No content!</p>)

  const renderPanel = useCallback((
          selection : Choices | undefined,
          data : BJJPosition | BJJTransition | undefined) =>{
        if (data != undefined){
          switch(selection){
            case Choices.BJJPositionSelection:
              setElem(formatPositionContent(data as BJJPosition));
              break;
            }
          }
      },[selection,data])

      useEffect(() => {renderPanel(selection,data);},[renderPanel]);
      

  return (
     ( 
     
     <div
        ref={overlayRef}
        className={`panel-overlay`}
      >
        <div className="panel-content">
            {elem}
        </div>
      </div>)) 

};

export default PanelOverlay;