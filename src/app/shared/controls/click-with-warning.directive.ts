import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appClickWithWarning]'
})
export class ClickWithWarningDirective implements OnInit {
  // Input und Output ergänzen:
  @Input() warning = 'Are you sure?';
  @Output() appClickWithWarning = new EventEmitter();

  // HostBinding ergänzen
  @HostBinding('class') classBinding: string | undefined;

  constructor(private elementRef: ElementRef) {}

  // HostListener ergänzen:
  @HostListener('click', ['$event.shiftKey'])
  handleClick(shiftKey: boolean): void {
    if (shiftKey || confirm(this.warning)) {
      this.appClickWithWarning.emit();
    }
  }

  ngOnInit(): void {
    // Klassen über HostBinding zuweisen:
    this.classBinding = 'btn btn-danger';
  }
}
