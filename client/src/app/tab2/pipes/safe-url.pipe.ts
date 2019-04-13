import { Pipe, PipeTransform, Sanitizer } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string, args?: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value)
  }
}
