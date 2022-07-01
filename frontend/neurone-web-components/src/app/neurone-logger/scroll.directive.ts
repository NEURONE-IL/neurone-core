import { HttpClient } from '@angular/common/http';
import { Directive, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { throttle } from './throttle.decorator';

interface NeuroneIframeScrollData {
  type  : string,
  url   : string,
  x_scr : number,
  y_scr : number,
  w_win : number,
  h_win : number,
  w_doc : number,
  h_doc : number
}

@Directive({
  selector: '[neurone-logger-scroll]'
})
export class ScrollDirective {

  handlerId = "Neurone Scroll Logger";

  constructor(private authService: AuthService, private http: HttpClient) { }

  scrollDataParse(type: string, evt?: NeuroneIframeScrollData) {

    if (!this.authService.getAuth()) {
      return;
    }

    let data = {
      userId: this.authService.getUserId(),
      type  : type,
      source: this.handlerId,
      url   : evt?.url || window.document.URL,
      dateClient: Date.now(),
      x_scr : evt?.x_scr || window.scrollX,
      y_scr : evt?.y_scr || window.scrollY,
      w_win : evt?.w_win || window.innerWidth,
      h_win : evt?.h_win || window.innerHeight,
      w_doc : evt?.w_doc || document.documentElement.scrollWidth,
      h_doc : evt?.h_doc || document.documentElement.scrollHeight
    };

    console.log("Neurone Logger Scroll data:\n", data);

    this.http.post("http://localhost:" + environment.neuroneProfilePort + "/logger/scroll", data).subscribe({
      next: (_ => {}),
      error: (err => {console.error(err)})
    });

  }

  @throttle(1000)
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.scrollDataParse("Scroll");
  }

  // to listen to iframe messages using see postMessage js API, compatible with neurone-search document downloader pages
  @throttle(2000)
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.data.objType === 'neurone_scroll'){
      const scrollData: NeuroneIframeScrollData = event.data.scrollData;
      this.scrollDataParse(scrollData.type, scrollData);
    }
  }

}
