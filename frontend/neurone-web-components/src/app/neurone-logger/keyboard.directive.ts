import { HttpClient } from '@angular/common/http';
import { Directive, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

interface NeuroneIframeKeyboardData {
  type: string,
  target: string,
  url: string,
  which: number,
  keyCode   : number,
  charCode  : number,
  key       : string,
  code      : string,
}

interface NeuroneIframeWindowData {
  url: string,
  w_win : number,
  h_win : number,
  w_doc : number,
  h_doc : number
}

@Directive({
  selector: '[neurone-logger-keyboard]'
})
export class KeyboardDirective {

  handlerId = "Neurone Keyboard Logger";

  constructor(private authService: AuthService, private http: HttpClient) { }

  keyDataParse(type: string, evt: KeyboardEvent | NeuroneIframeKeyboardData, windowData?: NeuroneIframeWindowData) {

    if (!this.authService.getAuth()) {
      return;
    }

    let targetId: string = "";
    // needed to make sure event target exists
    if (evt.target instanceof Element) {
      targetId = evt.target.id
    } else if (typeof evt.target === 'string') {
      targetId = evt.target
    }

    let data = {
      userId    : this.authService.getUserId(),
      type      : type,
      source    : this.handlerId,
      target    : targetId,
      url       : windowData?.url || window.document.URL,
      dateClient : Date.now(),
      which     : evt.which,
      keyCode   : evt.keyCode,
      charCode  : evt.charCode,
      key       : evt.key,
      code      : evt.code,
      char      : null // part of original neurone
    };

    console.log("Neurone Logger Keyboard data:\n", data);

    this.http.post("http://localhost:" + environment.neuroneProfilePort + "/logger/keyboard", data).subscribe({
      next: (_ => {}),
      error: (err => {console.error(err)})
    });

  }

  @HostListener('keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.keyDataParse("Key Down", event);
  }

  @HostListener('keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.keyDataParse("Key Up", event);
  }

  // to listen to iframe messages using see postMessage js API, compatible with neurone-search document downloader pages
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.data.objType === 'neurone_keyboard'){
      const keyboardData: NeuroneIframeKeyboardData = event.data.keyboardData;
      this.keyDataParse(keyboardData.type, keyboardData);
    }
  }

}
