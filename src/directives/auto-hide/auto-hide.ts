
// from Samarth Agarwal: Auto-hide Floating Action Button in Ionic 3
import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  selector: '[auto-hide]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class AutoHideDirective {

  fabToHide:    HTMLElement;
  oldScrollTop: number = 0;

  constructor(  private renderer: Renderer, 
                private element:  ElementRef ) {
    console.log('Hello AutoHideDirective Directive');
  }

  ngOnInit() {
    this.fabToHide = this.element.nativeElement.getElementsByClassName("fabautohide")[0];
    this.renderer.setElementStyle(this.fabToHide, 'webkitTransition', 'transform 500ms, opacity 500ms');
  }

  onContentScroll( e ) {
    if(e.scrollTop - this.oldScrollTop > 10){
      console.log("DOWN");
      this.renderer.setElementStyle(this.fabToHide, 'opacity', '0');
      this.renderer.setElementStyle(this.fabToHide, 'webkitTransform', 'scale3d(.1,.1,.1)');
    } else if(e.scrollTop - this.oldScrollTop < 0){
      console.log("UP");
      this.renderer.setElementStyle(this.fabToHide, 'opacity', '1');
      this.renderer.setElementStyle(this.fabToHide, 'webkitTransform', 'scale3d(1,1,1)');
    }

    this.oldScrollTop = e.scrollTop;
  }

}
