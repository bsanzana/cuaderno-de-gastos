import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarModalComponent } from './editar-modal.component';

describe('EditarModalComponent', () => {
  let component: EditarModalComponent;
  let fixture: ComponentFixture<EditarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
