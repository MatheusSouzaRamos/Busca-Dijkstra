/**
 * @function Fetches the default map
 * @param {string} path Path to default Json file
 * @returns {Promise<Object>} Returns the file content as json
 */

export const fetchDefaultMap = async (path) => {
  if (typeof path !== "string")
    throw new Error("Not string in" + fetchDefaultMap.name);
  const map = await fetch(path);
  if (!map.ok) throw new Error("Error in fetch");
  return map.json();
};

/**
 * @function Fetches the custom user map
 * @param {HTMLInputElement} inputFile Path to user Json file
 * @returns {Promise<Object>} Returns the file content as json
 */

export const fetchUserMap = (inputFile) => {
  if (
    !inputFile ||
    !(inputFile instanceof HTMLInputElement) ||
    inputFile.type !== "file"
  ) {
    throw new Error("Invalid input file in ." + fetchUserMap.name);
  }
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

/**
 * @function Fetches the backend to find the best path using Djikstra algorythm
 * @param {string} path Path to the backend adress
 * @returns {Promise<Object>} Returns the path found as json
 */

export const fetchPathFinder = async (path) => {
  try {
    const result = await fetch(path, { method: "GET" });
    if (!result.ok) return null;
    return await result.json();
  } catch (e) {
    return null;
  }
};

export const fetchDefaultGrafoFile = async () => {
  const response = await fetch("../src/assets/grafo.json");
  const blob = await response.blob();
  return new File([blob], "grafo.json", { type: "application/json" });
};

export const sendHeuristics = async (path, heuristics) => {
  try {
    const result = await fetch(path, {
      method: "POST",
      body: JSON.stringify(heuristics),
    });
  } catch (e) {
    return null;
  }
};
