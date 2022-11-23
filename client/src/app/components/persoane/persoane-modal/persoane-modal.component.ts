import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InterfataMasina } from '../../masini/masini.component';
import { InterfataPersoana } from '../persoane.component';

@Component({
  selector: 'app-information-modal',
  templateUrl: './persoane-modal.component.html'
})
export class PersoaneModalComponent implements OnInit {
  @Input() id_persoana: number | undefined;

  modal = {} as InterfataPersoana;
  cars: InterfataMasina[] = [];
  selectedCar = [] as Number[]
  valoriDefault = [] as Number[]
  campuriIncorecte = [] as Number[]

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_persoana) {
      this._spinner.show();
      axios.get(`/api/persoane/${this.id_persoana}`).then(({ data }) => {
        this.modal = data;
        data.id_masini.map((d: number) => {
          this.selectedCar = [...this.selectedCar, d]
          this.valoriDefault = [...this.valoriDefault, d]
        })
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea persoanei!'));
    }
    axios.get(`/api/masini`).then(({data}) => {
      this.cars = data.map((d: InterfataMasina) => ({...d, Denumire: `${d.Denumire_marca} ${d.Denumire_model}`}))
    })
  }

  save(): void {
    this.campuriIncorecte = []
    if(!this.modal.nume || this.modal.nume.length > 255) {
      this.toastr.error('Nume invalid!')
      this.campuriIncorecte.push(0)
    }
    if(!this.modal.prenume || this.modal.prenume.length > 255) {
      this.toastr.error('Prenume invalid!')
      this.campuriIncorecte.push(1)
    }
    if(!this.modal.CNP) {
      this.toastr.error('Nu ai introdus CNP-ul!')
      this.campuriIncorecte.push(2)
    }
    if(this.modal.CNP.length !== 13) {
      this.toastr.error('CNP-ul este incorect!')
      this.campuriIncorecte.push(3)
    }
    let extragAn = this.modal.CNP[0] === '1' || this.modal.CNP[0] === '2' ? Number(this.modal.CNP.slice(1, 3)) + 1900 : Number(this.modal.CNP.slice(1, 3)) + 2000,
    extragLuna = this.modal.CNP.slice(3, 5),
    extragZi = this.modal.CNP.slice(5, 7)
    if(Number(extragLuna) <= 0 || Number(extragLuna) > 12 || Number(extragZi) <= 0 || Number(extragZi) > 31) {
      this.toastr.error('CNP invalid')
      this.campuriIncorecte.push(3)
    }
    if(this.campuriIncorecte.length > 0)
      return;
    this._spinner.show();
    let varsta: number = Math.floor((new Date().getTime() - new Date(`${extragLuna}/${extragZi}/${extragAn}`).getTime())/31536000000) || 0
    this.modal = {...this.modal, Varsta: varsta}
    if (!this.id_persoana) {
      axios.post('/api/persoane', this.modal).then(({data}) => {
        this._spinner.hide();
        this.selectedCar.map((car) => {
          console.log(car)
          axios.post('/api/jonctiune', {id_person: data.rowId, id_car: car}).then(() => {
          }).catch(() => console.log('eroare la jonctiune'))
        })
        this.toastr.success('Persoana a fost adăugată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la salvarea persoanei!'));
    } else {
      this.valoriDefault.map((car) => {
        if(!this.selectedCar.includes(car))
          axios.delete(`/api/jonctiune/${this.id_persoana}/${car}`)
      })
      this.selectedCar.map((car) => {
        axios.post('/api/jonctiune', {id_person: this.id_persoana, id_car: car}).then(() => {
        }).catch(() => console.log('eroare la jonctiune'))
      }
      )
      axios.put('/api/persoane', this.modal).then(() => {
        this._spinner.hide();
        this.toastr.success('Persoana a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea persoanei!'));
    }
  }

}
