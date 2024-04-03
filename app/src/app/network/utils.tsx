import ReactFlow, { Node, Edge, useNodesState, useEdgesState, useReactFlow, useStore, ReactFlowProvider, Position } from 'reactflow'

export function getNodeIntersection(node1 : Node, node2 : Node) {

    const w = (node1.width || 0) / 2;
    const h = (node1.height || 0) / 2;
  
    const x2 = node1.position.x + w;
    const y2 = node1.position.y + h;
    const x1 = node2.position.x + (node2.width  || 0) / 2;
    const y1 = node2.position.y + (node2.height || 0) / 2;
  
    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2 ;
    const y = h * (-xx3 + yy3) + y2;
  

    return { x, y };

}

function getEdgePosition(node : Node, intersectionPoint : {x : number, y : number}) {
    const n = { ...node.positionAbsolute, ...node };
    const nx = Math.round(n.position.x);
    const ny = Math.round(n.position.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);
  
    if (px <= nx + 1) {
      return Position.Left;
    }
    if (px >= nx + (n.width || n.position.x) - 1) {
      return Position.Right;
    }
    if (py <= ny + 1) {
      return Position.Top;
    }
    if (py >= ny + (n.height || n.position.y) - 1) {
      return Position.Bottom;
    }
  
    return Position.Top;
  }

  export function getEdgeParams(source : Node | undefined, target : Node | undefined) {
    if (source === undefined || target === undefined)  { 
      return {
        sx: null,
        sy: null,
        tx: null,
        ty: null,
        sourcePos : null,
        targetPos : null,
      };}
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);
  
    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);
  
    return {
      sx: sourceIntersectionPoint.x,
      sy: sourceIntersectionPoint.y,
      tx: targetIntersectionPoint.x,
      ty: targetIntersectionPoint.y,
      sourcePos,
      targetPos,
    };
  }

export interface ownBezierPathParams{
  sourceX : number,
  sourceY : number, 
  controlX : number,
  controlY : number,
  targetX : number,
  targetY : number
}

export function ownBezierPath(
    {sourceX,
    sourceY,
    controlX, 
    controlY,
    targetX, 
    targetY} : ownBezierPathParams 
) : [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] {
  
  // Move to the starting point
  const path = `M${sourceX},${sourceY} Q ${controlX},${controlY} ${targetX},${targetY}`;
  const t = 0.5; // Parameter for midpoint

  const x1 = (1 - t) * sourceX + t * controlX;
  const y1 = (1 - t) * sourceY + t * controlY;

  const x2 = (1 - t) * controlX + t * targetX;
  const y2 = (1 - t) * controlY + t * targetY;

  const midX = (1 - t) * x1 + t * x2;
  const midY = (1 - t) * y1 + t * y2;

  return [path,midX,midY,Math.abs(sourceX - midX),Math.abs(sourceY - midY)];
}