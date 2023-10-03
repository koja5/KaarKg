import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CallApiService } from 'src/app/services/call-api.service';
import { HelpService } from 'src/app/services/help.service';
import { StorageService } from 'src/app/services/storage.service';
import { EmitType } from '@syncfusion/ej2-base';
import { MessageService } from 'src/app/services/message.service';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, firstValueFrom, isObservable, of, tap } from 'rxjs';
import { CoreModule } from '../../routing-module/core.module';
import { TransferHttpService } from '@gorniv/ngx-universal';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Input() searchProduct!: string;
  public products: any;
  public category!: string;
  public item: any;
  public language: any;
  public accountType: any;
  public loader = false;
  public result!: any;

  constructor(
    private service: CallApiService,
    private https: TransferHttpService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private helpService: HelpService,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: string,
    private hm: CoreModule
  ) {
    this.category = this.route.snapshot.paramMap.get('category')!;

    // this.initialize();
    this.router.events.forEach(async (event: any) => {
      if (event.routerEvent) {
        // this.http
        //   .get<any>('http://localhost:4200/api/getAllNewProducts/')
        //   .subscribe((data: any) => {
        //     this.products = data;
        //     this.loader = false;
        //   });
      }
    });
  }

  ngOnInit(): void {
    // this.http
    //   .get('http://localhost:3001/api/getUsers')
    //   .subscribe((result: any) => {
    //     this.result = result;
    //   });

    this.http
      .get('http://localhost:3001/api/getUsers')
      .subscribe((data: any) => {
        this.result = data;
      });
  }
}
