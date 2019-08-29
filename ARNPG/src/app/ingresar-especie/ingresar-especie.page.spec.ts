import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { IngresarEspeciePage } from './ingresar-especie.page';

describe('IngresarEspeciePage', () => {
  let component: IngresarEspeciePage;
  let fixture: ComponentFixture<IngresarEspeciePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresarEspeciePage ],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarEspeciePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
