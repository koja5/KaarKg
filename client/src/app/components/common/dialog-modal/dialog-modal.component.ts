import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.scss'],
})
export class DialogModalComponent implements OnInit {
  @ViewChild('ejDialog') ejDialog!: DialogComponent;
  @Input() show!: boolean;
  @Input() width!: string;
  @Output() closeEventEmitter = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.returnWidth();
    setTimeout(() => {
      this.ejDialog.show();
    }, 50);
  }

  onResize(event: any) {
    this.returnWidth();
  }

  closeModal() {
    this.closeEventEmitter.emit();
  }

  public onPreventScroll = (event: any): void => {
    this.ejDialog.cssClass = 'e-fixed';
  };

  returnWidth() {
    if (window.innerWidth > 992) {
      return '35%';
    } else {
      return '100%';
    }
  }
}
