import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-ver-producer-modal',
    templateUrl: './ver-modal.component.html',
    standalone: true,
    styles: [],
    imports: [
      CommonModule,
    ],
    providers: []
  })
  
  
  export class VerProducersModalComponent implements OnInit {

    @Input() data: any;
    
    company: any;

    readonly activeModal: NgbActiveModal = inject(NgbActiveModal);

    constructor() { 
        
    } 

    async ngOnInit() {
        this.company = await this.data;
    }
  }