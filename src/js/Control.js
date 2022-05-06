class Control {
    node;

    constructor(parentNode, tagName, classNames, content) {
      const elem = tagName ? document.createElement(tagName)
        : document.createElement('div');
      if (classNames) {
        const classNamesArr = classNames.split(' ');
        elem.classList.add(...classNamesArr);
      }
      if (content) elem.textContent = content;
      if (parentNode) parentNode.append(elem);
      this.node = elem;
    }

    destroy() {
      this.node.remove();
    }
}
export default Control;
