import {BJJPosition, BJJPositionType, BJJTransition, BJJTransitionType, Sports} from "./db_node_components"
import { Node, Edge, MarkerType } from "reactflow"
import graph from "./db.json"
import "../app/network/nodestyle.css";
import { create } from "domain";
type BJJPositionMap = Map<string, Node<BJJPosition>>;
export type AdjacencyMap = Map<Node<BJJPosition>, Map<Node<BJJPosition>, Edge<BJJTransition>[]>>;

function getNodes() : BJJPosition[]{
    var i = 0;
    const nodes = (graph.nodes).map((entry) => 
        (
                {
                    id_no : i++,
                    label : entry.id,
                    aliases : entry.attr?.aliases || [],
                    description : entry.attr?.description || "",
                    pos_type : BJJPositionType[entry.attr.pos_type as keyof typeof BJJPositionType],
                    variations : entry.attr.variations,
                    valid_in_sports : entry.attr?.valid_in_sports.map((sport) => Sports[sport as keyof typeof Sports]),
                    reference : [],
                    comments :  entry.attr.comments}
                )
    );
    return nodes;
}

function getLinks(node_map : BJJPositionMap ) : BJJTransition[]{
    let links : BJJTransition[] = (graph.links).map((entry) => ({
        name : entry.id, 
        from_pos : node_map.get(entry.source), 
        to_pos : node_map.get(entry.target),
        description : entry.attr.description,
        trans_type : BJJTransitionType.Takedown,
        variations : entry.attr.variations,
        aliases : entry.attr.reference,
        valid_in_sports : [],
        reference : [],
        diagram : null,
        comments : null,
        parallel_edges : entry.attr.parallel_edges,
        edge_no : entry.attr.edge_no
        }
    ));

    return  links;
}

function createInitialNode(node_map : BJJPosition[]) : [BJJPositionMap, Node<BJJPosition>[]]{
    var map : BJJPositionMap = new Map<string, Node<BJJPosition>>();
    var list : Node<BJJPosition>[] = [];
    node_map.forEach((value, index, arr) => {
        const node =  {
            id : value.id_no.toString(),
            position : {x : Math.random()*1000+50, y : Math.random()*1000+50},
            data : value,
            connectable: false,
            type : "custom"
        };
        map.set(value.label, node);
        list.push(node);
    }
    );
    return [map,list];
}

function createInitialEdge(edge_list : BJJTransition[], node_map : BJJPositionMap) : Edge<BJJTransition>[]{
    var edge_list_rf : Edge<BJJTransition>[] = [];
    edge_list.forEach((value, index, array) => (
        edge_list_rf.push({
            id : value.name || "",
            source : node_map.get((value.from_pos?.data.label) || "")?.data.id_no.toString() || "",
            target : node_map.get((value.to_pos?.data.label) || "")?.data.id_no.toString() || "",
            label : value.name,
            data : value,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
              },
              type : "floating"
        })
    ));
    
    return  edge_list_rf;
}

function createAdjacencyMap(edge_list : Edge<BJJTransition>[]) : AdjacencyMap {
    const adj_map = new Map<Node<BJJPosition>, Map<Node<BJJPosition>, Edge<BJJTransition>[]>>();
    edge_list.forEach((edge, index, arr) => {
        if( (edge.data !== undefined) && (edge.data.from_pos !== undefined)){
            const src = edge.data.from_pos;
            const tgt = edge.data.to_pos;

            if (!adj_map.has(src)){
                const map = new Map<Node<BJJPosition>,Edge<BJJTransition>[]>();
                adj_map.set(src,map);
            }
            
            const tgt_map = adj_map.get(src) as Map<Node<BJJPosition>,Edge<BJJTransition>[]>;
            if (tgt !== undefined) {
                    if (!tgt_map.has(tgt)){
                    const e_list : Edge<BJJTransition>[] = [];
                    tgt_map.set(tgt,e_list);
                }
                const out = tgt_map.get(tgt) as Edge<BJJTransition>[]
                out.push(edge);
            }      
            }
        }
    )

    return adj_map;

}

function GraphDB() {
    const posList = getNodes();
    const [nodeMap, nodeList] = createInitialNode(posList);
    const edgeList = getLinks(nodeMap);
    const initialEdges = createInitialEdge(edgeList, nodeMap);
    const adjMap = createAdjacencyMap(initialEdges);
  
    return {node_map : nodeMap, initial_nodes : nodeList, initial_edges : initialEdges, adjMap : adjMap};
}
export default GraphDB;