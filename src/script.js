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
  const main = getMain();
  let lineMap = new Map();
  let nodeDivs;

  components.downloadMap.addEventListener("click", () => {
    downloadDefaultMap(defaultMapPath);
  });

  components.genPath.addEventListener("click", async () => {
    if (!components.origin.value || !components.destiny.value) return;

    components.output.innerHTML = "";
    components.output.style.display = "none";

    let file;
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
    formData.append("origem", components.origin.value);
    formData.append("destino", components.destiny.value);
    const response = await fetch(baseUrl + "/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (result) {
      components.output.style.display = "flex";
      components.output.innerHTML = `<pre>${JSON.stringify(
        result,
        null,
        2
      )}</pre>`;
    }
    if (result && result.caminho) {
      highlightPath(lineMap, result.caminho, nodeDivs);
    }
  });

  components.genPath.addEventListener("click", async () => {
    if (!components.origin.value || !components.destiny.value) return;
    const url =
      baseUrl +
      `?origem=${components.origin.value}&destino=${components.destiny.value}`;
    const result = await fetchPathFinder(url);
    components.output.innerHTML = "";
    components.output.style.display = "none";
    if (result) {
      components.output.style.display = "flex";
      components.output.innerHTML = JSON.stringify(result, null, 2);
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
