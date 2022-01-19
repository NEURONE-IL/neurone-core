import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated = false;
  private token: string = "";
  private authStatusListener = new Subject<boolean>();
  private userId: string = "";
  private username: string = "";
  private email: string = "";
  private tokenTimer: any;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  getAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getEmail() {
    return this.email;
  }

  createUser(username: string, email: string, password: string, login?: boolean) {
    const authData: AuthData = { username: username, email: email, password: password, clientDate: Date.now() }
    // TODO: change this port to local env
    this.http.post("http://localhost:3005/auth/signup", authData).subscribe({
      next: response => {
        console.log(response);
        // auto login
        if (login){
          this.login(username, email, password);
        }
        return true;
      },
      error: (error) => {
        console.error(error);
        this.authStatusListener.next(false);
        return false;
      }
    });
  }

  login(username: string, email: string, password: string) {
    const authData: AuthData = { username: username, email: email, password: password, clientDate: Date.now() }
    this.http.post<{token: string, expiresIn: number, userId: string, username: string, email: string}>("http://localhost:3005/auth/login", authData) // TODO: change this to local env
      .subscribe({
        next: response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            // we execute this callback after the timeout (recieved in seconds) expires
            this.setAuthTimer(expiresInDuration);

            this.isAuthenticated = true;
            this.userId = response.userId;
            this.username = response.username;
            this.email = response.email;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userId, this.username, this.email);
          }
        },
        error: error => {
          console.error(error);
          this.authStatusListener.next(false);
        }
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.userId = authInformation.userId;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.username = authInformation.username;
      this.email = authInformation.email;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {

    // tell neurone-auth that the user has logged out to save to log data
    const logoutData/*: LogoutData*/ = { userId: this.getUserId(), clientDate: Date.now() }
    // TODO: change this port to local env
    this.http.post("http://localhost:3005/auth/logout", logoutData).subscribe({
      next: response => {
        console.log(response);
        return true;
      },
      error: (error) => {
        console.error(error);
        return false;
      }
    });

    this.token = "";
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = "";
    this.clearAuthData();
    // clear timer to aproach manual and automatic (from time out) logout cases
    clearTimeout(this.tokenTimer);

  }

  setAuthTimer(duration: number) {
    console.log("TIMER: " + duration);
    // set auth logout, duration is in seconds
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000 )
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    if (!token || !expirationDate || !userId || !username || !email) {
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
      email: email
    }

  }

}
