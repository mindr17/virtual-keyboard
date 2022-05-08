import Control from './Control';

class Btn {
  private keyboardElem: HTMLElement;

  public btnObj: any;

  public elem: HTMLElement;

  public char: string;

  constructor(keyboardElem: HTMLElement, btnObj: Object) {
    this.keyboardElem = keyboardElem;
    this.btnObj = btnObj;
    this.elem = this.buildBtn(this.btnObj);
  }

  private buildBtn(btnObj) {
    const btnElement: any = new Control(this.keyboardElem, 'div', 'keyboard__key btn', '').node;

    if (btnObj.width) {
      btnElement.style.minWidth = this.btnObj.width;
      btnElement.style.flexGrow = '1';
    }
    if (btnObj.utility) {
      btnElement.classList.add('btn_utility');
    }
    return btnElement;
  }

  public update(language: string, capsLock: boolean, shift: boolean) {
    this.elem.textContent = '';
    this.char = this.btnObj.key;
    if (!this.btnObj.utility) {
      if (!capsLock) {
        if (language === 'en' && shift) {
          if (this.btnObj.key.toUpperCase() !== this.btnObj.key) {
            this.char = this.btnObj.key.toUpperCase();
          } else {
            this.char = this.btnObj.upperCased;
          }
        } else if (language === 'ru' && !shift) {
          if (this.btnObj.keyRU) {
            this.char = this.btnObj.keyRU;
          }
        } else if (language === 'ru' && shift) {
          if (this.btnObj.keyRU && this.btnObj.keyRU.toUpperCase() !== this.btnObj.key) {
            this.char = this.btnObj.keyRU.toUpperCase();
          } else if (this.btnObj.upperCased) {
            this.char = this.btnObj.keyRUUpper;
          }
        }
      } else if (capsLock) {
        if (language === 'en' && !shift && this.btnObj.key.toUpperCase() !== this.btnObj.key) {
          this.char = this.btnObj.key.toUpperCase();
        } else if (language === 'en' && shift) {
          if (this.btnObj.key.toUpperCase() !== this.btnObj.key) {
            this.char = this.btnObj.key;
          } else if (this.btnObj.upperCased) {
            this.char = this.btnObj.upperCased;
          }
        } else if (language === 'ru' && !shift) {
          if (this.btnObj.keyRU) {
            if (this.btnObj.keyRU.toUpperCase() !== this.btnObj.key) {
              this.char = this.btnObj.keyRU.toUpperCase();
            }
          }
        } else if (language === 'ru' && shift) {
          if (this.btnObj.keyRU && this.btnObj.keyRU.toUpperCase() !== this.btnObj.key) {
            this.char = this.btnObj.keyRU;
          } else if (this.btnObj.upperCased) {
            this.char = this.btnObj.keyRUUpper;
          }
        }
      }
    }
    const doNothing = (...args) => {
      args.forEach(() => {
      });
    };
    const char = new Control(this.elem, 'div', 'btn__char', this.char);
    doNothing(char);
  }
}

export default Btn;
