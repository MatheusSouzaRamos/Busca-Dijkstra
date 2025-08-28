/**
 * @function gets the main element from html or,
 *  if not in the page, creates it's own
 *  and sets its display to none
 * @returns {HTMLElement} the main element from html
 */

export const getMain = () => {
  let main = document.querySelector("main");
  if (!main) {
    main = document.createElement("main");
  }
  main.style.display = "none";
  document.body.appendChild(main);
  return main;
};

/**
 *
 * @param {Set} uniqueNodes pass all the unique nodes in the map
 * @param {HTMLElement} origin selector to be populated with the nodes names
 * @param {HTMLElement} destiny selector to be populated with the nodes names
 */

//Função pode ser melhorada passando um array ao invés de dois parâmetros pra popular
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
