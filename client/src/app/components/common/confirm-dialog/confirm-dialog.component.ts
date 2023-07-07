import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  @ViewChild('ejDialog') public ejDialog!: DialogComponent;

  ngOnInit() {
  }

  public animationSettings: Object = {
    effect: 'Zoom',
    duration: 400,
    delay: 0,
  };

  public showCloseIcon: boolean = true;

  public showDialog() {
    this.ejDialog.show();
  }

  public buttons: Object = [
    {
      click: '',
      buttonModel: {
        content: 'Yes',
        iconCss: 'e-icons e-ok-icon',
        isPrimary: true,
      },
    },
    {
      click: '',
      buttonModel: {
        content: 'No',
        iconCss: 'e-icons e-close-icon',
      },
    },
  ];
}
