import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InterfataMasina } from '../masini.component';

@Component({
  selector: 'app-information-modal',
  templateUrl: './masini-modal.component.html'
})
export class MasiniModalComponent implements OnInit {
  @Input() id_masina: number | undefined;

  modal = {} as InterfataMasina;
  campuriIncorecte = [] as Number[]
  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_masina) {
      this._spinner.show();
      axios.get(`/api/masini/${this.id_masina}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea mașinii!'));
    }
  }

  save(): void {
    if(!this.modal.Denumire_marca || this.modal.Denumire_marca.length > 255) {
      this.toastr.error('Marcă invalidă!')
      this.campuriIncorecte.push(0)
    }
    if(!this.modal.Denumire_model || this.modal.Denumire_model.length > 255) {
      this.toastr.error('Model invalid!')
      this.campuriIncorecte.push(1)
    }
    if(!this.modal.Anul_fabricatiei || this.modal.Anul_fabricatiei > (new Date().getFullYear())) {
      this.toastr.error('An fabricație invalid!')
      this.campuriIncorecte.push(2)
    }
    if(!this.modal.Capacitate_cilindrica || this.modal.Capacitate_cilindrica > 9999) {
      this.toastr.error('Capacitate cilindrică invalidă!')
      this.campuriIncorecte.push(3)
    }
    if(this.campuriIncorecte.length > 0)
      return;
    this._spinner.show();
    let taxa = this.modal.Capacitate_cilindrica < 1500 ? 50 : this.modal.Capacitate_cilindrica < 2000 ? 100 : 200
    this.modal = {...this.modal, Taxa_de_impozit: taxa}
    if (!this.id_masina) {
      axios.post('/api/masini', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Mașina a fost adăugată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea mașinii!'));
    } else {
      axios.put('/api/masini', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Mașina a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea mașinii!'));
    }
  }

}
