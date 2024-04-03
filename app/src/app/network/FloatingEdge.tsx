import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getNodesBounds,
  getSmoothStepPath,
  getStraightPath,
  useNodeId,
  useReactFlow,
} from 'reactflow';

import './buttonedge.css';
import { getEdgeParams, ownBezierPath } from './utils';


export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  
  style = {},
  markerEnd,
  label,
  data
}: EdgeProps) {
  const { setEdges, getNode } = useReactFlow();

  const sourceNode = getNode(source) ;
  const targetNode = getNode(target) ;

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode) ;
  
  const offset_width = 500;
  const offset_pos = offset_width * (data.edge_no+1) / (data.parallel_edges+1) - offset_width/2;

  const [edgePath, labelX, labelY] = ownBezierPath({
      sourceX : sx || sourceX,
      sourceY : sy || sourceY,
      //sourcePosition : sourcePos || sourcePosition,
      targetX :tx || targetX,
      targetY : ty || targetY,
      //targetPosition : targetPos || targetPosition,
      controlX : ((sx || sourceX) + (tx || targetX))/2 + offset_pos,
      controlY : ((sy || sourceY) + (ty || targetY))/2 + offset_pos
    });

  const onEdgeClick = () => {
    //Make it so that clicking the edge  label opens up the panel 
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            pointerEvents: 'all',
            background: '#bad0de',
            padding: 5,
            borderRadius: 2,
            fontWeight: 500,
            color : "#000000"
          }}
          className="nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
