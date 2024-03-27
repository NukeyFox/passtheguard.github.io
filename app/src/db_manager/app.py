import json
import networkx as nx
import streamlit as st
import matplotlib.pyplot as plt
from graph_functions import GraphManager

graph = GraphManager("app/database/db.json")
graph.add_node("test node", attr={"Variable":"value"})

fig, ax = plt.subplots()
pos = nx.kamada_kawai_layout(graph)
nx.draw(graph,pos, with_labels=True)
st.pyplot(fig)
st.balloons()

if __name__ == "__main__":
    g = GraphManager("./app/database/db.json")
    g.add_node("half guard",attr={"Description":"on leg in"})
    g.add_node("mount",attr={"Description":"sit no hips"})
    g.add_edge("half guard", "mount", attr={"name" : "knee slide pass"})
    g.add_edge("mount", "half guard", attr={"name" : "elbow escape"})
    g.save_graph()