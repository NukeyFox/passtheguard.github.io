import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlow,
} from 'reactflow';

import { getEdgeParams, ownBezierPath } from './utils';
import { BJJPosition, BJJTransition } from '../../database/db_node_components';


export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  style ,
  markerEnd,
  label,
  data
}: EdgeProps<BJJTransition>) {
  const { getNode } = useReactFlow<BJJPosition>();

  const sourceNode = getNode(source) ;
  const targetNode = getNode(target) ;
  
  const control_width = 500 ;
  const offset_percent = ((data?.edge_no || 0)+1 ) / ((data?.parallel_edges || 0)+1) - 1/2;
  const control_pos =  control_width * offset_percent; 
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode, offset_percent) ;


  const [edgePath, labelX, labelY] = ownBezierPath({
      selfLoop : sourceNode === targetNode,
      sourceX : sx || sourceX ,
      sourceY : sy || sourceY,
      sourcePosition : sourcePos || sourcePosition,
      targetX : tx || targetX,
      targetY : ty || targetY,
      targetPosition : targetPos || targetPosition,
      controlX :  control_pos,
      controlY :  control_pos
    });


  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style}  />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            pointerEvents: 'all',
            background: style?.color ||'#bad0de',
            padding: 5,
            borderRadius: 2,
            fontWeight: 500,
            color : "#000000",
            zIndex : style?.zIndex
          }}
          className="nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
