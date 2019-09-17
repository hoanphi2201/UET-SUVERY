import { Component, OnInit, Input } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';

interface MenuInterface {
  title?: string;
  icon?: string;
  routerLink?: string | object;
  children?: MenuInterface[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  @Input() data: MenuInterface[] = [];
  @Input() inlineCollapsed: boolean = false;
  @Input() mode = 'inline';

  get setting() {
    return this.layout.setting;
  }

  constructor(private layout: LayoutComponent) {}
  ngOnInit() {}
}
