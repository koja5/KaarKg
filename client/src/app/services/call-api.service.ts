import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HelpService } from './help.service';

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
    let url = api.endsWith('/') ? api + data : api + '/' + data;
    console.log(url);
    url = 'http://localhost:3001' + url;
    console.log(url);
    return this.http.get(url, { headers: this.headers });
  }

  getDocument(body: any) {
    return this.http.post('./api/upload/getDocument', body, {
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
}
