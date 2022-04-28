import './types.ts';
import Control from './Control';
import btnsDb from './btnsDb.json';
import Btn from './Btn';

const createPage = () => {
  const { body } = document;
  const main = new Control(body, 'main', 'main');
  const header = new Control(main.node, 'header', 'header').node;
  new Control(header, 'h1', 'header__title', 'RSS виртуальная клавиатура').node;
  new Control(header, 'div', 'header__description',
  'Создано для Windows. Переключение языка alt + shift').node;
  const inputElem: any = new Control(main.node, 'textarea', 'input-wrapper').node;
  const keyboardWrapper = new Control(main.node, 'div', 'keyboard-wrapper').node;

  type lang = 'en' | 'ru';

  class Keyboard {
    keyboardElem: HTMLElement;
    btnsArr: Array<Btn>;
    pressedArr: Array<Btn>;
    shift: boolean;
    capsLock: boolean;
    control: boolean;
    alt: boolean;
    language: lang;
    layout: 'en' | 'en-shift' | 'ru' | 'ru-shift';
    inputElem;

    constructor(keyboardWrapper: HTMLElement, inputElem) {
      this.capsLock = false;
      this.shift = false;
      this.alt = false;
      this.control = false;
      this.language = "en";
      localStorage.setItem('virtualKeyboardLanguage', this.language);
      this.pressedArr = [];
      this.btnsArr = [];
      this.inputElem = inputElem;
      this.keyboardElem = new Control(keyboardWrapper, 'div', 'keyboard').node;
      this.btnsArr = this.addBtns();
      this.layout = 'en';
      this.updateBtns();
      this.addGlobalListeners(this.btnsArr);
    }

    private addBtns(): Array<Btn> {
      let tempArr = [];
      btnsDb.forEach((btnObj) => {
        const btn: any = new Btn(this.keyboardElem, btnObj);
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

    private addGlobalListeners(btnsArr: Array<Btn>): void {
      window.onkeydown = (e) => {
        e.preventDefault();
        btnsArr.forEach((btn: Btn) => {
          if (e.code === btn.btnObj.code) {
            this.keyDown(btn);
          }
        });
      }
      window.onkeyup = (e) => {
        e.preventDefault();
        btnsArr.forEach((btn: Btn) => {
          if (e.code === btn.btnObj.code) {
            this.keyUp(btn);
          }
        });
      }
    }

    private checkIfPressed(code: string) {
      const pressedIndex = this.pressedArr.filter(obj => {
        return obj.btnObj.code === code;
      });
      if (pressedIndex.length > 0) {
        return true;
      } else {
        return false;
      }
    }

    private keyDown(btn: Btn) {
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
      btn.update(this.layout);
      this.print(inputElem, btn)
    }

    private keyUp(btn: Btn) {
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

    private print(inputElem: HTMLInputElement, btn: Btn) {
      let cursorIndex = inputElem.selectionEnd;
      let oldText = inputElem.value;
      let textBefore = oldText.substring(0, cursorIndex);
      let textAfter = oldText.substring(cursorIndex, oldText.length);
      let newText = '';
  
      if (!btn.btnObj.utility) {
        newText = textBefore + btn.char + textAfter;
        cursorIndex++;
      } else if (btn.btnObj.code === 'Backspace') {
        textBefore = textBefore.substring(0, textBefore.length - 1);
        newText = textBefore + textAfter;
        cursorIndex--;
      } else if (btn.btnObj.code === 'Delete') {
        textAfter = textAfter.substring(1, textAfter.length);
        newText = textBefore + textAfter;
      } else if (btn.btnObj.code === 'Enter') {
        newText = textBefore + '\n' + textAfter;
        cursorIndex++;
      } else if (btn.btnObj.code === 'Tab') {
        newText = textBefore + '    ' + textAfter;
      } else if (btn.btnObj.code === 'Tab') {
        cursorIndex += 4;
      } else if (btn.btnObj.utility) {
        inputElem.value = oldText;
      }

      inputElem.value = newText;
      inputElem.setSelectionRange(cursorIndex, cursorIndex);
    }
    
    private updateBtns() {
      body.classList.remove(this.layout);
      
      this.language = localStorage.getItem('virtualKeyboardLanguage') as lang;
      this.layout = this.language;
      
      this.shift = this.capsLock ? !this.shift : this.shift;
      if (this.layout === 'en' && this.shift) {
        this.layout = 'en-shift';
      } else if (this.layout === 'ru' && this.shift) {
        this.layout = 'ru-shift';
      }
      body.classList.add(this.layout);
    }
  }

  new Keyboard(keyboardWrapper, inputElem);

    // keyDown() {

    // }

    // keyUp() {
    //   this.keyboard.pressedArr.forEach((item, index) => {
    //     if (item === this) {
    //       this.keyboard.pressedArr.splice(index, 1);
    //       this.keyboard.capsLock = this.keyboard.checkIfPressed('CapsLock');
    //       this.keyboard.shift = this.keyboard.checkIfPressed('ShiftLeft');
    //       this.keyboard.control = this.keyboard.checkIfPressed('ControlLeft');
    //       this.keyboard.alt = this.keyboard.checkIfPressed('AltLeft');
    //       this.keyboard.updateBtns();
    //     }
    //   });
    //   this.btn.classList.remove('btn_pressed');
    // }
};
export default createPage;
