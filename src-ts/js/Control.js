"use strict";
exports.__esModule = true;
var Control = /** @class */ (function () {
    function Control(parentNode, tagName, classNames, content) {
        var _a;
        var elem = tagName ? document.createElement(tagName)
            : document.createElement('div');
        if (classNames) {
            var classNamesArr = classNames.split(' ');
            (_a = elem.classList).add.apply(_a, classNamesArr);
        }
        if (content)
            elem.textContent = content;
        if (parentNode)
            parentNode.append(elem);
        this.node = elem;
    }
    Control.prototype.destroy = function () {
        this.node.remove();
    };
    return Control;
}());
exports["default"] = Control;
