/**
 * @function creates the svg environment
 * @returns {SVGSVGElement} the svg
 */

export const createSvg = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100vw";
  svg.style.height = "100vh";
  svg.style.pointerEvents = "none";
  return svg;
};

/**
 * @function creates the line that connect the nodes
 * @param {Number} from coords of where the line will begin
 * @param {Number} to coords of where the line will end
 * @param {DOMRect} mainRect borders for limiting the line
 * @returns the line itself
 */

export const createLine = (from, to, mainRect) => {
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
