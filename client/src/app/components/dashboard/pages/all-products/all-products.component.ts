import { Component, OnInit, ViewChild } from '@angular/core';
import { detach } from '@syncfusion/ej2-base';
import { UploaderComponent, FileInfo, SelectedEventArgs } from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

  @ViewChild('defaultupload')
    public uploadObj!: UploaderComponent;
    public path: Object = {
      saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
      removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove' };
    constructor() {
    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
     ngAfterViewInit() {
      document.getElementById('browse')!.onclick = function() {
      document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click();
        return false;
      }
      document.getElementById('dropArea')!.onclick = (e: any) => {
            let target: HTMLElement = <HTMLElement>e.target;
            if (target.classList.contains('e-file-delete-btn')) {
                for (let i: number = 0; i < this.uploadObj.getFilesData().length; i++) {
                    if (target.closest('li')!.getAttribute('data-file-name') === this.uploadObj.getFilesData()[i].name) {
                        this.uploadObj.remove(this.uploadObj.getFilesData()[i]);
                    }
                }
            }
            else if (target.classList.contains('e-file-remove-btn')) {
                detach(target.closest('li')!);
            }
        }
    }
   public parentElement! : HTMLElement;
    public progressbarContainer! : HTMLElement;
    public filesDetails : FileInfo[] = [];
    public filesList: HTMLElement[] = [];
    public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;
    public onFileUpload(args: any) {
    // let li: HTMLElement = this.uploadObj.uploadWrapper.querySelector('[data-file-name="' + args.file.name + '"]');
    // let progressValue: number = Math.round((args.e.loaded / args.e.total) * 100);
    // li.getElementsByTagName('progress')[0].value = progressValue;
    // li.getElementsByClassName('percent')[0].textContent = progressValue.toString() + " %";
  }
  public onuploadSuccess(args: any) {
    if (args.operation === 'remove') {
        let height: string = document.getElementById('dropArea')!.style.height;
        height = (parseInt(height) - 40) + 'px';
        document.getElementById('dropArea')!.style.height = height;
    } else {
        // let li: HTMLElement = this.uploadObj.uploadWrapper.querySelector('[data-file-name="' + args.file.name + '"]');
        // let progressBar: HTMLElement = li.getElementsByTagName('progress')[0];
        // progressBar.classList.add('e-upload-success');
        // li.getElementsByClassName('percent')[0].classList.add('e-upload-success');
        let height: string = document.getElementById('dropArea')!.style.height;
        document.getElementById('dropArea')!.style.height = parseInt(height) - 15 + 'px';
    }
}
public onuploadFailed(args: any) {
    // let li: HTMLElement = this.uploadObj.uploadWrapper.querySelector('[data-file-name="' + args.file.name + '"]');
    // let progressBar: HTMLElement = li.getElementsByTagName('progress')[0];
    // progressBar.classList.add('e-upload-failed');
    // li.getElementsByClassName('percent')[0].classList.add('e-upload-failed');
}
public onSelect(args: SelectedEventArgs) {
    // let length: number = args.filesData.length;
    // let height: string = document.getElementById('dropArea').style.height;
    // height = parseInt(height) + (length * 55) + 'px';
    // document.getElementById('dropArea').style.height = height;
}

}
