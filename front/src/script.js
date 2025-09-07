import { createSvg, createLine } from "./svg.js";
import {
  fetchDefaultMap,
  fetchPathFinder,
  fetchUserMap,
  fetchDefaultGrafoFile,
} from "./api.js";
import {
  extractUniqueNodes,
  buildNodes,
  appendNodesToMain,
  getNodesPositions,
  randomizePositions,
  highlightPath,
  genHeuristics,
} from "./nodes.js";
import { populateSelectors, getMain } from "./dom.js";

const downloadDefaultMap = async (path) => {
  const response = await fetch(path);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "grafo.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const genPaths = (map) => {
  const paths = new Map();
  Object.entries(map).forEach(([from, value]) => {
    Object.entries(value.arestas).forEach(([to, peso]) => {
      if (!paths.has(from)) paths.set(from, new Map());
      paths.get(from).set(to, peso);
    });
  });
  return paths;
};

const components = {
  radioSim: document.querySelector("#useDefaultMap"),
  radioNao: document.querySelector("#useOtherMap"),
  inputFile: document.querySelector("#otherMap"),
  downloadMap: document.querySelector("#downloadBtn"),
  genMap: document.querySelector("#genBtn"),
  genPath: document.querySelector("#pathBtn"),
  origin: document.querySelector("#origin"),
  destiny: document.querySelector("#destiny"),
  output: document.querySelector("output"),
};

const controller = () => {
  const defaultMapPath = "../src/assets/grafo.json";
  const baseUrl = "https://back-production-c034.up.railway.app/api";
  //const baseUrl = "http://127.0.0.1:8081/api";
  const main = getMain();
  let lineMap = new Map();
  let nodeDivs;
  let nodePositions;

  components.downloadMap.addEventListener("click", () => {
    downloadDefaultMap(defaultMapPath);
  });

  components.genMap.addEventListener("click", async () => {
    let file;
    main.style.display = "flex";
    main.innerHTML = "";
    components.origin.innerHTML = "";
    components.destiny.innerHTML = "";
    components.output.style.display = "none";
    let map;
    if (components.radioSim.checked) {
      map = await fetchDefaultMap(defaultMapPath);
    } else if (components.radioNao.checked) {
      map = await fetchUserMap(components.inputFile);
    }
    if (components.radioSim.checked) {
      file = await fetchDefaultGrafoFile();
    } else if (components.radioNao.checked) {
      file = components.inputFile.files[0];
      if (!file) {
        alert("Selecione um arquivo de grafo.json!");
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file);

    await fetch(baseUrl + "/upload-grafo", {
      method: "POST",
      body: formData,
    });

    const uniqueNodes = extractUniqueNodes(map);
    nodeDivs = buildNodes(uniqueNodes);
    appendNodesToMain(nodeDivs, main);
    populateSelectors(uniqueNodes, components.origin, components.destiny);

    requestAnimationFrame(() => {
      randomizePositions(nodeDivs, main);
      const svg = createSvg();
      const mainRect = main.getBoundingClientRect();
      nodePositions = getNodesPositions(nodeDivs);
      const paths = genPaths(map);
      paths.forEach((path, node) => {
        const mainNode = node;
        path.forEach((_, node) => {
          const from = nodePositions.get(mainNode);
          const to = nodePositions.get(node);
          const line = createLine(from, to, mainRect);
          svg.appendChild(line);
          const key = `${mainNode}-${node}`;
          lineMap.set(key, line);
        });
      });
      main.appendChild(svg);
    });
  });

  components.genPath.addEventListener("click", async () => {
    if (!components.origin.value || !components.destiny.value) return;

    components.output.innerHTML = "";
    components.output.style.display = "none";

    const sla = genHeuristics(nodePositions, components.destiny.value);
    console.log(sla);
    const url =
      baseUrl +
      `?origem=${components.origin.value}&destino=${components.destiny.value}`;
    const result = await fetchPathFinder(url);

    if (result) {
      components.output.style.display = "flex";
      components.output.innerHTML = `${JSON.stringify(result, null, 2)}`;
    }
    if (result && result.caminho) {
      highlightPath(lineMap, result.caminho, nodeDivs);
    }
  });

  components.radioSim.addEventListener("change", () => {
    if (components.radioSim.checked)
      components.inputFile.style.display = "none";
    components.output.style.display = "none";
    main.innerHTML = "";
    components.origin.innerHTML = "";
    components.destiny.innerHTML = "";
    main.style.display = "none";
  });

  components.radioNao.addEventListener("change", () => {
    if (components.radioNao.checked)
      components.inputFile.style.display = "block";
    components.output.style.display = "none";
    main.innerHTML = "";
    components.origin.innerHTML = "";
    components.destiny.innerHTML = "";
    main.style.display = "none";
  });
};

controller();
