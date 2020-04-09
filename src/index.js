import { render } from "./react-dom";

const virtualDOM = {
  type: "div",
  props: {
    id: "id1",
    class: "abc",
    children: [
      {
        type: "div",
        props: { class: "child", children: ["Hi"] },
      },
    ],
  },
};

const anotherVirtualDOM = {
  type: "div",
  props: {
    id: "id2",
    class: "xyz abc",
    children: [
      {
        type: "p",
        props: { class: "child", children: ["Hi again"] },
      },
    ],
  },
};
render(virtualDOM, document.getElementById("app"));
render(anotherVirtualDOM, document.getElementById("app"));
