/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SurveyFormsComponent } from './survey-forms.component';

describe('SurveyFormsComponent', () => {
  let component: SurveyFormsComponent;
  let fixture: ComponentFixture<SurveyFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyFormsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
