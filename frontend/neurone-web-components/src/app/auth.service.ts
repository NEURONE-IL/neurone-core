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


  createUser(email: string, password: string, login?: boolean) {
    const authData: AuthData = { email: email, password: password }
    this.http.post("http://localhost:3005/auth/signup", authData) // TODO: change this port to local env
      .subscribe(response => {
        console.log(response);
        // auto login
        if (login) {
          this.login(email, password);
        }
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3005/auth/login", authData) // TODO: change this to local env
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          // we execute this callback after the timeout (recieved in seconds) expires
          this.setAuthTimer(expiresInDuration);

          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
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
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
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

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !userId) {
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }

  }

}
