import React, {useState, useEffect, useCallback, useMemo} from 'react';
import './App.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState, useReactFlow, useStore, ReactFlowProvider } from 'reactflow'
import GraphDB from "../database/db_loader";
import PanelOverlay from "./infopanel/InfoPanel"
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import collide from './collide';
import 'reactflow/dist/style.css';

interface SimNode extends SimulationNodeDatum{
  data : Node
}

function App() {
  const data = GraphDB();
  const [nodes, setNodes, onNodesChange] = useNodesState(data.initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.initial_edges);

  const [isOpen, setIsOpen] = useState(false);


  const [selectedNode, setSelectedNode] = useState<Node|undefined>(undefined);
  const onNodeClick = useCallback((event: React.MouseEvent<Element>, node: Node) => {
    console.log('Node clicked:', node);
    if (selectedNode === node) setSelectedNode(undefined);
    else setSelectedNode(node);
    // Perform actions based on the clicked node data or id here
  }, [selectedNode]);

  const simulation = forceSimulation()
      .force('charge', forceManyBody().strength(-1000))
      .force('x', forceX().x(0).strength(0.05))
      .force('y', forceY().y(0).strength(0.05))
      .force('collide', collide())
      .alphaTarget(0.05)
      .stop();

  const useLayoutedElements = () => {
        const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
        const initialised = useStore((store) =>
          [...store.nodeInternals.values()].every((node) => node.width && node.height)
        );
  
    return useMemo(() => {
      let nodes : SimNode[] = getNodes().map((node,i) => ({ index : parseInt(node.id), x: node.position.x, y: node.position.y, data : node}));
      let edges : SimulationLinkDatum<SimNode>[] = getEdges().map((edge) => ({source : parseInt(edge.source), target : parseInt(edge.target)}));
    
  
      simulation.nodes(nodes).force(
        'link',
        forceLink(edges)
          .id((d) => d.index || 0)
          .strength(0.05)
          .distance(100)
      );
  
      // The tick function is called every animation frame while the simulation is
      // running and progresses the simulation one step forward each time.
      const tick = () => {
    
        simulation.tick();
        setNodes(nodes.map((node) => ({ ...node.data, position: { x: node.x || 0, y: node.y || 0 } })));
        window.requestAnimationFrame(() => {
        fitView();
        if (simulation.alpha() < 0.1) simulation.stop();
        else tick();
        
        });
      };
  
      window.requestAnimationFrame(tick);
      simulation.stop()
      return initialised;
    }, [fitView, getEdges, getNodes, initialised, setNodes]);
  };

  useLayoutedElements();

  return (
    <div className="App">
      <header className="App-header">
       

        <p style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        />
      </p>
       {selectedNode && <PanelOverlay onClose={() => setSelectedNode(undefined)} pos={data.node_map.get(selectedNode.data.label)}>childre 
        </PanelOverlay>}
      </header>
    </div>

  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}