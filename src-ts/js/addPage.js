"use strict";
exports.__esModule = true;
var btnsDb_json_1 = require("./btnsDb.json");
var Control_1 = require("./Control");
var Btn_1 = require("./Btn");
var createPage = function () {
    var btnsDb = JSON.parse(btnsDb_json_1["default"]);
    var body = document.body;
    var main = new Control_1["default"](body, 'main', 'main');
    var header = new Control_1["default"](main.node, 'header', 'header').node;
    var doNothing = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function () {
        });
    };
    var h1 = new Control_1["default"](header, 'h1', 'header__title', 'RSS виртуальная клавиатура').node;
    var description = new Control_1["default"](header, 'div', 'header__description', 'Создано для Windows. Переключение языка alt + shift').node;
    doNothing(h1, description);
    var inputElem = new Control_1["default"](main.node, 'textarea', 'input-wrapper').node;
    var keyboardWrapper = new Control_1["default"](main.node, 'div', 'keyboard-wrapper').node;
    var Keyboard = /** @class */ (function () {
        function Keyboard(wrapper, inputElement) {
            this.capsLock = false;
            this.shift = false;
            this.alt = false;
            this.control = false;
            this.language = 'en';
            if (!localStorage.getItem('virtualKeyboardLanguage')) {
                localStorage.setItem('virtualKeyboardLanguage', this.language);
            }
            this.pressedArr = [];
            this.btnsArr = [];
            this.inputElem = inputElement;
            this.keyboardElem = new Control_1["default"](keyboardWrapper, 'div', 'keyboard').node;
            this.btnsArr = this.addBtns();
            this.updateBtns();
            this.addGlobalListeners(this.btnsArr);
        }
        Keyboard.prototype.addBtns = function () {
            var _this = this;
            var tempArr = [];
            btnsDb.forEach(function (btnObj) {
                var btn = new Btn_1["default"](_this.keyboardElem, btnObj);
                tempArr.push(btn);
                btn.elem.onmousedown = function () {
                    _this.keyDown(btn);
                };
                btn.elem.onmouseup = function () {
                    _this.keyUp(btn);
                };
                btn.elem.onmouseout = function () {
                    _this.keyUp(btn);
                };
            });
            return tempArr;
        };
        Keyboard.prototype.addGlobalListeners = function (btnsArr) {
            var _this = this;
            window.onkeydown = function (e) {
                e.preventDefault();
                btnsArr.forEach(function (btn) {
                    if (e.code === btn.btnObj.code) {
                        _this.keyDown(btn);
                    }
                });
            };
            window.onkeyup = function (e) {
                e.preventDefault();
                btnsArr.forEach(function (btn) {
                    if (e.code === btn.btnObj.code) {
                        _this.keyUp(btn);
                    }
                });
            };
        };
        Keyboard.prototype.checkIfPressed = function (code) {
            var pressedIndex = this.pressedArr.filter(function (obj) { return obj.btnObj.code === code; });
            if (pressedIndex.length > 0) {
                return true;
            }
            return false;
        };
        Keyboard.prototype.keyDown = function (btn) {
            btn.elem.classList.add('btn_pressed');
            if (this.pressedArr.indexOf(btn) < 0) {
                this.pressedArr.push(btn);
                this.shift = this.checkIfPressed('ShiftLeft');
                if (btn.btnObj.key === 'CapsLock') {
                    this.capsLock = !this.capsLock;
                    if (!this.capsLock)
                        btn.elem.classList.remove('btn_pressed');
                }
                this.control = this.checkIfPressed('ControlLeft');
                this.alt = this.checkIfPressed('AltLeft');
                if (this.alt && this.shift) {
                    this.language = this.language === 'en' ? 'ru' : 'en';
                    localStorage.setItem('virtualKeyboardLanguage', this.language);
                    this.updateBtns();
                }
                else {
                    this.updateBtns();
                }
            }
            else {
                this.updateBtns();
            }
            this.print(btn);
        };
        Keyboard.prototype.keyUp = function (btn) {
            var _this = this;
            this.pressedArr.forEach(function (item, index) {
                if (item === btn) {
                    _this.pressedArr.splice(index, 1);
                    _this.shift = _this.checkIfPressed('ShiftLeft');
                    _this.control = _this.checkIfPressed('ControlLeft');
                    _this.alt = _this.checkIfPressed('AltLeft');
                    _this.updateBtns();
                }
            });
            if (btn.btnObj.code !== 'CapsLock') {
                btn.elem.classList.remove('btn_pressed');
            }
        };
        Keyboard.prototype.print = function (btn) {
            var inputElement = this.inputElem;
            var cursorIndex = inputElement.selectionEnd;
            var oldText = inputElement.value;
            if (cursorIndex === 0) {
                cursorIndex = oldText.length;
            }
            var textBefore = oldText.substring(0, cursorIndex);
            var textAfter = oldText.substring(cursorIndex, oldText.length);
            var newText = '';
            if (btn.btnObj.code === 'Backspace') {
                textBefore = textBefore.substring(0, textBefore.length - 1);
                newText = textBefore + textAfter;
                cursorIndex -= 1;
            }
            else if (btn.btnObj.code === 'Delete') {
                textAfter = textAfter.substring(1, textAfter.length);
                newText = textBefore + textAfter;
            }
            else if (btn.btnObj.code === 'Enter') {
                newText = "".concat(textBefore, "\n").concat(textAfter);
                cursorIndex += 1;
            }
            else if (btn.btnObj.code === 'Tab') {
                newText = "".concat(textBefore, "    ").concat(textAfter);
                cursorIndex += 4;
            }
            else if (!btn.btnObj.utility) {
                newText = textBefore + btn.char + textAfter;
                cursorIndex += 1;
            }
            else {
                newText = oldText;
            }
            inputElem.value = newText;
            inputElem.setSelectionRange(cursorIndex, cursorIndex);
        };
        Keyboard.prototype.updateBtns = function () {
            var _this = this;
            this.language = localStorage.getItem('virtualKeyboardLanguage');
            this.btnsArr.forEach(function (btn) {
                btn.update(_this.language, _this.capsLock, _this.shift);
            });
        };
        return Keyboard;
    }());
    var keyboard = new Keyboard(keyboardWrapper, inputElem);
    doNothing(keyboard);
};
exports["default"] = createPage;
