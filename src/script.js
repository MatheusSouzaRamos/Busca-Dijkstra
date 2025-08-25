// Função para aleatorizar as posições dos nós dentro do main, evitando sobreposição (hitbox)
function randomizeNodePositions(divs, mainWidth, mainHeight) {
  const margin = 50; // margem para não colar na borda
  const maxTries = 1000;
  const placed = [];

  divs.forEach((div) => {
    const nodeWidth = div.offsetWidth;
    const nodeHeight = div.offsetHeight;
    let tries = 0;
    let x, y, overlap;

    do {
      x = Math.random() * (mainWidth - nodeWidth - margin * 2) + margin;
      y = Math.random() * (mainHeight - nodeHeight - margin * 2) + margin;
      overlap = placed.some(
        (pos) =>
          // Checa colisão de hitbox (retângulo)
          x < pos.x + pos.w &&
          x + nodeWidth > pos.x &&
          y < pos.y + pos.h &&
          y + nodeHeight > pos.y
      );
      tries++;
    } while (overlap && tries < maxTries);

    div.style.position = "absolute";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    placed.push({ x, y, w: nodeWidth, h: nodeHeight });
  });
}

const createsvg = ({ main }) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("svg");

  svg.setAttribute("width", main.offsetWidth);
  svg.setAttribute("height", main.offsetHeight);

  main.appendChild(svg);
  return svg;
};

const createNodesDiv = ({ main, nodes }) => {
  const divs = new Map();
  nodes.forEach((node) => {
    let div = document.createElement("div");
    div.classList.add("node");
    div.innerHTML = node;
    main.appendChild(div);
    divs.set(node, div);
  });
  return divs;
};

const createLine = ({ fromX, fromY, toX, toY, svg }) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromX);
  line.setAttribute("y1", fromY);
  line.setAttribute("x2", toX);
  line.setAttribute("y2", toY);
  line.setAttribute("stroke", "#979797ff");
  line.setAttribute("stroke-width", "4");
  svg.appendChild(line);
  return line;
};

const view = ({ nodes, edges }) => {
  const main = document.querySelector("main");
  const mainWidth = main.offsetWidth;
  const mainHeight = main.offsetHeight;
  const nodesPositions = new Map();
  const svg = createsvg({ main: main });
  const divs = createNodesDiv({ main: main, nodes: nodes });
  randomizeNodePositions(divs, mainWidth, mainHeight);

  requestAnimationFrame(() => {
    edges.forEach((cost, value) => {
      const divFrom = divs.get(value[0]);
      const divTo = divs.get(value[1]);

      const rectFrom = divFrom.getBoundingClientRect();
      const rectTo = divTo.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();

      console.log(nodesPositions.get(value[0]).get(value[1]));

      nodesPositions.set(value, {
        fromX: rectFrom.left - mainRect.left + rectFrom.width / 2,
        fromY: rectFrom.top - mainRect.top + rectFrom.height / 2,
        toX: rectTo.left - mainRect.left + rectTo.width / 2,
        toY: rectTo.top - mainRect.top + rectTo.height / 2,
        cost: cost,
      });
    });

    const lines = new Map();
    nodesPositions.forEach((div, key) => {
      const fromX = div.fromX;
      const fromY = div.fromY;
      const toX = div.toX;
      const toY = div.toY;
      const cost = div.cost;
      const line = createLine({
        svg: svg,
        fromX: fromX,
        fromY: fromY,
        toX: toX,
        toY: toY,
      });
      lines.set(key, line);

      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2 - 8;
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", midX);
      text.setAttribute("y", midY);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "18");
      text.setAttribute("fill", "#ffffffff");
      text.textContent = cost;
      svg.appendChild(text);
    });
  });
};

const extractUniqueNodeMaps = ({ entry, map }) => {
  const mainNode = entry[0];
  map.add(mainNode);
  const edgeNode = Object.keys(entry[1].arestas);
  edgeNode.forEach((node) => {
    map.add(node);
  });
};

const controller = async (path) => {
  const response = await fetch(path);
  const responseJson = await response.json();
  const entries = Object.entries(responseJson);
  const nodeSet = new Set();
  const edgesAndCosts = new Map();

  entries.forEach((entry) => {
    extractUniqueNodeMaps({ entry: entry, map: nodeSet });
    const edges = Object.entries(entry[1].arestas);

    edges.forEach((edge) => {
      edgesAndCosts.set([entry[0], edge[0]], edge[1]);
    });
  });

  const pathLines = view({ nodes: nodeSet, edges: edgesAndCosts });
  setTimeout(() => {}, 100);
};

const downloadModel = () => {
  fetch("../grafo.json")
    .then((response) => response.json())
    .then((grafo) => {
      const conteudo = JSON.stringify(grafo, null, 2);
      const blob = new Blob([conteudo], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grafo.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
};

document.querySelector("#downloadBtn").addEventListener("click", downloadModel);

controller("../grafo2.json");
