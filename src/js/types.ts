interface IKeyBoard {
  capsLock: boolean;
  shift: boolean;
  alt: boolean;
  control: boolean;
  language: string;
  pressedArr: any;
  btnsArr: any;
  checkIfPressed: Function;
  updateBtns: Function;
  addBtns: Function;
  keyboardElem: HTMLElement;
}
