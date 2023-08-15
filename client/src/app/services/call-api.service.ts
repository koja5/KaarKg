import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HelpService } from './help.service';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class CallApiService {
  private headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private helpService: HelpService
  ) {
    this.headers = new HttpHeaders(this.auth.getToken);
  }

  callApi(data: any, router?: any) {
    if (data.request.type === 'POST') {
      if (data.request.url) {
        data.body = this.helpService.postRequestDataParameters(
          data.body,
          router.snapshot.params,
          data.request.url
        );
      }
      return this.callPostMethod(data.request.api, data.body);
    } else {
      if (data.request.url) {
        const dataValue = this.helpService.getRequestDataParameters(
          router.snapshot.params,
          data.request.url
        );
        return this.callGetMethod(data.request.api, dataValue);
      } else {
        const dataValue = this.helpService.getRequestDataParameters(
          router.snapshot.params,
          data.request.parameters
        );
        return this.callGetMethod(data.request.api, dataValue);
      }
    }
  }

  callServerMethod(request: any, data: any, router?: any) {
    if (request.url) {
      data = this.helpService.postRequestDataParameters(
        data,
        router.snapshot.params,
        request.url
      );
    }
    if (request.type === 'POST') {
      return this.callPostMethod(request.api, data);
    } else {
      return this.callGetMethod(request.api, data);
    }
  }

  callPostMethod(api: string, data: any) {
    return this.http.post(api, data, { headers: this.headers });
  }

  callGetMethod(api: string, data: string) {
    if (data === undefined) {
      data = '';
    }
    const url = api.endsWith('/') ? api + data : (data != "" ? (api + '/' + data) : api);
    const fullLogo = 'http://localhost:3001' + url;
    return this.http.get(fullLogo, { headers: this.headers });
  }

  getDocument(body: any) {
    return this.http.post('/api/upload/getDocument', body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  packParametarPost(data: any, fields: any) {
    let model = [];
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        model[fields[i].name] = data[fields[i].path];
      }
      return model;
    } else {
      return {};
    }
  }

  packParametarGet(data: any, fields: any) {
    let model = [];
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        model.push(data[fields[i]]);
      }
    }

    return model.toString();
  }

  checkout(products: any) {
    this.callPostMethod('/api/checkout', { items: products }).subscribe(
      async (res: any) => {
        let stripe = await loadStripe(
          'pk_test_51NSxCnAM4XTLtMHFvdV00jIFCvdKOwGIgZ42UHsUg6USFdf646wzw0EC93bLkxlXsR5nABX4bNBhflRKHVm4fVvU006rofs2Oe'
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      }
    );
  }
}
