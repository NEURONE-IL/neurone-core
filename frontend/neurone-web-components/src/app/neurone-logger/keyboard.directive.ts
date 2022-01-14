import { HttpClient } from '@angular/common/http';
import { Directive, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
  selector: '[neurone-logger-keyboard]'
})
export class KeyboardDirective {

  handlerId = "Neurone Keyboard Logger";

  constructor(private authService: AuthService, private http: HttpClient) { }

  keyDataParse(type: string, evt: KeyboardEvent) {

    if (!this.authService.getAuth()) {
      return;
    }

    let targetId: string = "";
    // needed to make sure event target exists
    if (evt.target instanceof Element) {
      targetId = evt.target.id
    }

    let data = {
      logtype   : "keyboard",
      userId    : this.authService.getUserId(),
      type      : type,
      source    : this.handlerId,
      target    : targetId,
      url       : window.document.URL,
      dateClient : Date.now(),
      which     : evt.which,
      keyCode   : evt.keyCode,
      charCode  : evt.charCode,
      key       : evt.key,
      //char      : evt.char
    };

    console.log(data);

    this.http.post("http://localhost:3002/logger", data).subscribe({
      next: (message => {console.log(message)}),
      error: (err => {console.error(err)})
    });

  }

  @HostListener('keydown', ['$event'])
  keyDown(event: any) {
    this.keyDataParse("Key Down", event);
  }

  @HostListener('keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.keyDataParse("Key Up", event);
  }

}
