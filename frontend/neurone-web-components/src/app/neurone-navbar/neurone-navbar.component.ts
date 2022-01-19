import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from "../auth.service";

@Component({
  selector: 'neurone-navbar-component',
  templateUrl: './neurone-navbar.component.html',
  styleUrls: ['./neurone-navbar.component.css']
})
export class NeuroneNavbarComponent implements OnInit {

  userIsAuthenticated = false;
  cardMode: "hidden" | "signin" | "signup" = "hidden";
  authError = false; // to show the error message when connecting to the backend
  isLoading = false;
  loggedOut = false;
  private authListenerSubs: Subscription | undefined;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuth();
    // we get the login status from the service
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe( isAuthenticated => {
        // with this we update the login status in this header
        this.userIsAuthenticated = isAuthenticated;
        this.isLoading = false;
        this.loggedOut = false;
        if (!this.userIsAuthenticated){
          this.authError = true;
        }
      });
    this.authService.autoAuthUser();
  }

  onCardButtonClick(form: NgForm) {
    if (form.invalid){
      return;
    }

    if (this.cardMode === "signin"){
      this.isLoading = true;
      this.authService.login(form.value.username, form.value.email, form.value.password);
    } else if (this.cardMode === "signup"){
      this.isLoading = true;
      this.authService.createUser(form.value.username, form.value.email, form.value.password, true);
    }
  }

  onLogout(){
    this.authService.logout();
    this.loggedOut = true;
  }

}
