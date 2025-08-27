
/**
 * @function Fetches the default map
 * @param {string} path Path to default Json file
 * @returns {Promise<Object>} Returns the file content as json
 */

export const fetchDefaultMap = async (path) => {
  if(typeof path !== "string")
    throw new Error("Not string in" + fetchDefaultMap.name)
  const map = await fetch(path);
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

export const fetchPathFinder = async (path, tries = 5, delay = 1000) => {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      if(typeof path !== "string")
    throw new Error("Not string in" + fetchPathFinder.name)
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

