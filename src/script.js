const getMain = () => {
  let main = document.querySelector("main");
  if (!main) {
    main = document.createElement("main");
  }
  document.body.appendChild(main);
  return main;
};

const fetchDefaultMap = async (path) => {
  const map = await fetch(path);
  return map.json();
};

const fetchUserMap = (inputFile) => {
  const file = inputFile.files[0];
  if (!file) {
    alert("Selecione um arquivo!");
    throw new Error("ah sla");
  }

  const fileName = file.name;
  if (!fileName.endsWith(".json")) {
    alert("Por favor, selecione um arquivo .json!");
    throw new Error("ah sla");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(json);
      } catch (err) {
        alert("Arquivo inválido!");
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};

const fetchPathFinder = async (path) => {
  const result = await fetch(path);
  return result.json();
};

const extractUniqueNodes = (map) => {
  const values = Object.values(map);
  const uniqueNodes = new Set(Object.keys(map));

  values.forEach((value) => {
    Object.keys(value.arestas).forEach((aresta) => {
      uniqueNodes.add(aresta);
    });
  });

  return uniqueNodes;
};

const buildNodes = (nodeList) => {
  const nodeMap = new Map();
  nodeList.forEach((node) => {
    const div = document.createElement("div");
    div.classList.add("node");
    div.innerHTML = node;
    nodeMap.set(node, div);
  });
  return nodeMap;
};

const appendNodesToMain = (nodeMap, main) => {
  nodeMap.forEach((node) => {
    main.appendChild(node);
  });
};

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

const generateLines = (pathsMap) => {};
const components = {
  radioSim: document.querySelector("#useDefaultMap"),
  radioNao: document.querySelector("#useOtherMap"),
  inputFile: document.querySelector("#otherMap"),
  downloadMap: document.querySelector("#downloadBtn"),
  genMap: document.querySelector("#genBtn"),
  genPath: document.querySelector("#pathBtn"),
  origin: document.querySelector("#origin"),
  destiny: document.querySelector("#destiny"),
};
const controller = () => {
  const defaultMapPath = "../src/main/resources/grafo.json";
  const baseUrl = "http://127.0.0.1:8082/caminho";
  const main = getMain();

  components.downloadMap.addEventListener("click", () => {
    downloadDefaultMap(defaultMapPath);
  });

  components.genPath.addEventListener("click", () => {
    if (!components.origin.value || !components.destiny.value) return;
    const newUrl =
      baseUrl +
      `?origem=${components.origin.value}&destino=${components.destiny.value}`;
    fetchPathFinder(newUrl);
  });

  components.radioSim.addEventListener("change", () => {
    if (radioSim.checked) inputFile.style.display = "none";
    main.innerHTML = "";
  });

  components.radioNao.addEventListener("change", () => {
    if (radioNao.checked) inputFile.style.display = "block";
    main.innerHTML = "";
  });

  components.genMap.addEventListener("click", async () => {
    let map;
    main.innerHTML = "";
    if (radioNao.checked) {
      map = await fetchUserMap(document.querySelector("#otherMap"));
    }

    if (radioSim.checked) map = await fetchDefaultMap(defaultMapPath);

    const uniqueNodes = extractUniqueNodes(map);
    const nodeMap = buildNodes(uniqueNodes);
    appendNodesToMain(nodeMap, main);
  });
};

controller();
