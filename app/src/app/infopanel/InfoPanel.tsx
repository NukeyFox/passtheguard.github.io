import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Infopanel.css';
import { BJJPosition, BJJPositionType, BJJTransition, BJJTransitionType, Sports } from '../../database/db_node_components';
import { Choices } from './infopanel_components';
import ReferencePanel from './ReferencePanel';
import SequenceSearch from './SequenceSearch';
import { Path } from '../functions/depthfirst';


function formatPositionContent(pos : BJJPosition) : JSX.Element {
  return (
      <>
        <div className="content-title">{pos?.label}</div>

      <p className='content-subtext'>{pos?.description}</p>
      <p className='content-subtext'>
          <strong>Also known as:</strong> {pos?.aliases.join(", ")}</p>

      <p className='content-subtext'>
          <strong>Position type:</strong> {BJJPositionType[pos?.pos_type] as string}</p>

      <p className='content-subtext'>
          { (pos)  
           ? <><strong>Valid in: </strong> {pos.valid_in_sports.join(", ")}</> 
           : <>Not valid in any sport</>}
          {pos?.valid_in_sports}</p>
      

      
      <p className='content-subtext'>
          <strong>Variations: </strong>  {pos.variations}</p>
     
      <ReferencePanel title='References' content={pos?.reference}/>
      <p className='content-subtext'>{pos.comments}</p>
      </>
  );
}

function formatEdgeContent(pos : BJJTransition) : JSX.Element {
  return (
      <>

        <div className="content-title">{pos?.name}</div>
      <p className='content-subtext' style={{textAlign:"center"}}> {pos?.from_pos?.data.label} → {pos?.to_pos?.data.label} </p>
      <p className='content-subtext'>{pos?.description}</p>
      <p className='content-subtext'>
          <strong>Also known as:</strong> {pos?.aliases.join(", ")}</p>

      <p className='content-subtext'>
          <strong>Move Type:</strong> {BJJTransitionType[pos?.trans_type] as string}</p>

      <p className='content-subtext'>
          { (pos)  
           ? <><strong>Valid in: </strong> {pos.valid_in_sports.join(", ")}</> 
           : <>Not valid in any sport</>}
          {pos?.valid_in_sports}</p>
      

      
      <p className='content-subtext'>
          <strong>Variations: </strong> {pos.variations}</p>
     
      <ReferencePanel title='References' content={pos?.reference}/>
      <p className='content-subtext'>{pos.comments}</p>
      </>
  );
}

function mainPanel(pathHighlight : (path : Path) => void) {
  return (
    <div className='panel-main'>
      <p> Search: </p>
      <SequenceSearch pathHighlight = {pathHighlight}></SequenceSearch>
    </div>
  )
}

interface PanelOverlayProps {
    selection : Choices | undefined,
    data : BJJPosition | BJJTransition | undefined,
    nullFunc : () => void,
    pathHighlight : (path : Path) => void,
    children: React.ReactNode; // Content to be displayed inside the panel
  }




const PanelOverlay: React.FC<PanelOverlayProps> = ({selection, data, nullFunc, pathHighlight}) => {

  const overlayRef = useRef<HTMLDivElement>(null);
  const [elem, setElem] = useState<JSX.Element>(mainPanel(pathHighlight))

  const renderPanel = useCallback((
          selection : Choices | undefined,
          data : BJJPosition | BJJTransition | undefined) =>{
        if (data !== undefined){
          switch(selection){
            case Choices.BJJPositionSelection:
              {
              setElem(formatPositionContent(data as BJJPosition));
              break;
            }
            case Choices.BJJTransitionSelection:
              {
                setElem(formatEdgeContent(data as BJJTransition));
                break;
              }
            default:
              {
                setElem(mainPanel(pathHighlight))
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
        {selection !== Choices.None && <button className="close-button" onClick={nullFunc}>
            <span>&#10006;</span> {/* Unicode character for "X" */}
        </button>}
          {elem}
        </div>
      </div>)) 

};

export default PanelOverlay;