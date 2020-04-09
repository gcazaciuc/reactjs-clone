const createDOMElement = (virtualDOMElement) => {
  if (typeof virtualDOMElement === "string") {
    return document.createTextNode(virtualDOMElement);
  }
  const element = document.createElement(virtualDOMElement.type);
  Object.keys(virtualDOMElement.props).forEach((attrName) => {
    element.setAttribute(attrName, virtualDOMElement.props[attrName]);
  });
  virtualDOMElement.children.forEach((virtualDOMElem) => {
    element.appendChild(createDOMElement(virtualDOMElem));
  });
  return element;
};

export const render = (virtualDOM, node) => {
  node.appendChild(createDOMElement(virtualDOM));
};
