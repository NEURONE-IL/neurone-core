import { Directive, Input, HostListener, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Directive({
  selector: '[neurone-logger-mouse]'
})
export class MouseDirective implements OnInit {

  screenHeight = window.innerHeight;
  screenWidth = window.innerHeight;

  @Input('mouse') message : string = "Default message";
  @HostListener('mouseenter')
  mouseenter() {
    console.log("OMG It's a Mouse!!!");
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerHeight;
    console.log (this.screenHeight, this.screenWidth);
}

  mouseDataParse(event: MouseEvent) {

    let movementOutput = {
      userId: this.authService.getUserId(),
      //username:
      type: 'MouseMovement',
      url: window.location.pathname,
      //source: Element id?,

      // mouse position
      x_win: event.clientX,
      y_win: event.clientY,
      w_win: window.innerWidth, //  || event.data.e.clientWidth  || g.clientWidth,
      h_win: window.innerHeight,
      /*
      x_doc: docX,
      y_doc: docY,
      w_doc: docW,
      h_doc: docH,*/
      localTimestamp: Date.now()
    }

    console.log(movementOutput);

  }

  @HostListener('mousemove', ['$event'])
  mouseover(event: MouseEvent) {
    const data = this.mouseDataParse(event);
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent){
    const data = this.mouseDataParse(event);
  }

}
