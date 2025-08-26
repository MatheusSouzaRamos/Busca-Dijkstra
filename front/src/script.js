let lineMap = new Map();

const getMain = () => {
  let main = document.querySelector("main");
  if (!main) {
    main = document.createElement("main");
  }
  main.style.display = "none";
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
    return null;
  }

  const fileName = file.name;
  if (!fileName.endsWith(".json")) {
    alert("Por favor, selecione um arquivo .json!");
    return null;
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

const fetchPathFinder = async (path, tries = 5, delay = 1000) => {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const result = await fetch(path);
      if (!result.ok) throw new Error("Resposta não OK");
      return await result.json();
    } catch (error) {
      if (attempt === tries) {
        if (error.message == "Failed to fetch")
          alert(
            "Erro: não foi possível se conectar ao servidor. Verifique se o servidor está ligado"
          );
        else alert("Erro de conexão após várias tentativas.");
        return null;
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

const extractUniqueNodes = (map) => {
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

const populateSelectors = (uniqueNodes) => {
  uniqueNodes.forEach((node) => {
    const optionOrigin = document.createElement("option");
    optionOrigin.value = node;
    optionOrigin.textContent = node;
    components.origin.appendChild(optionOrigin);

    const optionDestiny = document.createElement("option");
    optionDestiny.value = node;
    optionDestiny.textContent = node;
    components.destiny.appendChild(optionDestiny);
  });
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

const createSvg = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100vw";
  svg.style.height = "100vh";
  svg.style.pointerEvents = "none";
  return svg;
};

const createLine = (from, to, mainRect) => {
  const x1 = from.left - mainRect.left + from.width / 2;
  const y1 = from.top - mainRect.top + from.height / 2;
  const x2 = to.left - mainRect.left + to.width / 2;
  const y2 = to.top - mainRect.top + to.height / 2;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "2");
  return line;
};

const getNodesPositions = (nodeMap) => {
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

const randomizePositions = (nodeMap, main) => {
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

function highlightPath(pathArray) {
  lineMap.forEach((line) => {
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "2");
  });

  for (let i = 0; i < pathArray.length - 1; i++) {
    const from = pathArray[i];
    const to = pathArray[i + 1];
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;

    const line = lineMap.get(key1) || lineMap.get(key2);
    if (line) {
      line.setAttribute("stroke", "yellow");
      line.setAttribute("stroke-width", "8");
    }
  }
}

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
  const defaultMapPath = "../../src/main/resources/grafo.json";
  const baseUrl = "http://127.0.0.1:8082/caminho";
  const main = getMain();

  components.downloadMap.addEventListener("click", () => {
    downloadDefaultMap(defaultMapPath);
  });

  components.genPath.addEventListener("click", async () => {
    if (!components.origin.value || !components.destiny.value) return;
    const url =
      baseUrl +
      `?origem=${components.origin.value}&destino=${components.destiny.value}`;
    const result = await fetchPathFinder(url);
    components.output.innerHTML = "";
    components.output.innerHTML = JSON.stringify(result, null, 2);
    if (result && result.caminho) {
      highlightPath(result.caminho);
    }
  });

  components.radioSim.addEventListener("change", () => {
    if (components.radioSim.checked)
      components.inputFile.style.display = "none";
    main.innerHTML = "";
    components.origin.innerHTML = "";
    components.destiny.innerHTML = "";
    main.style.display = "none";
  });

  components.radioNao.addEventListener("change", () => {
    if (components.radioNao.checked)
      components.inputFile.style.display = "block";
    main.innerHTML = "";
    components.origin.innerHTML = "";
    components.destiny.innerHTML = "";
    main.style.display = "none";
  });

  components.genMap.addEventListener("click", async () => {
    let map;
    main.style.display = "flex";
    main.innerHTML = "";
    components.origin.innerHTML = "";
    components.destiny.innerHTML = "";

    if (components.radioNao.checked)
      map = await fetchUserMap(document.querySelector("#otherMap"));

    if (components.radioSim.checked)
      map = await fetchDefaultMap(defaultMapPath);
    const uniqueNodes = extractUniqueNodes(map);
    const nodeMap = buildNodes(uniqueNodes);
    appendNodesToMain(nodeMap, main);
    populateSelectors(uniqueNodes);

    requestAnimationFrame(() => {
      randomizePositions(nodeMap, main);

      const svg = createSvg();
      const mainRect = main.getBoundingClientRect();
      const nodePositions = getNodesPositions(nodeMap);
      const paths = genPaths(map);
      paths.forEach((path, node) => {
        const mainNode = node;
        path.forEach((value, node) => {
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
};

controller();
