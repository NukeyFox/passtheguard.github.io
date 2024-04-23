from graph_functions import GRAPH
import csv 
import os
import re

pos_db : str = "app/src/db_manager/position.csv"
move_db : str = "./move.csv"

    
def str_to_list(string : str):
    return string.split("|")

def parse_reference( reference_string : str):
    split_str = reference_string.split("|")
    refs = [split_str[i:i+2] for i in range(0,len(split_str),2)]
    reference_output = []
    image_ext = [".png",".jpg",".jpeg"]
    for [ref,name] in refs:
        ext = os.path.splitext(ref)
        if ext in image_ext:
            reference_output.append({"resource" : ref, "resource_name" : name, "resource_type" : "Image"})
            continue
        if "youtube.com/" in ref or "youtu.be/" in ref:
            basename = re.search(".+\?v=(.+)",ref).group(1)
            reference_output.append({"resource" : basename, "resource_name" : name, "resource_type" : "YoutubeVideo"})
            continue

        reference_output.append({"resource" : ref, "resource_name" : name, "resource_type" : "Article"})
    return reference_output

def add_nodes_to_graph():
        with open(pos_db) as f: 
            reader = csv.reader(f)
            next(reader)
            for name,alias,description,pos_type,variations,valid_in_sports,reference,comments in reader:
                GRAPH.add_node_safe(
                name = name,
                aliases = str_to_list(alias),
                description=description,
                pos_type=pos_type,
                variations=str_to_list(variations),
                valid_in_sports=str_to_list(valid_in_sports),
                references=parse_reference(reference),
                comments=comments
                )  
