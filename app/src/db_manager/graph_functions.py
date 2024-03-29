import json
import os
from typing import Optional
from networkx import MultiDiGraph, draw
from networkx.readwrite import json_graph
import matplotlib.pyplot as plt



class GraphManager(MultiDiGraph):
    def __init__(self, graph_filename : str, **attr):
        """
        Load the graph from file
        """
        self.graph_filename = graph_filename
        if os.path.exists(graph_filename):
            with open(graph_filename, "r") as f:
                js_graph = json.load(f)
            self.graph = json_graph.node_link_graph(js_graph)
        else:
            self.graph = MultiDiGraph()
            g_json = json_graph.node_link_data(self.graph)
            with open(graph_filename,"w+") as f:
                json.dump(g_json,f,indent=2)
        super().__init__(incoming_graph_data=self.graph, **attr)

    def save_graph(self, output_file : Optional[str] = None) -> None:
        output_file = self.graph_filename if output_file is None else output_file
        g_json = json_graph.node_link_data(self)
        with open(output_file,"w") as f:
                json.dump(g_json,f,indent=2)

    def add_node_safe(self, 
                    name : str,
                    aliases : list[str] = [],
                    description : str = "",
                    pos_type : str = "",
                    valid_in_sports : list[str] = [],
                    reference : list[str] = [],
                    diagram = [], 
                    comments : str = ""  ):
        self.add_node(name, 
                      attr= {"aliases" : aliases,
                        "description" : description,
                        "pos_type" : pos_type,
                        "valid_in_sports" : valid_in_sports,
                        "reference" : reference,
                        "diagram" : diagram, 
                        "comments" :comments })
        
    def add_link_safe(self, 
                    name : str,
                    from_pos : str = "",
                    to_pos : str = "",
                    description : str = "",
                    trans_type : str = "",
                    aliases : list[str] = [],
                    valid_in_sports : list[str] = [],
                    reference : list[str] = [],
                    diagram = [], 
                    comments : str = ""  ):
        self.add_edge(u_for_edge= from_pos,
                      v_for_edge=to_pos, 
                      id = name,
                      attr= {
                          "aliases" : aliases,
                        "description" : description,
                        "valid_in_sports" : valid_in_sports,
                        "trans_type" : trans_type,
                        "reference" : reference,
                        "diagram" : diagram, 
                        "comments" :comments })
        
if __name__ == "__main__":
    g = GraphManager("./src/database/db.json")
    g.add_node_safe("closed guard", description="two legs wrapped around")
    g.add_node_safe("half guard", description="one leg looped")
    g.add_node_safe("mount", description="sit on hips")
    g.add_link_safe("knee slide pass", "half guard", "mount", description= "pass your knee over")
    g.add_link_safe("elbow escape (mount)", "mount", "half guard", description= "pass your knee over")
    g.add_link_safe("elbow escape (half guard)", "half guard", "closed guard", description= "pass your knee over")
    g.save_graph()