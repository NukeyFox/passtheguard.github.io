import json

import networkx as nx

#json.dump(d, open("./graph.json", "w"))

import streamlit as st
x = st.slider("Select a value")
st.write(x, "squared is", x * x)