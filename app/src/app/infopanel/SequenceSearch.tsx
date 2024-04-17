import { useState } from "react";
import Multiselect from 'multiselect-react-dropdown';
import GraphDB from "../../database/db_loader";
import { Path, RecDepthFirst } from "../functions/depthfirst";

function SequenceSearch() {
    const data = GraphDB()
    const nodes = Array.from(data.node_map.keys());
    console.log(nodes);

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const options = nodes.map((val) => ({"name" : val}));
  
    const handleChange = (selectedList : string[], selectedItem : string) => {
     
      setSelectedOptions([...selectedList, selectedItem]);
    };

    const onSearchClick = (()=>{
        var path : Path = [];
        const n = selectedOptions.length;
        console.log(n);
        if (n >= 2){
            for (var i = 0; i < n-1; i++){
                var source = data.node_map.get(selectedOptions[i]);
                var target = data.node_map.get(selectedOptions[i+1]);
                var r = RecDepthFirst(source,target,data.adjMap,new Set());
                const p = r.next();
                path.concat(p.value);
            }
            console.log(path);
        }
    }
        
        
    );
  
    return (
        <div>
        <p>Sequence Search: </p>
        <Multiselect
        options={options} // Options to display in the dropdown
        //selectedValues={selectedOptions} // Preselected value to persist in dropdown
        onSelect={handleChange} // Function will trigger on select event
        //onRemove={} // Function will trigger on remove event
        displayValue="name" // Property name to display in the dropdown options
        />
        <button onClick={onSearchClick}>Search</button>
        </div>
    );

}
export default SequenceSearch;