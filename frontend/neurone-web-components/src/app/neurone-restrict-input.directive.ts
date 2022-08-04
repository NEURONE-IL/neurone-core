import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[neuroneRestrictInput]'
})
export class NeuroneRestrictInputDirective {

  // prevent right click menu
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event) {
    event.preventDefault();
  }

  // prevent pasting text
  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    event.preventDefault();
  }

  // prevent copying text
  @HostListener('copy', ['$event']) blockCopy(event: KeyboardEvent) {
    event.preventDefault();
  }

  // prevent cutting text
  @HostListener('cut', ['$event']) blockCut(event: KeyboardEvent) {
    event.preventDefault();
  }

  constructor() { }

}
