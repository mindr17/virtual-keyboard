import Control from './Control';

class Btn {
  private keyboardElem: HTMLElement;
  public btnObj: any;
  public elem: HTMLElement;
  public charEn: string;
  public charEnShift: string;
  public charRu: string;
  public charRuShift: string;
  public char: string;

  constructor(keyboardElem: HTMLElement, btnObj: Object) {
    this.keyboardElem = keyboardElem;
    this.btnObj = btnObj;
    this.elem = this.buildBtn(this.btnObj);
  }

  private buildBtn(btnObj) {
    const btnElement: any = new Control(this.keyboardElem, 'div', 'keyboard__key btn', '').node;
    btnElement.style.userSelect = 'none';

    if (btnObj.width) {
      btnElement.style.minWidth = this.btnObj.width;
      btnElement.style.flexGrow = '1';
    }
    if (btnObj.utility) {
      btnElement.classList.add('btn_utility');
    }

    this.charEn = btnObj.key;
    new Control(btnElement, 'div', 'btn__char en', this.charEn);

    if (!this.btnObj.utility) {
      if (!this.btnObj.uppperCased) {
        this.charEnShift = this.btnObj.key.toUpperCase();
      } else {
        this.charEnShift = this.btnObj.uppperCased;
      }
    } else {
      this.charEnShift = this.btnObj.key;
    }
    new Control(btnElement, 'div', 'btn__char en-shift', this.charEnShift);

    if (this.btnObj.keyRU) {
      this.charRu = this.btnObj.keyRU;
    } else {
      this.charRu = this.btnObj.key;
    }
    new Control (btnElement, 'div', 'btn__char ru', this.charRu);

    if (this.btnObj.keyRU && !this.btnObj.uppperCased) {
      this.charRuShift = this.btnObj.keyRU.toUpperCase();
    } else if (this.btnObj.uppperCased) {
      this.charRuShift = this.btnObj.uppperCased;
    } else {
      this.charRuShift = this.btnObj.key;
    }
    new Control (btnElement, 'div', 'btn__char ru-shift', this.charRuShift);

    return btnElement;
  }

  public update(layout: string) {
    if (layout === 'en') {
      this.char = this.charEn;
    } else if (layout === 'en-shift') {
      this.char = this.charEnShift;
    } else if (layout === 'ru') {
      this.char = this.charRu;
    } else if (layout === 'ru-shift') {
      this.char = this.charRuShift;
    }
  }
}

export default Btn;
