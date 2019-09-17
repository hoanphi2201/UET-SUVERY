/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NoticePopoverComponent } from './notice-popover.component';

describe('NoticePopoverComponent', () => {
  let component: NoticePopoverComponent;
  let fixture: ComponentFixture<NoticePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoticePopoverComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
