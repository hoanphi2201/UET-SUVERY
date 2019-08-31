import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'header-i18n',
  template: `
    <div nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight">
      <i nz-icon nzType="global"></i>
      {{ 'menu.lang' | translate }}
      <i nz-icon nzType="down"></i>
    </div>
    <nz-dropdown-menu #langMenu="nzDropdownMenu">
      <ul nz-menu>
        <li
          nz-menu-item
          *ngFor="let item of langs"
          [nzSelected]="item.code === curLangCode"
          (click)="change(item.code)"
        >
          <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
          {{ item.text }}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class I18nComponent {
  LANGS: any = {
    'zh-CN': {
      text: '简体中文',
      abbr: '🇨🇳'
    },
    'zh-TW': {
      text: '繁体中文',
      abbr: '🇭🇰'
    },
    'en-US': {
      text: 'English',
      abbr: '🇬🇧'
    }
  };
  langs = Object.keys(this.LANGS).map(code => {
    const item = this.LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });
}
