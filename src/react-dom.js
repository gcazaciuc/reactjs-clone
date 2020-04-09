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

const virtualDOMDiff = (currentVirtualDOM, nextVirtualDOM, node) => {
  const differences = [];
  if (!currentVirtualDOM) {
    // We need to create a full new node
    differences.push({
      type: "create-node",
      vdom: nextVirtualDOM,
      node,
    });
  }
  return differences;
};

const updateDOM = (change) => {
  switch (change.type) {
    case "create-node":
      change.node.appendChild(createDOMElement(change.vdom));
      break;
    case "remove-node":
    case "replace-node":
    case "change-prop":
    case "remove-prop":
    default:
      break;
  }
};
let currentVirtualDOM = null;

export const render = (virtualDOM, node) => {
  if (!currentVirtualDOM) {
    node.innerHTML = "";
  }
  const changes = virtualDOMDiff(currentVirtualDOM, virtualDOM, node);
  changes.forEach(updateDOM);
  currentVirtualDOM = virtualDOM;
};
