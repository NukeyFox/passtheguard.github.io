import { Edge, Node} from "reactflow";
import { BJJPosition,  BJJTransition } from "../../database/db_node_components";
import { AdjacencyMap } from "../../database/db_loader";

export type Path = (Node<BJJPosition> | Edge<BJJTransition>)[]
export type PathGenerator = Generator<Path> 

function backtrack(
    targetNode : Node<BJJPosition>,
    adj_map : AdjacencyMap, 
    backtrack_map : Map<Node<BJJPosition>, Node<BJJPosition>>
) : Path {
    var path : Path = [];
    var prev_node = undefined;
    var curr_node : Node<BJJPosition> | undefined = targetNode;

    while (curr_node !== undefined){
        if (prev_node !== undefined) {
            var edge = adj_map.get(prev_node)?.get(curr_node)
            if (edge !== undefined) {
                var random_edge = Math.floor(Math.random() * edge.length)
                path.push(edge[random_edge]);}
        };
        path.push(curr_node);
        prev_node = curr_node;
        curr_node = backtrack_map.get(curr_node);
    }
    //if (prev_node !== undefined) path.push(prev_node);
    return path;

}

export function* DepthFirst(
    sourceNode : Node<BJJPosition> | undefined, 
    targetNode : Node<BJJPosition> | undefined, 
    adj_map : AdjacencyMap) 
:  PathGenerator 
{
    if (sourceNode === undefined || targetNode === undefined) return;
    var stack = [];
    var visited = new Set<Node<BJJPosition>>();
    const backtrack_map = new Map<Node<BJJPosition>,Node<BJJPosition>>();
    stack.push(sourceNode);
    visited.add(sourceNode);

    while (stack.length > 0){
        var node = stack.pop();
        
        if (node === undefined) {continue;}
        else {
            if (node === targetNode) {
                yield backtrack(targetNode, adj_map, backtrack_map);
            } else {
                const neighbours = adj_map.get(node);
                if (neighbours !== undefined)
                for (var [key] of neighbours){
                    if (!visited.has(key)){
                        visited.add(key);
                        stack.push(key);
                        backtrack_map.set(key,node as Node<BJJPosition>);
                    }
                }
            }

        }
    }

}

