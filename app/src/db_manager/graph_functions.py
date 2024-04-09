import json
import os
from typing import Optional, Any
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
            self.graph = MultiDiGraph(json_graph.node_link_graph(js_graph))
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

    def get_parallel_edges(self, source : str, target : str):
        filter_target = lambda tgt : lambda x : x[1] == tgt
        outgoing = filter(filter_target(target), self.edges(source, data=False, keys=True))
        incoming = filter(filter_target(source), self.edges(target, data=False, keys=True))
        return list(outgoing) + list(incoming)

    def add_node_safe(self, 
                    name : str,
                    aliases : list[str] = [],
                    description : str = "",
                    pos_type : str = "",
                    variations : list[str] = [],
                    valid_in_sports : list[str] = [],
                    reference : list[str] = [],
                    diagram = [], 
                    comments : str = ""  ):
        self.add_node(name, 
                      attr= {"aliases" : aliases,
                        "description" : description,
                        "pos_type" : pos_type,
                        "valid_in_sports" : valid_in_sports,
                        "variations" : variations,
                        "reference" : reference,
                        "diagram" : diagram, 
                        "comments" :comments })
        
    def update_link_attr(self, 
                    name : str,
                    from_pos : str, 
                    to_pos : str,
                    updates : dict[str,Any]):
        for key, val in updates.items():
            self[from_pos][to_pos][name]["attr"][key] = val

    def add_link_safe(self, 
                    name : str,
                    from_pos : str = "",
                    to_pos : str = "",
                    description : str = "",
                    trans_type : str = "",
                    variations : list[str] = [],
                    aliases : list[str] = [],
                    valid_in_sports : list[str] = [],
                    reference : list[str] = [],
                    diagram = [], 
                    comments : str = ""  ):
        para_edges = self.get_parallel_edges(from_pos,to_pos)
        if self.has_edge(from_pos,to_pos,name):
            return #Don't do anything if edge exists already
        p = len(para_edges)
        self.add_edge(u_for_edge= from_pos,
                      v_for_edge=to_pos, 
                      id = name,
                      key = name,
                      attr= {
                          "aliases" : aliases,
                        "description" : description,
                        "valid_in_sports" : valid_in_sports,
                        "trans_type" : trans_type,
                        "reference" : reference,
                        "variations" : variations,
                        "diagram" : diagram, 
                        "comments" :comments,
                        "parallel_edges" : p+1,
                        "edge_no" : p})
        for from_pos, to_pos, key in para_edges:
            self.update_link_attr(key,from_pos,to_pos,{"parallel_edges" : p+1})
        
if __name__ == "__main__":
    g = GraphManager("./app/src/database/db.json")
    g.add_node_safe("Closed Guard",
                    aliases=[],
                    description="Ground position. Bottom fighter's legs wrapper around the top fighter's waist.",
                    pos_type="Guard",
                    valid_in_sports=["MMA", "BJJ", "Freestyle Wrestling", "Judo"],
                    comments="Bottom player has control in this position.")
    
    g.add_node_safe("Half Guard", 
                    aliases=["Half Mount", "Turk Ride"],
                    description="Defensive ground position with the bottom fighter's legs looped around a single leg of the top fighter. In BJJ, the bottom fighter wants to sweep, reguard or submit. The top fighter wants to pass the guard.",
                    pos_type="Guard",
                    valid_in_sports=["MMA", "BJJ", "Freestyle Wrestling", "Judo"],
                    comments="Half guard is 50/50 position in BJJ. However, in MMA, it favours the top fighter since they can ground-and-pound.")
    
    g.add_node_safe("Mount", 
                    aliases=[],
                    description="Ground position. Top flghter sits on the hips on the bottom fighter.",
                    pos_type="Pin",
                    valid_in_sports=["MMA", "BJJ", "Freestyle Wrestling", "Judo"],
                    comments="Favours the top fighter")
    
    g.add_link_safe("knee slide pass", "Half Guard", "Mount", description= "pass your knee over")
    g.add_link_safe("elbow knee escape \n(from mount)", "Mount", "Half Guard", description= "pass your knee over")
    g.add_link_safe("elbow knee escape \n(from half guard)", "Half Guard", "Closed Guard", description= "pass your knee over")
    g.add_link_safe("kipping escape", "Mount", "Half Guard", description= "hip hip horray")
    
    g.save_graph()

    print(g.get_parallel_edges("Mount", "Half Guard"))