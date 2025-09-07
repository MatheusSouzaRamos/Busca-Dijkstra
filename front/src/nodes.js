/**
 * @function Extracts all unique nodes from the json file.
 * @param {Object.<string, { arestas: Object.<string, number> }>} map - Graph json
 * @returns {Set<node>} Set with all unique nodes
 */

export const extractUniqueNodes = (map) => {
  const values = Object.values(map);
  const uniqueNodes = new Set(Object.keys(map));

  values.forEach((value) => {
    Object.keys(value.arestas).forEach((aresta) => {
      uniqueNodes.add(aresta);
    });
  });

  return uniqueNodes;
};

/**
 * @function builds all the nodes passed into the html
 * @param {Set<node>} nodeList Set with all unique nodes
 * @returns {Map<node, div>} returns a map with each node's div
 */

export const buildNodes = (nodeList) => {
  if (!nodeList instanceof Set)
    throw new Error("Param not an set of unique nodes, at " + buildNodes.name);
  const nodeMap = new Map();
  nodeList.forEach((node) => {
    const div = document.createElement("div");
    div.classList.add("node");
    div.innerHTML = node;
    nodeMap.set(node, div);
  });
  return nodeMap;
};

/**
 * @function appends Nodes to html element
 * @param {Set<node, div>} nodeMap Map with each node's div
 * @param {HTMLElement} main The element html where the divs will be appended
 */
export const appendNodesToMain = (nodeMap, main) => {
  if (!nodeMap instanceof Map)
    throw new Error("Param not an map of nodes, at " + appendNodesToMain.name);

  nodeMap.forEach((node) => {
    main.appendChild(node);
  });
};

/**
 * @function get the nodes' divs positions in the html
 * @param {Map<node, div>} nodeMap Map with each node's div
 * @returns {Map<node, position>} a Map with each node's position
 */
export const getNodesPositions = (nodeMap) => {
  if (!nodeMap instanceof Map)
    throw new Error("Param not an map of nodes, at " + appendNodesToMain.name);

  const nodePositions = new Map();
  nodeMap.forEach((div, node) => {
    nodePositions.set(node, div.getBoundingClientRect());
  });
  return nodePositions;
};

/**
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number[]} positions
 * @param {Number} nodeSize
 * @param {Number} minMargin
 * @returns
 */
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

/**
 * @function randomizes nodes positions in html element
 * @param {Map<node, div>} nodeMap
 * @param {HTMLElement} main html element
 */
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

/**
 * @function Highlights the path given to it in the html
 * @param {Map<path, line>} lineMap map with each node path line
 * @param {string[]} pathArray array showing Djikstra's path
 * @param {Map<node, div>} divs map of nodes' divs
 * @param {Number} delay delay in microseconds
 */
export const highlightPath = async (lineMap, pathArray, divs, delay = 1500) => {
  divs.forEach((div) => {
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
/**
 *
 * @param {Map<node, position>} nodePositions
 */
export const genHeuristics = (nodePositions, finalNode) => {
  const heuristics = new Map();
  const finalPos = nodePositions.get(finalNode);
  nodePositions.forEach((pos, node) => {
    const x = pos.x;
    const y = pos.y;
    const dx = pos.x - finalPos.x;
    const dy = pos.y - finalPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    heuristics.set(node, distance);
  });
  return heuristics;
};
