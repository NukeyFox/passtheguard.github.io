import { Edge, Node, useEdges } from "reactflow";
import { BJJPosition, BJJPositionType, BJJTransition } from "../../database/db_node_components";
import { AdjacencyMap } from "../../database/db_loader";

export type Path = (Node<BJJPosition> | Edge<BJJTransition>)[]
export type PathGenerator = Generator<(Node<BJJPosition> | Edge<BJJTransition>)[]> 

class Stack<T> {
    private items : T[];
    constructor() {
        this.items = [];}
    push(elem : T) : void {
        this.items.push(elem);
    }
    pop() : T | undefined {
        return this.items.pop()
    }
    peak() : T | undefined {
        return this.items[this.items.length-1];
    }
    empty() : boolean {
        return this.items.length == 0;
    }
    clear() : void {
        this.items = [];
    }
    size() : number{
        return this.items.length-1;
    }
}


function backtrack(
    targetEdge : Edge<BJJTransition>,
    backtrackMap : Map<Edge<BJJTransition>, Edge<BJJTransition>>) : Path {
        const path : Path = [];
        var prev = undefined;
        var bt : Edge<BJJTransition> | undefined = targetEdge;
     
        while (bt !== undefined){
            path.push(bt.data?.to_pos as Node<BJJPosition>);
            path.push(bt);
            prev = bt;
            bt = backtrackMap.get(bt);
        }
        path.push(prev?.data?.from_pos as Node<BJJPosition>)
        return path;
    }

export function* DepthFirst(
    sourceNode : Node<BJJPosition> | undefined, 
    targetNode : Node<BJJPosition> | undefined, 
    adj_map : AdjacencyMap) 
:  PathGenerator {
    if (sourceNode === undefined || targetNode === undefined) {console.log('undefined source or target'); return;};
    if (sourceNode == targetNode) {yield [sourceNode]; return;}

    const visited = new Set<Edge<BJJTransition>>();
    const stack = new Stack<Edge<BJJTransition>>();
    const backtrackMap = new Map<Edge<BJJTransition>, Edge<BJJTransition>>();
    adj_map.get(sourceNode)?.forEach(
        (edges) =>{
            edges.forEach((edge) => {visited.add(edge); stack.push(edge);});
        }
    )


    while(!stack.empty()){
        var curr_edge = stack.pop();
        var curr_node = curr_edge?.data?.to_pos;

        if (curr_edge && curr_node){
            
            if (curr_node == targetNode){
                yield backtrack(curr_edge, backtrackMap);
                continue;
            }
            
            var neighbours = adj_map.get(curr_node);
            neighbours?.forEach((edges, node) => {
                edges.forEach((edge) => {
                    if (!visited.has(edge)){
                        visited.add(edge);
                        stack.push(edge);
                        backtrackMap.set(edge, curr_edge as Edge<BJJTransition>);
                        }
                    });
                }
            
            )
        }
    }

}