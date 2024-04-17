import { Edge, Node} from "reactflow";
import { BJJPosition,  BJJTransition } from "../../database/db_node_components";
import { AdjacencyMap } from "../../database/db_loader";

export type Path = (Node<BJJPosition> | Edge<BJJTransition>)[]
export type PathGenerator = Generator<Path> 

export function* RecDepthFirst(
    sourceNode : Node<BJJPosition> | undefined, 
    targetNode : Node<BJJPosition> | undefined, 
    adj_map : AdjacencyMap,
    visited : Set<Node<BJJPosition>>) 
:  PathGenerator {
    if (sourceNode === undefined || targetNode === undefined) {console.log('undefined source or target'); return [];};
    visited.add(sourceNode);
    if (sourceNode == targetNode) {yield [sourceNode];}

    const nextEdges = adj_map.get(sourceNode);
    if (nextEdges === undefined) {console.log('source node not found'); return [];}

    for (var [nextNode, edges] of nextEdges){
        if (!visited.has(nextNode)){
            const nextGen = RecDepthFirst(nextNode, targetNode, adj_map, visited);
            for (var subpath of nextGen){
                for (var edge of edges){
                    yield subpath.concat([edge,sourceNode]);
                }
            }
        }
    };
}