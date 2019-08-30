import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  collapedSideBarDesktop: boolean;
  collapedSideBarMobile: boolean;
  constructor() {}

  ngOnInit() {}
  receiveCollapsedDesktop($event: any) {
    this.collapedSideBarDesktop = $event;
  }
  receiveCollapsedMobile($event: any) {
    this.collapedSideBarDesktop = false;
    this.collapedSideBarMobile = $event;
  }
  ngOnDestroy() {}
  displaySideBar() {
    return {
      'is-folded': this.collapedSideBarDesktop,
      'is-expand': this.collapedSideBarMobile
    };
  }
}
