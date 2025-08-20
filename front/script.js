// Função para aleatorizar as posições dos nós dentro do main
function randomizeNodePositions(divs, mainWidth, mainHeight) {
  const margin = 50; // margem para não colar na borda
  divs.forEach((div) => {
    const nodeWidth = div.offsetWidth;
    const nodeHeight = div.offsetHeight;
    // Gera posições aleatórias dentro dos limites do main
    const x = Math.random() * (mainWidth - nodeWidth - margin * 2) + margin;
    const y = Math.random() * (mainHeight - nodeHeight - margin * 2) + margin;
    div.style.position = "absolute";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
  });
}

const createsvg = ({main}) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("svg");

    svg.setAttribute("width", main.offsetWidth);
    svg.setAttribute("height", main.offsetHeight);

    main.appendChild(svg);
    return svg;
}

const createNodesDiv = ({main, nodes}) => {
    const divs = new Map();
    nodes.forEach((node) => {
        let div = document.createElement("div");
        div.classList.add("node");
        div.innerHTML = node;
        main.appendChild(div);
        divs.set(node, div);
    });
    return divs;
}

const createLine = ({fromX, fromY, toX, toY, svg}) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", fromX);
      line.setAttribute("y1", fromY);
      line.setAttribute("x2", toX);
      line.setAttribute("y2", toY);
      line.setAttribute("stroke", "#333");
      line.setAttribute("stroke-width", "4");
      svg.appendChild(line);
}

const view = ({nodes, edges}) => {
  const main = document.querySelector("main");
  const mainWidth = main.offsetWidth;
  const mainHeight = main.offsetHeight;
  const nodesPositions = new Map();
  const svg = createsvg({main: main});
  const divs = createNodesDiv({main: main, nodes: nodes});
  // Embaralha as posições dos nós no main
    randomizeNodePositions(divs, mainWidth, mainHeight);
  
  const linePaths = [];
    
  requestAnimationFrame(() => {
    edges.forEach((to, from) => {
      to.forEach(node => {
        linePaths.push([from, node]);
      });

      divs.forEach((div, node) => {
        const rect = div.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();
        nodesPositions.set(node, {
          x: rect.left - mainRect.left + rect.width / 2,
          y: rect.top - mainRect.top + rect.height / 2
        });
      });
    });

    linePaths.forEach(([from, to]) => {
      const fromX = nodesPositions.get(from).x;
      const fromY = nodesPositions.get(from).y;
      const toX = nodesPositions.get(to).x;
      const toY = nodesPositions.get(to).y;
      createLine({
        svg: svg,
        fromX: fromX,
        fromY: fromY,
        toX: toX,
        toY: toY
      });
    });
  });
}

const controller = async (path) => {
  const response = await fetch(path); 
  const responseJson = await response.json(); 
  const keys = Object.keys(responseJson); 
  const nodeSet = new Set(keys); 
  const edges = new Map(); 

  keys.forEach((key) => { //itera sobre cada nó principal informado e separa as arestas e os nós únicos
    edges.set(key, Object.keys(responseJson[key].arestas));
    Object.keys(responseJson[key].arestas).forEach((aresta) =>
      nodeSet.add(aresta)
    );
  });

view({nodes: nodeSet, edges: edges});

};

controller("../grafo.json");
