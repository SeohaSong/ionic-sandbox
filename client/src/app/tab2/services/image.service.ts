import { Injectable } from '@angular/core';
import { of, fromEvent, from, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor() { }

  initCompressInterface(callbackFunc) {
    let interface_sub$ = of(document.getElementById('file')).pipe(
      mergeMap(this.getFiles),
      mergeMap(this.getBase64),
      mergeMap(this.getImage),
      mergeMap(this.getCompressedBlob_(220, 'image/jpg')),
    )
    interface_sub$.subscribe(callbackFunc)
  }
  getFiles(obj: HTMLInputElement) {
    return fromEvent(obj, 'change').pipe(
      mergeMap(e => from((<HTMLInputElement>e.target).files)),
      map((file: File) => new Blob([file])),
    )
  }
  getBase64(blob: Blob) {
    let reader = new FileReader()
    let sub$ = fromEvent(reader, 'load').pipe(map((e: any) => e.target.result))
    reader.readAsDataURL(blob)
    return sub$
  }
  getImage(url: string) {
    let image = new Image()
    let sub$ = fromEvent(image, 'load').pipe(map(e => e.target))
    image.setAttribute('src', url)
    return sub$
  }
  getCompressedBlob_(size: number, type: string) {
    let getCompressedBlob = (img: HTMLImageElement) => {
      let [width, height] = [img.width, img.height]
      if (width > height) [width, height] = [size, height*size/width]
      else [width, height] = [width*size/height, size]
      let canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      return new Observable(o => canvas.toBlob(blob => o.next(blob), type, 1))
    }
    return getCompressedBlob
  }
}
