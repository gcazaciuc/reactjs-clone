const detectTagChanges = (
  currentVirtualDOM,
  nextVirtualDOM,
  node,
  childIdx = 0
) => {
  const differences = [];
  // If a new node was added, ie it was not present in the
  // old virtual DOM but is specified in the new one
  if (!currentVirtualDOM && nextVirtualDOM) {
    differences.push({
      type: "create-node",
      vdom: nextVirtualDOM,
      domContextNode: node,
    });
  }
  // If the node was removed in the new virtual DOM but was present
  // in the old one
  if (!nextVirtualDOM && currentVirtualDOM) {
    differences.push({
      type: "remove-node",
      vdom: nextVirtualDOM,
      domContextNode: node.childNodes[childIdx],
    });
  }

  // If both nodes are present but the tag has changed or the text node
  // contents has changed
  if (currentVirtualDOM && nextVirtualDOM) {
    const areDifferentTypes =
      typeof currentVirtualDOM === "object" &&
      typeof nextVirtualDOM === "object" &&
      currentVirtualDOM.type !== nextVirtualDOM.type;

    const areDifferentStrings =
      typeof currentVirtualDOM === "string" &&
      typeof nextVirtualDOM === "string" &&
      currentVirtualDOM !== nextVirtualDOM;

    if (areDifferentTypes || areDifferentStrings) {
      differences.push({
        type: "replace-node",
        domContextNode: node.childNodes[childIdx],
        vdom: nextVirtualDOM,
      });
    }
  }

  return differences;
};
const detectChildChanges = (
  currentVirtualDOM,
  nextVirtualDOM,
  node,
  childIdx = 0
) => {
  const differences = [];

  const maxChildren = Math.max(
    currentVirtualDOM.props.children.length,
    nextVirtualDOM.props.children.length
  );
  for (let i = 0; i < maxChildren; i++) {
    differences.push(
      ...virtualDOMDiff(
        currentVirtualDOM.props.children[i],
        nextVirtualDOM.props.children[i],
        node.childNodes[childIdx],
        i
      )
    );
  }

  return differences;
};

const propsDiff = (firstProps, secondProps) => {
  return Object.keys(firstProps)
    .filter((fp) => fp === "children")
    .filter((fp) => {
      return !Object.keys(secondProps).find((sp) => sp === fp);
    })
    .map((fp) => ({ name: fp, value: firstProps[fp] }));
};

const detectPropsChanges = (
  currentVirtualDOM,
  nextVirtualDOM,
  node,
  childIdx = 0
) => {
  const differences = [];
  const deletedProps = propsDiff(currentVirtualDOM.props, nextVirtualDOM.props);
  const changedProps = propsDiff(nextVirtualDOM.props, currentVirtualDOM.props);

  differences.push(
    ...deletedProps.map((dp) => ({
      type: "remove-prop",
      ...dp.name,
      domContextNode: node.childNodes[childIdx],
    }))
  );
  differences.push(
    ...changedProps.map((dp) => ({
      type: "change-prop",
      ...dp,
      domContextNode: node.childNodes[childIdx],
    }))
  );
  return differences;
};

export const virtualDOMDiff = (
  currentVirtualDOM,
  nextVirtualDOM,
  node,
  childIdx = 0
) => {
  const differences = [];

  differences.push(
    ...detectTagChanges(currentVirtualDOM, nextVirtualDOM, node, childIdx)
  );

  if (
    currentVirtualDOM &&
    nextVirtualDOM &&
    typeof currentVirtualDOM === "object" &&
    typeof nextVirtualDOM === "object"
  ) {
    differences.push(
      ...detectPropsChanges(currentVirtualDOM, nextVirtualDOM, node, childIdx)
    );
    differences.push(
      ...detectChildChanges(currentVirtualDOM, nextVirtualDOM, node, childIdx)
    );
  }

  return differences;
};
