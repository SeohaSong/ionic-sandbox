import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImageService } from '../services/image.service'

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  constructor(
    private imageService: ImageService,
  ) { }
  
  urls = []

  ngOnInit() {
    this.imageService.initCompressInterface((blob: Blob) => {
      let url = URL.createObjectURL(blob)
      console.log(url)
      this.urls.push(url)
    })
  }

  download(url: string) {
    let img = new Image()
    let downloading_sub = fromEvent(img, 'load').pipe(
      map(e => {
        let img = <HTMLImageElement>e.target
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        let link = document.createElement("a")
        link.href = canvas.toDataURL('image/jpg')
        link.download = url.substring(url.lastIndexOf('/')+1)
        link.click()
        downloading_sub.unsubscribe()
      })
    ).subscribe()
    img.crossOrigin = 'anonymous'
    img.setAttribute('src', url)
  }
}
