import { Directive, Input, HostListener, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthService } from "../auth.service";
import { throttle } from './throttle.decorator';

@Directive({
  selector: '[neurone-logger-mouse]'
})
export class MouseDirective implements OnInit {

  handlerId = "Neurone Mouse Logger";

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
  }


  mouseDataParse(type: string, evt: MouseEvent) {

    if (!this.authService.getAuth()) {
      return;
    }

    let data = {
      logtype : "mouse",
      userId: this.authService.getUserId(),
      type  : type,
      source: this.handlerId || "Window",
      url   : window.document.URL,
      clientTimestamp: Date.now(),
      x_win : evt.clientX,
      y_win : evt.clientY,
      w_win : window.innerWidth,
      h_win : window.innerHeight,
      x_doc : evt.pageX,
      y_doc : evt.pageY,
      w_doc : document.documentElement.scrollWidth,
      h_doc : document.documentElement.scrollHeight
    };

    console.log(data);

    this.http.post("http://localhost:3002/logger", data).subscribe({
      next: (message => {console.log(message)}),
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

}
