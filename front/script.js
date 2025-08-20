const showNodesOnScreen = (nodes, edgesPath) => {
  if (typeof nodes !== "object")
    throw new Error("Nodes were not passed as array");

  const main = document.querySelector("main");

  main.style.position = "relative";
  const nodeDivs = new Map();
  // Pega tamanho do main para limitar as posições
  const mainWidth = main.offsetWidth || 800;
  const mainHeight = main.offsetHeight || 600;
  nodes.forEach((node) => {
    let div = document.createElement("div");
    div.classList.add("node");
    div.innerHTML = node;
    div.style.position = "absolute";
    const nodeW = 60,
      nodeH = 60;
    let x,
      y,
      tries = 0,
      conflict;
    do {
      x = Math.random() * (mainWidth - nodeW);
      y = Math.random() * (mainHeight - nodeH);
      conflict = false;
      for (const otherDiv of nodeDivs.values()) {
        const ox = parseFloat(otherDiv.style.left);
        const oy = parseFloat(otherDiv.style.top);
        // Checa colisão retangular
        if (
          x < ox + nodeW &&
          x + nodeW > ox &&
          y < oy + nodeH &&
          y + nodeH > oy
        ) {
          conflict = true;
          break;
        }
      }
      tries++;
    } while (conflict && tries < 100);
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    main.appendChild(div);
    nodeDivs.set(node, div);
  });

  // Cria o SVG (uma vez só)
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.top = 0;
  svg.style.left = 0;
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  svg.setAttribute("width", main.offsetWidth);
  svg.setAttribute("height", main.offsetHeight);
  main.appendChild(svg);

  // Espera renderizar para pegar as posições reais e desenhar as linhas
  requestAnimationFrame(() => {
    // Limpa linhas antigas
    svg.innerHTML = "";

    const mainRect = main.getBoundingClientRect();

    edgesPath.forEach(([from, to]) => {
      const fromDiv = nodeDivs.get(from);
      const toDiv = nodeDivs.get(to);

      const fromRect = fromDiv.getBoundingClientRect();
      const toRect = toDiv.getBoundingClientRect();

      // Posição central de cada nó, relativa ao main
      const fromX = fromRect.left - mainRect.left + fromRect.width / 2;
      const fromY = fromRect.top - mainRect.top + fromRect.height / 2;
      const toX = toRect.left - mainRect.left + toRect.width / 2;
      const toY = toRect.top - mainRect.top + toRect.height / 2;

      // Cria a linha
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
    });
  });
};

const calcNodes = async (path) => {
  const response = await fetch(path);
  const responseJson = await response.json();
  const keys = Object.keys(responseJson);
  const nodeSet = new Set(keys);
  const edges = [];
  const edgesPath = [];

  keys.forEach((key) => {
    edges.push([key, Object.keys(responseJson[key].arestas)]);
    Object.keys(responseJson[key].arestas).forEach((aresta) =>
      nodeSet.add(aresta)
    );
  });

  edges.forEach((edge) => {
    const main = edge[0];
    edge[1].forEach((node) => {
      edgesPath.push([main, node]);
    });
  });
  showNodesOnScreen(nodeSet, edgesPath);
};

calcNodes("../grafo.json");
