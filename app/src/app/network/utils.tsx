import { Node, Position} from 'reactflow'

export function getNodeIntersection(node1 : Node, node2 : Node, offset_percent : number) {

    const w = (node1.width || 0) / 2;
    const h = (node1.height || 0) / 2;

    const x2 = node1.position.x + w ;
    const y2 = node1.position.y + h ;
    const x1 = node2.position.x + (node2.width  || 0) / 2 + offset_percent*w;
    const y1 = node2.position.y + (node2.height || 0) / 2 + offset_percent*h;
  
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

  export function getEdgeParams(source : Node | undefined, target : Node | undefined, offset_percent : number) {


    if (source === undefined || target === undefined)  { 
      return {
        sx: null,
        sy: null,
        tx: null,
        ty: null,
        sourcePos : null,
        targetPos : null,
      };}

      if (source.id === target.id){
        const h = source.position.y + (source.height || 42)/2;//*offset_percent;
        return {
          sx: source.position.x + (source.width  || 100),
          sy: h,
          tx: target.position.x + (source.width  || 100),
          ty: h,
          sourcePos : Position.Right,
          targetPos : Position.Left,
        };

      }

    const sourceIntersectionPoint = getNodeIntersection(source, target, offset_percent);
    const targetIntersectionPoint = getNodeIntersection(target, source, offset_percent);
  
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
  selfLoop : boolean,
  sourceX : number,
  sourceY : number, 
  sourcePosition : Position,
  controlX : number,
  controlY : number,
  targetX : number,
  targetY : number,
  targetPosition : Position
}


export function ownBezierPath(
    {
    selfLoop,  
    sourceX,
    sourceY,
    sourcePosition,
    controlX, 
    controlY,
    targetX, 
    targetY,
    targetPosition} : ownBezierPathParams 
) : [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] {
 
  const t = 0.5; 
  if  (selfLoop){
    const offset = 1.2;
    const c1 = sourceX + (controlX * offset);
    const c2 = sourceY + (controlY * offset );
    const c3 = targetX - (controlX * offset);
    const c4 = targetY + (controlY * offset);
    const path =  `M ${sourceX},${sourceY} C ${c1},${c2} ${c3},${c4} ${targetX},${targetY} Z`;

  
    const x1 = (1 - t) * sourceX + t * c1;
    const y1 = (1 - t) * sourceY + t * c2;

    const x2 = (1 - t) * c1 + t * c3;
    const y2 = (1 - t) * c2 + t * c4;

    const x3 = (1 - t) * x1 + t * x2;
    const y3 = (1 - t) * y1 + t * y2;

    const x4 = (1 - t) * c3 + t * targetX ;
    const y4 = (1 - t) * c4 + t * targetY;

    const midX = (1 - t) * x3 + t * x4;
    const midY = (1 - t) * y3 + t * y4;

    return [path,midX,midY,Math.abs(sourceX - midX),Math.abs(sourceY - midY)];} 
  else {
    const c1 = (sourceX + targetX)/2 + controlX;
    const c2 = (sourceY + targetY)/2 - controlY;
    const path =  `M ${sourceX},${sourceY} Q ${c1},${c2} ${targetX},${targetY}`

    const x1 = (1 - t) * sourceX + t * c1;
    const y1 = (1 - t) * sourceY + t * c2;

    const x2 = (1 - t) * c1 + t * targetX;
    const y2 = (1 - t) * c2 + t * targetY;

    const midX = (1 - t) * x1 + t * x2;
    const midY = (1 - t) * y1 + t * y2;


    return [path,midX,midY,Math.abs(sourceX - midX),Math.abs(sourceY - midY)];
  } 
  
}
