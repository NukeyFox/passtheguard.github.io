import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState } from 'reactflow'
import GraphDB from "../database/db_loader";
import PanelOverlay from "./infopanel/InfoPanel"

import 'reactflow/dist/style.css';
 



function App() {
  const data = GraphDB();
  const [nodes, setNodes, onNodesChange] = useNodesState(data.initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.initial_edges);

  const [isOpen, setIsOpen] = useState(false);


  const [selectedNode, setSelectedNode] = useState<Node|undefined>(undefined);
  const onNodeClick = useCallback((event: React.MouseEvent<Element>, node: Node) => {
    console.log('Node clicked:', node);
    setSelectedNode(node);
    // Perform actions based on the clicked node data or id here
  }, []);


  return (
    <div className="App">
      <header className="App-header">
       

        <p style={{ width: '100vw', height: '80vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        />
      </p>
       {selectedNode && <PanelOverlay onClose={() => setSelectedNode(undefined)} pos={data.node_map.get(selectedNode.id)}>childre 
        </PanelOverlay>}
      </header>
    </div>

  );
}

export default App;
