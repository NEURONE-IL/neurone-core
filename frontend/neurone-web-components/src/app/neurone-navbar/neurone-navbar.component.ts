import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-neurone-navbar',
  templateUrl: './neurone-navbar.component.html',
  styleUrls: ['./neurone-navbar.component.css']
})
export class NeuroneNavbarComponent implements OnInit {

  // for parameters in HTML
  @Input() a: number = 0;
  userIsAuthenticated = false;
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    console.log("From HTML: " + this.a);
  }

  onLogin(form: NgForm) {
    if (form.invalid){
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  onLogout(){
    console.log("TODO");
  }

}
