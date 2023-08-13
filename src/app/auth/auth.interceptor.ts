import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { authService } from "./auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authSF : authService){}
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const authToken =this.authSF.getToken()
  const authReq = req.clone({
    headers :req.headers.set('authorization', "Bearer "+authToken)
  })

  return next.handle(authReq)
}
}


//: Observable<HttpEvent<any>>
