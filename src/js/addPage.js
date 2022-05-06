import btnsDbJson from './btnsDb.json';
import Control from './Control';
import Btn from './Btn';

const createPage = () => {
  const btnsDb = JSON.parse(btnsDbJson);
  const { body } = document;
  const main = new Control(body, 'main', 'main');
  const header = new Control(main.node, 'header', 'header').node;
  const doNothing = (...args) => {
    args.forEach(() => {
    });
  };
  const h1 = new Control(header, 'h1', 'header__title', 'RSS виртуальная клавиатура').node;
  const description = new Control(header, 'div', 'header__description', 'Создано для Windows. Переключение языка alt + shift').node;
  doNothing(h1, description);
  const inputElem = new Control(main.node, 'textarea', 'input-wrapper').node;
  const keyboardWrapper = new Control(main.node, 'div', 'keyboard-wrapper').node;
  class Keyboard {
        keyboardElem;

        btnsArr;

        pressedArr;

        shift;

        capsLock;

        control;

        alt;

        language;

        inputElem;

        constructor(wrapper, inputElement) {
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
          this.keyboardElem = new Control(keyboardWrapper, 'div', 'keyboard').node;
          this.btnsArr = this.addBtns();
          this.updateBtns();
          this.addGlobalListeners(this.btnsArr);
        }

        addBtns() {
          const tempArr = [];
          btnsDb.forEach((btnObj) => {
            const btn = new Btn(this.keyboardElem, btnObj);
            tempArr.push(btn);
            btn.elem.onmousedown = () => {
              this.keyDown(btn);
            };
            btn.elem.onmouseup = () => {
              this.keyUp(btn);
            };
            btn.elem.onmouseout = () => {
              this.keyUp(btn);
            };
          });
          return tempArr;
        }

        addGlobalListeners(btnsArr) {
          window.onkeydown = (e) => {
            e.preventDefault();
            btnsArr.forEach((btn) => {
              if (e.code === btn.btnObj.code) {
                this.keyDown(btn);
              }
            });
          };
          window.onkeyup = (e) => {
            e.preventDefault();
            btnsArr.forEach((btn) => {
              if (e.code === btn.btnObj.code) {
                this.keyUp(btn);
              }
            });
          };
        }

        checkIfPressed(code) {
          const pressedIndex = this.pressedArr.filter((obj) => obj.btnObj.code === code);
          if (pressedIndex.length > 0) {
            return true;
          }
          return false;
        }

        keyDown(btn) {
          btn.elem.classList.add('btn_pressed');
          if (this.pressedArr.indexOf(btn) < 0) {
            this.pressedArr.push(btn);
            this.shift = this.checkIfPressed('ShiftLeft');
            if (btn.btnObj.key === 'CapsLock') {
              this.capsLock = !this.capsLock;
              if (!this.capsLock) btn.elem.classList.remove('btn_pressed');
            }
            this.control = this.checkIfPressed('ControlLeft');
            this.alt = this.checkIfPressed('AltLeft');
            if (this.alt && this.shift) {
              this.language = this.language === 'en' ? 'ru' : 'en';
              localStorage.setItem('virtualKeyboardLanguage', this.language);
              this.updateBtns();
            } else {
              this.updateBtns();
            }
          } else {
            this.updateBtns();
          }
          this.print(inputElem, btn);
        }

        keyUp(btn) {
          this.pressedArr.forEach((item, index) => {
            if (item === btn) {
              this.pressedArr.splice(index, 1);
              this.shift = this.checkIfPressed('ShiftLeft');
              this.control = this.checkIfPressed('ControlLeft');
              this.alt = this.checkIfPressed('AltLeft');
              this.updateBtns();
            }
          });
          if (btn.btnObj.code !== 'CapsLock') {
            btn.elem.classList.remove('btn_pressed');
          }
        }

        print(inputElement, btn) {
          this.inputElem.focus();
          let cursorIndex = inputElement.selectionEnd;
          const oldText = inputElement.value;
          if (cursorIndex === 0) {
            cursorIndex = oldText.length;
          }
          let textBefore = oldText.substring(0, cursorIndex);
          let textAfter = oldText.substring(cursorIndex, oldText.length);
          let newText = '';
          if (btn.btnObj.code === 'Backspace') {
            textBefore = textBefore.substring(0, textBefore.length - 1);
            newText = textBefore + textAfter;
            cursorIndex -= 1;
          } else if (btn.btnObj.code === 'Delete') {
            textAfter = textAfter.substring(1, textAfter.length);
            newText = textBefore + textAfter;
          } else if (btn.btnObj.code === 'Enter') {
            newText = `${textBefore}\n${textAfter}`;
            cursorIndex += 1;
          } else if (btn.btnObj.code === 'Tab') {
            newText = `${textBefore}\t${textAfter}`;
            cursorIndex += 4;
          } else if (!btn.btnObj.utility) {
            newText = textBefore + btn.char + textAfter;
            cursorIndex += 1;
          } else {
            newText = oldText;
          }
          inputElem.value = newText;
          inputElem.setSelectionRange(cursorIndex, cursorIndex);
        }

        updateBtns() {
          this.language = localStorage.getItem('virtualKeyboardLanguage');
          this.btnsArr.forEach((btn) => {
            btn.update(this.language, this.capsLock, this.shift);
          });
        }
  }
  const keyboard = new Keyboard(keyboardWrapper, inputElem);
  doNothing(keyboard);
};
export default createPage;
