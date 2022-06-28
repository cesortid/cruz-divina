import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistroPerfilComponent } from './modal-registro-perfil.component';

describe('ModalRegistroPerfilComponent', () => {
  let component: ModalRegistroPerfilComponent;
  let fixture: ComponentFixture<ModalRegistroPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRegistroPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegistroPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
