const generateNodes = async (node) => {
if(typeof node !== "object")
    throw new Error("No node list");

const main = document.querySelector("main");
let count = 0;

node.forEach((nodeValue, index) => {
    const div = document.createElement("div");
    div.classList.add("node");

    div.innerHTML = nodeValue;

    div.style.top = `${index * 100}`;
    div.style.left = `${index * 100}`;
    main.appendChild(div);
})
}

generateNodes([1,2,3]);