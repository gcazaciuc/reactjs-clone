import { virtualDOMDiff } from "./dom-reconciliation";

const createDOMElement = (virtualDOMElement) => {
  if (typeof virtualDOMElement === "string") {
    return document.createTextNode(virtualDOMElement);
  }
  const element = document.createElement(virtualDOMElement.type);
  Object.keys(virtualDOMElement.props).forEach((attrName) => {
    element.setAttribute(attrName, virtualDOMElement.props[attrName]);
  });
  virtualDOMElement.props.children.forEach((virtualDOMElem) => {
    element.appendChild(createDOMElement(virtualDOMElem));
  });
  return element;
};

const updateDOM = (change) => {
  switch (change.type) {
    case "create-node":
      change.domContextNode.appendChild(createDOMElement(change.vdom));
      break;
    case "remove-node":
      change.domContextNode.parentNode.removeChild(change.domContextNode);
      break;
    case "replace-node":
      change.domContextNode.parentNode.replaceChild(
        createDOMElement(change.vdom),
        change.domContextNode
      );
      break;
    case "change-prop":
      change.domContextNode.setAttribute(change.prop, change.value);
      break;
    case "remove-prop":
      change.domContextNode.removeAttribute(change.prop);
      break;
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
