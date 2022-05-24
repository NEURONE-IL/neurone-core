import { HttpClient } from '@angular/common/http';
import { Directive, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { throttle } from './throttle.decorator';

@Directive({
  selector: '[neurone-logger-scroll]'
})
export class ScrollDirective {

  handlerId = "Neurone Scroll Logger";

  constructor(private authService: AuthService, private http: HttpClient) { }

  scrollDataParse(type: string, evt: KeyboardEvent) {

    if (!this.authService.getAuth()) {
      return;
    }

    let data = {
      userId: this.authService.getUserId(),
      type  : type,
      source: this.handlerId,
      url   : window.document.URL,
      dateClient: Date.now(),
      x_scr : window.scrollX,
      y_scr : window.scrollY,
      w_win : window.innerWidth,
      h_win : window.innerHeight,
      w_doc : document.documentElement.scrollWidth,
      h_doc : document.documentElement.scrollHeight
    };

    console.log(data);

    this.http.post("http://localhost:3002/logger/scroll", data).subscribe({
      next: (_ => {}),
      error: (err => {console.error(err)})
    });

  }

  @throttle(1000)
  @HostListener('window:scroll', ['$event'])
  keyDown(event: any) {
    this.scrollDataParse("Scroll", event);
  }

}
