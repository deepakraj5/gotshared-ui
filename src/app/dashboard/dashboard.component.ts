import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../service/file-upload.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  shortLink: string = '';
  loading: boolean = false;
  file: File | undefined;
  uploadedMedia: Array<any> = [];
  progress: boolean = false;
  viewIcon = false;
  fileType: string = '';
  isUplaod = false;
  availableFileSize = 1024;
  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  onChange(event: any) {
    const target = event.target as HTMLInputElement;
    // console.log(target.files,'target');
    this.processFiles(target.files);
  }

  onUpload() {
    // console.log('test');
    this.isUplaod = true;
    if (this.file) {
      this.loading = !this.loading;
      // console.log(this.file);
      this.fileUploadService.upload(this.file).subscribe((event: any) => {
        if (typeof event === 'object') {
          // Short link via api response
          this.shortLink = event.link;
          this.loading = false; // Flag variable
        }
      });
    }
  }

  processFiles(files: any) {
    for (const file of files) {
      console.log(file, 'file uh');
      var reader = new FileReader();
      reader.readAsDataURL(file); // read file as data url
      reader.onload = (event: any) => {
        // called once readAsDataURL is completed

        this.uploadedMedia.push({
          FileName: file.name,
          FileSize:
            this.fileUploadService.getFileSize(file.size) +
            ' ' +
            this.fileUploadService.getFileSizeUnit(file.size),
          FileType: file.type,
          FileUrl: event.target.result,
          FileProgessSize: 0,
          FileProgress: 0,
          FileModel: file.name.split('.')[1].substr(0, 3),
          ngUnsubscribe: new Subject<any>(),
        });

        if (
          this.fileUploadService.getFileSizeUnit(file.size).toLowerCase() ===
          'kb'
        ) {
          const fileSizeInKB = parseFloat(
            this.fileUploadService.getFileSize(file.size).toString()
          );

          const formattedSize = '0.' + fileSizeInKB;
          const parts = formattedSize.split('.'); // Split the concatenated value into parts
          const finalValue = parseFloat(parts.join('.')); // Combine parts into a valid number

          this.availableFileSize = this.availableFileSize - finalValue;
         
        } else {
          this.availableFileSize =
            this.availableFileSize -
            this.fileUploadService.getFileSize(file.size);
        }

        this.startProgress(file, this.uploadedMedia.length - 1);
      };
    }
  }

  async startProgress(file: any, index: number) {
    let filteredFile = this.uploadedMedia
      .filter((u, index) => index === index)
      .pop();
    // console.log( this.uploadedMedia,'filteredFile',this.fileType);
    if (filteredFile != null) {
      let fileSize = this.fileUploadService.getFileSize(file.size);
      let fileSizeInWords = this.fileUploadService.getFileSizeUnit(file.size);
      console.log(this.fileUploadService, 'this.fileUploadService');
      if (this.fileUploadService.isApiSetup) {
        let formData = new FormData();
        formData.append('File', file);

        this.fileUploadService
          .uploadMedia(formData)
          .pipe(takeUntil(file.ngUnsubscribe))
          .subscribe(
            (res: any) => {
              if (res.status === 'progress') {
                this.progress = true;
                let completedPercentage = parseFloat(res.message);
                filteredFile.FileProgessSize = `${(
                  (fileSize * completedPercentage) /
                  100
                ).toFixed(2)} ${fileSizeInWords}`;
                filteredFile.FileProgress = completedPercentage;
              } else if (res.status === 'completed') {
                filteredFile.Id = res.Id;
                filteredFile.FileProgessSize = fileSize + ' ' + fileSizeInWords;
                filteredFile.FileProgress = 100;
                this.progress = false;
              }
            },
            (error: any) => {
              this.progress = false;
              console.log('file upload error');
              console.log(error);
            }
          );
      } else {
        for (
          var f = 0;
          f < fileSize + fileSize * 0.0001;
          f += fileSize * 0.01
        ) {
          this.progress = true;
          this.viewIcon = false;
          filteredFile.FileProgessSize = f.toFixed(2) + ' ' + fileSizeInWords;
          var percentUploaded = Math.round((f / fileSize) * 100);
          filteredFile.FileProgress = percentUploaded;
          await this.fakeWaiter(Math.floor(Math.random() * 35) + 1);
          this.progress = false;
          this.viewIcon = true;
        }
      }
    }
  }

  fakeWaiter(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  removeImage(idx: number) {
    this.uploadedMedia = this.uploadedMedia.filter((u, index) => index !== idx);
  }

  sendAnother() {
    this.isUplaod = false;
  }
}
