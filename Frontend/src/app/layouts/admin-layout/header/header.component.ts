import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() collapsedDesktopEvent = new EventEmitter<boolean>();
  @Output() collapsedMobileEvent = new EventEmitter<boolean>();
  isCollapsedDesktop = false;
  isCollapsedMobile = false;
  constructor() {}

  ngOnInit() {}
  toggleCollapsedDesktop() {
    this.isCollapsedDesktop = !this.isCollapsedDesktop;
    this.collapsedDesktopEvent.emit(this.isCollapsedDesktop);
  }
  toggleCollapsedMobile() {
    this.isCollapsedMobile = !this.isCollapsedMobile;
    this.collapsedMobileEvent.emit(this.isCollapsedMobile);
  }
}
