import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { LayoutComponent } from '@app/layouts/shared/layout/layout.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.less'],
  host: {
    '[class.wide]': 'isWide',
    '[attr.mode]': 'mode'
  }
})
export class PageComponent implements OnInit {
  private data = {
    title: '',
    region: { sider: false, header: false, content: true, footer: false }
  };

  @Input() header: TemplateRef<void> | null = null;
  @Input() mode: string = 'layout';

  @Input()
  get title(): string {
    return this.data.title;
  }
  set title(val: string) {
    this.data.title = val;
    this.pageTitle.setTitle(val);
  }

  @Input()
  get region() {
    return this.data.region;
  }
  set region(val) {
    this.data.region = val;
    this.layout.region = val;
  }

  get isWide(): boolean {
    return this.layout.setting.mode == 'top' && this.layout.setting.fixedWidth;
  }

  constructor(private layout: LayoutComponent, private pageTitle: Title) {
    this.region = { sider: true, header: true, content: true, footer: true };
  }
  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.title) {
      this.title = '';
    }
  }
}
