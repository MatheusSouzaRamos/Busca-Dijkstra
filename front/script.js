const generateNodes = async (node) => {
if(typeof node !== "object")
    throw new Error("No node list");

const main = document.querySelector("main");
let count = 0;
const response = await fetch("../grafo2.json");
console.log(response);
node.forEach((nodeValue, idx) => {
    const div = document.createElement("div");
    div.classList.add("node");
    div.innerHTML = nodeValue;
    div.style.top = `${10 + idx * 100}px`;
    div.style.left = `${10 + idx * 100}px`;
    main.appendChild(div);
})
}

generateNodes([1,2,3]);