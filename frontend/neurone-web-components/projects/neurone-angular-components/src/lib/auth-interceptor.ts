import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.authService.getToken();
    // clone has to be used to not make unwanted side effects in the request
    const authRequest = req.clone({
      // here we can immediately edit this clone
      // Bearer in the string is just a convention, it can be done anyway we want
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
