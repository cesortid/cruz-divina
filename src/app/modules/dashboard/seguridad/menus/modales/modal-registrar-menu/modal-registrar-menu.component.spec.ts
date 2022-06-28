import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistrarMenuComponent } from './modal-registrar-menu.component';

describe('ModalRegistrarMenuComponent', () => {
  let component: ModalRegistrarMenuComponent;
  let fixture: ComponentFixture<ModalRegistrarMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRegistrarMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegistrarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
