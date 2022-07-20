import { Directive, HostListener, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthService } from "../auth.service";
import { throttle } from './throttle.decorator';
import { NeuroneConfig } from "../neurone-components-config";

interface NeuroneIframeMouseData {
  type: string,
  url: string,
  clientX : number,
  clientY : number,
  pageX : number,
  pageY : number
}

interface NeuroneIframeWindowData {
  url: string,
  w_win : number,
  h_win : number,
  w_doc : number,
  h_doc : number
}

@Directive({
  selector: '[neurone-logger-mouse]'
})
export class MouseLogDirective implements OnInit {

  handlerId = "Neurone Mouse Logger";

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
  }


  mouseDataParse(type: string, evt: MouseEvent | NeuroneIframeMouseData, windowData?: NeuroneIframeWindowData) {

    if (!this.authService.getAuth()) {
      return;
    }

    let data = {
      userId: this.authService.getUserId(),
      type  : type,
      source: this.handlerId,
      url   : windowData?.url || window.document.URL,
      dateClient: Date.now(),
      x_win : evt.clientX,
      y_win : evt.clientY,
      w_win : windowData?.w_win || window.innerWidth,
      h_win : windowData?.h_win || window.innerHeight,
      x_doc : evt.pageX,
      y_doc : evt.pageY,
      w_doc : windowData?.w_doc || document.documentElement.scrollWidth,
      h_doc : windowData?.h_doc || document.documentElement.scrollHeight
    };

    console.log("Neurone Logger Mouse data:\n", data);

    this.http.post("http://localhost:" + NeuroneConfig.neuroneProfilePort + "/logger/mouse", data).subscribe({
      next: (_ => {}),
      error: (err => {console.error(err)})
    });

    return;

  }

  @throttle(2000)
  @HostListener('mousemove', ['$event'])
  mouseover(event: MouseEvent) {
    this.mouseDataParse("MouseMove", event);
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent){
    this.mouseDataParse("MouseClick", event);
  }

  @HostListener('mouseenter', ['$event'])
  mouseenter(event: MouseEvent) {
    this.mouseDataParse("MouseEnter", event);
  }

  // to listen to iframe messages using see postMessage js API, compatible with neurone-search document downloader pages
  // TODO: only throttle mouse move
  @throttle(2000)
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.data.objType === 'neurone_mouse' && event.data.mouseData.type !== 'MouseMove'){
      const mouseData: NeuroneIframeMouseData = event.data.mouseData;
      const windowData: NeuroneIframeWindowData = event.data.windowData;
      this.mouseDataParse(mouseData.type, mouseData, windowData);
    }
  }

}
