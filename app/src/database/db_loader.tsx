import {BJJPosition, BJJPositionType, BJJTransition, BJJTransitionType, Sports} from "./db_node_components"
import { Node, Edge, MarkerType } from "reactflow"
import graph from "./db.json"
import "../app/network/nodestyle.css";
type BJJPositionMap = Map<string, BJJPosition>;

function getNodes() : BJJPositionMap{
    var i = 0;
    const node_map = new Map<string, BJJPosition>();
    (graph.nodes).map((entry) => 
        (
            node_map.set(
                entry.id, 
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
    ));
    return node_map;
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

function createInitialNode(node_map : BJJPositionMap) : Node<BJJPosition>[]{
    var node_list : Node<BJJPosition>[] = []; 
    node_map.forEach((value, key, map) => (
        node_list.push({
            id : value.id_no.toString(),
            position : {x : Math.random()*1000+50, y : Math.random()*1000+50},
            data : value,
            connectable: false,
            type : "custom"
            }
        )
    ));
    return node_list;
}

function createInitialEdge(edge_list : BJJTransition[], node_map : BJJPositionMap) : Edge<BJJTransition>[]{
    var edge_list_rf : Edge<BJJTransition>[] = [];
    edge_list.forEach((value, index, array) => (
        edge_list_rf.push({
            id : value.name || "",
            source : node_map.get((value.from_pos?.label) || "")?.id_no.toString() || "",
            target : node_map.get((value.to_pos?.label) || "")?.id_no.toString() || "",
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

function GraphDB() {
    const nodeMap = getNodes();
    const edgeList = getLinks(nodeMap);
    const initialNodes = createInitialNode(nodeMap);
    const initialEdges = createInitialEdge(edgeList, nodeMap);
  
    return {node_map : nodeMap, edge_list : edgeList, initial_nodes : initialNodes, initial_edges : initialEdges};
}
export default GraphDB;