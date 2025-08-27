export const extractUniqueNodes = (map) => {
  if (map == null) return;
  const values = Object.values(map);
  const uniqueNodes = new Set(Object.keys(map));

  values.forEach((value) => {
    Object.keys(value.arestas).forEach((aresta) => {
      uniqueNodes.add(aresta);
    });
  });

  return uniqueNodes;
};

export const buildNodes = (nodeList) => {
  const nodeMap = new Map();
  nodeList.forEach((node) => {
    const div = document.createElement("div");
    div.classList.add("node");
    div.innerHTML = node;
    nodeMap.set(node, div);
  });
  return nodeMap;
};

export const appendNodesToMain = (nodeMap, main) => {
  nodeMap.forEach((node) => {
    main.appendChild(node);
  });
};

export const getNodesPositions = (nodeMap) => {
  const nodePositions = new Map();
  nodeMap.forEach((div, node) => {
    nodePositions.set(node, div.getBoundingClientRect());
  });
  return nodePositions;
};

 const isOverlapping = (x, y, positions, nodeSize, minMargin) => {
  for (const pos of positions) {
    const dx = pos.x - x;
    const dy = pos.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < nodeSize + minMargin) {
      return true;
    }
  }
  return false;
};

export const randomizePositions = (nodeMap, main) => {
  const margin = 40;
  const minMargin = 50;
  const nodeSize = 60;
  const width = main.clientWidth - margin * 2 - nodeSize;
  const height = main.clientHeight - margin * 2 - nodeSize;

  const positions = [];

  nodeMap.forEach((div) => {
    let x,
      y,
      tries = 0,
      maxTries = 1000;
    do {
      x = Math.random() * width + margin;
      y = Math.random() * height + margin;
      tries++;
      if (tries > maxTries) break;
    } while (isOverlapping(x, y, positions, nodeSize, minMargin));
    positions.push({ x, y });
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
  });
};

export const highlightPath = async (lineMap, pathArray, divs, delay = 1500) => {
  divs.forEach(div => {
    div.classList.remove("highlight", "highlight-final", "highlight-start");
  });

  lineMap.forEach((line) => {
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "2");
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    if (divs.has(pathArray[0])) {
    divs.get(pathArray[0]).classList.add("highlight-start");
  }

  for (let i = 0; i < pathArray.length - 1; i++) {
    const from = pathArray[i];
    const to = pathArray[i + 1];
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;

    const line = lineMap.get(key1) || lineMap.get(key2);
    if (line) {
      divs.get(pathArray[i]).classList.add("highlight");
      line.setAttribute("stroke", "yellow");
      line.setAttribute("stroke-width", "8");
      await sleep(delay);
    }
  }

  if (divs.has(pathArray[pathArray.length - 1])) {
  divs.get(pathArray[pathArray.length - 1]).classList.add("highlight-final");
}
};