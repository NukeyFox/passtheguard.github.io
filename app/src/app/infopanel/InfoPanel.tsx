import React, { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import './Infopanel.css';
import { BJJPosition, BJJPositionType, BJJTransition, BJJTransitionType, Players, Sports, SportsToString } from '../../database/db_node_components';
import ReferencePanel from './ReferencePanel';
import SequenceSearch from './SequenceSearch';
import { Path } from '../functions/depthfirst';
import SearchBox from './SearchBox';
import {Node, Edge} from "reactflow"


function formatPositionContent(node : Node<BJJPosition>) : JSX.Element {
  const pos = node.data;
  return (
      <>
        <div className="content-title">{pos?.label}</div>

      <p className='content-subtext'>{pos?.description}</p>
      <p className='content-subtext'>
          <strong>Also known as:</strong> {pos?.aliases.join(", ")}</p>

      <p className='content-subtext'>
          <strong>Position type:</strong> {BJJPositionType[pos?.pos_type] as string}</p>

      <p className='content-subtext'>
          <strong>Valid in: </strong> {pos.valid_in_sports.map(SportsToString).join(", ")}
      </p>
      

      
      <p className='content-subtext'>
          <strong>Variations: </strong>  {pos.variations}</p>
     
      <ReferencePanel title='References' content={pos?.reference}/>
      <p className='content-subtext'>{pos.comments}</p>
      </>
  );
}

function formatEdgeContent(edge : Edge<BJJTransition>) : JSX.Element {
  const pos = edge.data;
  
  if (pos !== undefined)
    return (
        <>

          <div className="content-title">{pos?.name}</div>
        <p className='content-subtext' style={{textAlign:"center"}}> {pos?.from_pos?.data.label} → {pos?.to_pos?.data.label} </p>
        <p className='content-subtext'>{pos?.description}</p>
        <p className='content-subtext'>
            <strong>Also known as:</strong> {pos?.aliases.join(", ")}</p>

        <p className='content-subtext'>
            <strong>Move Type:</strong> {BJJTransitionType[pos.trans_type] as string}</p>

        <p className='content-subtext'>
            <strong>Initiated by:</strong> {Players[pos.initiatedBy] as string}</p>

        <p className='content-subtext'>
            <strong>Valid in: </strong> {pos.valid_in_sports.map(SportsToString).join(", ")}</p>
        

        
        <p className='content-subtext'>
            <strong>Variations: </strong> {pos.variations}</p>
      
        <ReferencePanel title='References' content={pos?.reference}/>
        <p className='content-subtext'>{pos.comments}</p>
        </>
    );
  else {return <>No Move Found!</>}
}

function mainPanel(selectionCallback : any, pathHighlight : (path : Path) => void) {
  return (
    <div className='panel-main'>
      <SearchBox selectionCallback={selectionCallback}></SearchBox>
      <SequenceSearch pathHighlight = {pathHighlight}></SequenceSearch>
    </div>
  )
}

interface PanelOverlayProps {
    elem : Node<BJJPosition> | Edge<BJJTransition> | undefined,
    nullFunc : () => void,
    selectionCallback : Dispatch<SetStateAction<Node<BJJPosition> | Edge<BJJTransition> | undefined>>,
    pathHighlight : (path : Path) => void,
    children: React.ReactNode; // Content to be displayed inside the panel
  }




const PanelOverlay: React.FC<PanelOverlayProps> = ({elem, nullFunc, selectionCallback, pathHighlight}) => {

  const overlayRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<JSX.Element>(mainPanel(selectionCallback, pathHighlight))

  const renderPanel = useCallback((
          elem : Node<BJJPosition> | Edge<BJJTransition> | undefined) =>{
            
          switch(elem?.data?.type){
            case "BJJPosition":
              {
              setPanel(formatPositionContent(elem as Node<BJJPosition>));
              break;
            }
            case "BJJTransition":
              {
                setPanel(formatEdgeContent(elem as Edge<BJJTransition>));
                break;
              }
              default: 
              setPanel(mainPanel(selectionCallback, pathHighlight))
          }
      },[pathHighlight, selectionCallback])

      useEffect(() => {renderPanel(elem);},[renderPanel, elem]);
      

  return (
     ( 
     
     <div
        ref={overlayRef}
        className={`panel-overlay`}
      >
        <div className="panel-content">
        {elem && <button className="close-button" onClick={nullFunc}>
            <span>&#10006;</span> {/* Unicode character for "X" */}
        </button>}
          {panel}
        </div>
      </div>)) 

};

export default PanelOverlay;