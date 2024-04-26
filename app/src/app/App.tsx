import React, {useState, useCallback, useMemo, useEffect} from 'react';
import './App.css';
import ReactFlow, { Node as RFNode, Edge, useNodesState, useEdgesState, useReactFlow, MarkerType, useStore, ReactFlowProvider } from 'reactflow'
import GraphDB from "../database/db_loader";
import PanelOverlay from "./infopanel/InfoPanel"
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import collide from './collide';
import 'reactflow/dist/style.css';
import FloatingEdge from './network/FloatingEdge';
import CustomNode from './network/CustomNode';
import SelectedNode from "./network/SelectedNode"
import { BJJPosition,  BJJTransition } from '../database/db_node_components';
import { Path } from "./functions/depthfirst";


interface SimNode extends SimulationNodeDatum{
  data : RFNode<BJJPosition>
}
const edgeTypes = {
  floating: FloatingEdge,
};
const nodeTypes = {
  custom: CustomNode,
  selected : SelectedNode
};


function App() {
 

  const data = useMemo(() => GraphDB(),[]);

 
  const [nodes, setNodes, onNodesChange] = useNodesState<BJJPosition>(data.initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BJJTransition>(data.initial_edges);

  const [selectedElem, setselectedElem] = useState<RFNode<BJJPosition>|Edge<BJJTransition>|undefined>(undefined);


  const resetNodesEdges = (useCallback(() => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => 
        ({ ...n, type : 'custom' })));
    setEdges((prevEdge) =>
      prevEdge.map((e) => 
        ({ ...e, markerEnd : { type : MarkerType.ArrowClosed, color : "white"}, style : {...e.style,color : undefined,  zIndex : 100, stroke : "white", opacity:0.7}})));
  },[setEdges, setNodes]));

  const highlightNode = (useCallback((node : RFNode<BJJPosition>) => (
      setNodes((prevNodes) =>
        prevNodes.map((n) => 
          (n.id === node.id) ? { ...n, type : 'selected' } : n))
  ),[setNodes]));

  const highlightEdge = (useCallback((edge : Edge<BJJTransition>) => (
    setEdges((prevNodes) =>
      prevNodes.map((e) => 
        (edge.id === e.id ? { ...e, markerEnd : { type : MarkerType.ArrowClosed, color : "red"} ,style : {...e.style, color : "#ffa6a6", zIndex: 200, stroke : "red", opacity:1}} : e)))
),[setEdges]));

const onNodeClick = useCallback((event: React.MouseEvent<Element>, node: RFNode<BJJPosition>) => {
  setselectedElem(node); }, []);

  const highlightPath = (path : Path) => {
    resetNodesEdges();
    for (var elem of path){
      if (elem.data !== undefined) {
          if (elem.data.type === "BJJPosition"){
          highlightNode(elem as RFNode<BJJPosition>);
        } else {
          highlightEdge(elem as Edge<BJJTransition>);
        }
    }
    }
  };

  const highlightOnSelected = useCallback((selectedElem: RFNode<BJJPosition>|Edge<BJJTransition>|undefined) => {
    if (selectedElem === undefined) {resetNodesEdges(); return};
    if (selectedElem.data !== undefined){
        if (selectedElem.data.type === "BJJPosition"){
          resetNodesEdges(); 
          highlightNode(selectedElem as RFNode<BJJPosition>);
        }
        else {resetNodesEdges(); highlightEdge(selectedElem as Edge<BJJTransition>)}
    }
  },[highlightEdge, highlightNode, resetNodesEdges])


  const onEdgeClick = useCallback((event: React.MouseEvent<Element>, edge: Edge<BJJTransition>) => {setselectedElem(edge); }, []);

  const simulation = forceSimulation()
      .force('charge', forceManyBody().strength(-2000))
      .force('x', forceX().x(0).strength(0.1))
      .force('y', forceY().y(0).strength(0.1))
      .force('collide', collide())
      .alphaTarget(0.05)
      .stop();

  const useLayoutedElements = () => {
        const { getNodes, setNodes, getEdges, fitView } = useReactFlow<BJJPosition, BJJTransition>();
        const initialised = useStore((store) =>
          [...store.nodeInternals.values()].every((node) => node.width && node.height)
        );
  
    return useMemo(() => {
      let nodes : SimNode[] = getNodes().map((node,i) => ({ index : parseInt(node.id), x: node.position.x, y: node.position.y, data : node}));
      let edges : SimulationLinkDatum<SimNode>[] = getEdges().map((edge) => ({source : parseInt(edge.source), target : parseInt(edge.target)}));
      
      //let edgeCenters = getEdges().map((edge,i) => {index : parseInt()}
  
      simulation.nodes(nodes).force(
        'link',
        forceLink(edges)
          .id((d) => d.index || 0)
          .strength(1)
          .distance(200)
      );
  
      // The tick function is called every animation frame while the simulation is
      // running and progresses the simulation one step forward each time.
      const tick = () => {
    
        simulation.tick();
        setNodes(nodes.map((node) => ({ ...node.data, position: { x: node.x || node.data.position.x, y: node.y || node.data.position.y} })));
        window.requestAnimationFrame(() => {
        fitView();
        if (simulation.alpha() < 0.5) simulation.stop();
        else tick();
        
        });
      };
      
     
      window.requestAnimationFrame(tick);

      simulation.stop()
      return initialised;
    }, [fitView, getEdges, getNodes, initialised, setNodes]);
  };

 // useEffect(highlightNode, [highlightNode, selectedElem]);
  useLayoutedElements();
  //const onConnect = useCallback((params : Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  useEffect(() => highlightOnSelected(selectedElem), [highlightOnSelected, selectedElem])

  return (
    <div className="App">
        <div style={{ width: "70vw", height: "100vh"}}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              edgeTypes={edgeTypes}
              nodeTypes={nodeTypes}
              style={{backgroundColor:"#3c4052"}}
            />
          </div>
       {<PanelOverlay 
                      elem={selectedElem}
                      selectionCallback={setselectedElem}
                      pathHighlight={highlightPath}
                      nullFunc={() => {setselectedElem(undefined); resetNodesEdges();}}>children 
        </PanelOverlay>}
        </div>

  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
