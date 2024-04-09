import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Infopanel.css';
import { BJJPosition, BJJPositionType, BJJTransition, Sports } from '../../database/db_node_components';
import { Choices } from './infopanel_components';
import ReferencePanel from './ReferencePanel';


function formatPositionContent(pos : BJJPosition, handleClose : ()=>void) : JSX.Element {
  return (
      <>
        <div className="content-title">{pos?.label}</div>

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
     
      <ReferencePanel title='References' content={["ITem1", "Item2", "Item3","Item45","Item80","Itemutem","Itere","ertkejrjkerkjelrhtkjehkjhelrhtlerh","vageu tweet", "hello there!","halfguard"]}/>
      <p className='content-subtext'>{pos.comments}</p>
      </>
  );
}

function formatEdgeContent(pos : BJJTransition, handleClose : () => void) : JSX.Element {
  return (
      <>

        <div className="content-title">{pos?.name}</div>
      <p className='content-subtext' style={{textAlign:"center"}}> {pos?.from_pos?.label} → {pos?.to_pos?.label} </p>
      <p className='content-subtext'>{pos?.description}</p>
      <p className='content-subtext'>
          <strong>Also known as:</strong> {pos?.aliases.join(", ")}</p>

      <p className='content-subtext'>
          <strong>Transition type:</strong> {pos?.trans_type}</p>

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

function mainPanel() {
  return (
    <>
      <p> Search: </p>
      <p> Find Sequence: </p>
    </>
  )
}

interface PanelOverlayProps {
    selection : Choices | undefined,
    data : BJJPosition | BJJTransition | undefined,
    nullFunc : () => void,
    children: React.ReactNode; // Content to be displayed inside the panel
  }




const PanelOverlay: React.FC<PanelOverlayProps> = ({selection, data, nullFunc}) => {

  const overlayRef = useRef<HTMLDivElement>(null);
  const [elem, setElem] = useState<JSX.Element>(mainPanel())

  const renderPanel = useCallback((
          selection : Choices | undefined,
          data : BJJPosition | BJJTransition | undefined) =>{
        if (data !== undefined){
          switch(selection){
            case Choices.BJJPositionSelection:
              {
              setElem(formatPositionContent(data as BJJPosition, nullFunc));
              break;
            }
            case Choices.BJJTransitionSelection:
              {
                setElem(formatEdgeContent(data as BJJTransition, nullFunc));
                break;
              }
            default:
              {
                setElem(mainPanel())
              }
            }
          }
      },[])

      useEffect(() => {renderPanel(selection,data);},[renderPanel, data, selection]);
      

  return (
     ( 
     
     <div
        ref={overlayRef}
        className={`panel-overlay`}
      >
        <div className="panel-content">
        {selection != Choices.None && <button className="close-button" onClick={nullFunc}>
            <span>&#10006;</span> {/* Unicode character for "X" */}
        </button>}
          {elem}
        </div>
      </div>)) 

};

export default PanelOverlay;