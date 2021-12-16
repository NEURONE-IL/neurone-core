import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-neurone-navbar',
  templateUrl: './neurone-navbar.component.html',
  styleUrls: ['./neurone-navbar.component.css']
})
export class NeuroneNavbarComponent implements OnInit {

  userIsAuthenticated = false;
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm) {
    console.log("works, WIP");
  }

  onLogout(){
    console.log("TODO");
  }

}
