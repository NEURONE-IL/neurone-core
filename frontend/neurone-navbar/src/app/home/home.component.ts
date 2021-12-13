import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription = new Subscription;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuth();
    // we get the login status from the service
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe( isAuthenticated => {
      // with this we update the login status in this header
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  OnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onClick() {
    console.log("works");

    const data = { email: 'hardcodedtest@asdf.com', number: Math.random()};
    this.http.post("http://localhost:3002/profile/number", data).subscribe(response => {
      console.log(response);
    });
  }

}
