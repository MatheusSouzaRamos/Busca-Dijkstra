
const drawConnection = (connections, map) => {
    let svg = document.getElementById("connections-svg");
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "connections-svg");
        svg.style.position = "absolute";
        svg.style.top = 0;
        svg.style.left = 0;
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.zIndex = 0;
        document.querySelector("main").appendChild(svg);
    } else {
        svg.innerHTML = "";
    }

    connections.forEach(([from, to]) => {
        const fromDiv = nodeDivs.get(from);
        const toDiv = nodeDivs.get(to);
        if (!fromDiv || !toDiv) return;

    })

    
}

const showNodesOnScreen = (nodes, edgesPath) => {
    if(typeof nodes !== "object")
        throw new Error("Nodes were not passed as array");

    const main = document.querySelector("main");
    const nodeList = [];
    const nodePositions = new Map();
    nodes.forEach(node => {
        const div = document.createElement("div");
        div.classList.add("node");
        div.innerHTML = node;
        main.appendChild(div);
        nodeList.push(node);
        nodePositions.set(node, div.getBoundingClientRect());
    })

    drawConnection(edgesPath, nodePositions);

    return nodeList; 
}


const calcNodes = async (nodes) => {
    if(typeof nodes !== "object")
        throw new Error("No node list");

    const response = await fetch("../grafo2.json");
    const responseJson = await response.json();
    const keys = Object.keys(responseJson);
    const nodeSet = new Set(keys);
    const edges = [];
    keys.forEach(key => {
        edges.push([key, Object.keys(responseJson[key].arestas)]);
        Object.keys(responseJson[key].arestas).forEach(aresta => nodeSet.add(aresta));
})

    const edgesPath = [];


    edges.forEach(edge => {
        const main = edge[0];   
        edge[1].forEach(node => {
                edgesPath.push([main, node])
        })
    })

const nodeList = showNodesOnScreen(nodeSet, edgesPath);

}

calcNodes([1,2,3]);