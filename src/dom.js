export const getMain = () => {
  let main = document.querySelector("main");
  if (!main) {
    main = document.createElement("main");
  }
  main.style.display = "none";
  document.body.appendChild(main);
  return main;
};


export const populateSelectors = (uniqueNodes, origin, destiny) => {
  uniqueNodes.forEach((node) => {
    const optionOrigin = document.createElement("option");
    optionOrigin.value = node;
    optionOrigin.textContent = node;
    origin.appendChild(optionOrigin);

    const optionDestiny = document.createElement("option");
    optionDestiny.value = node;
    optionDestiny.textContent = node;
    destiny.appendChild(optionDestiny);
  });
};