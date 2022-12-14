import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MasiniModalComponent } from './masini-modal/masini-modal.component';


export interface InterfataMasina{
  id: number;
  Denumire_marca: string;
  Denumire_model: string;
  Anul_fabricatiei: number;
  Capacitate_cilindrica: number;
  Taxa_de_impozit: number;
  Denumire?: string;
}

@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss']
})
export class MasiniComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  masini: InterfataMasina[] = [];
  masiniFiltrate: InterfataMasina[] = []


  // filtrare

  filtrareMarca: string = ''
  filtrareModel: string = ''
  filtrareAn: string = ''
  filtrareCapacitate: string = ''
  filtrareTaxa: string = ''

  set _filtrareMarca(value: string) {
    this.filtrareMarca = value
    this.masiniFiltrate = this.masini.filter(m => {
      return (
        m.Denumire_marca.toLowerCase().includes(this.filtrareMarca.toLowerCase()) && m.Denumire_model.toLowerCase().includes(this.filtrareModel.toLowerCase()) &&
        (
          Number(this.filtrareAn) ? m.Anul_fabricatiei = Number(this.filtrareAn) : true
        ) &&
        (
          Number(this.filtrareCapacitate) ? m.Capacitate_cilindrica = Number(this.filtrareCapacitate) : true
        ) &&
        (
          Number(this.filtrareTaxa) ? m.Taxa_de_impozit = Number(this.filtrareTaxa) : true
        ) 
      )
    })
  }
  set _filtrareModel(value: string) {
    this.filtrareModel = value
    this.masiniFiltrate = this.masini.filter(m => {
      return (
        m.Denumire_marca.toLowerCase().includes(this.filtrareMarca.toLowerCase()) && m.Denumire_model.toLowerCase().includes(this.filtrareModel.toLowerCase()) && 
        (
          Number(this.filtrareAn) ? m.Anul_fabricatiei = Number(this.filtrareAn) : true
        ) &&
        (
          Number(this.filtrareCapacitate) ? m.Capacitate_cilindrica = Number(this.filtrareCapacitate) : true
        ) &&
        (
          Number(this.filtrareTaxa) ? m.Taxa_de_impozit = Number(this.filtrareTaxa) : true
        ) 
      )
    })
  }
  set _filtrareAn(value: string) {
    this.filtrareAn = value
    this.masiniFiltrate = this.masini.filter(m => {
      return (
        m.Denumire_marca.toLowerCase().includes(this.filtrareMarca.toLowerCase()) && m.Denumire_model.toLowerCase().includes(this.filtrareModel.toLowerCase()) &&
        (
          Number(this.filtrareAn) ? m.Anul_fabricatiei === Number(this.filtrareAn) : true
        ) &&
        (
          Number(this.filtrareCapacitate) ? m.Capacitate_cilindrica = Number(this.filtrareCapacitate) : true
        ) &&
        (
          Number(this.filtrareTaxa) ? m.Taxa_de_impozit === Number(this.filtrareTaxa) : true
        ) 
      )
    })
  }
  set _filtrareCapacitate(value: string) {
    this.filtrareCapacitate = value
    this.masiniFiltrate = this.masini.filter(m => {
      return (
        m.Denumire_marca.toLowerCase().includes(this.filtrareMarca.toLowerCase()) && m.Denumire_model.toLowerCase().includes(this.filtrareModel.toLowerCase()) &&
        (
          Number(this.filtrareAn) ? m.Anul_fabricatiei === Number(this.filtrareAn) : true
        ) &&
        (
          Number(this.filtrareCapacitate) ? m.Capacitate_cilindrica === Number(this.filtrareCapacitate) : true
        ) &&
        (
          Number(this.filtrareTaxa) ? m.Taxa_de_impozit === Number(this.filtrareTaxa) : true
        ) 
      )
    })
  }
  set _filtrareTaxa(value: string) {
    this.filtrareTaxa = value
    this.masiniFiltrate = this.masini.filter(m => {
      return (
        m.Denumire_marca.toLowerCase().includes(this.filtrareMarca.toLowerCase()) && m.Denumire_model.toLowerCase().includes(this.filtrareModel.toLowerCase()) &&
        (
          Number(this.filtrareAn) ? m.Anul_fabricatiei === Number(this.filtrareAn) : true
        ) &&
        (
          Number(this.filtrareCapacitate) ? m.Capacitate_cilindrica === Number(this.filtrareCapacitate) : true
        ) &&
        (
          Number(this.filtrareTaxa) ? m.Taxa_de_impozit === Number(this.filtrareTaxa) : true
        ) 
      )
    })
  }

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/masini').then(({ data }) => {
      this.masini = data
      this.masiniFiltrate = data.filter((m: InterfataMasina) => {
        return (
          m.Denumire_marca.toLowerCase().includes(this.filtrareMarca.toLowerCase()) && m.Denumire_model.toLowerCase().includes(this.filtrareModel.toLowerCase()) &&
          (
            Number(this.filtrareAn) ? m.Anul_fabricatiei === Number(this.filtrareAn) : true
          ) &&
          (
            Number(this.filtrareCapacitate) ? m.Capacitate_cilindrica === Number(this.filtrareCapacitate) : true
          ) &&
          (
            Number(this.filtrareTaxa) ? m.Taxa_de_impozit === Number(this.filtrareTaxa) : true
          ) 
        )
      })
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informa??iilor!'));
  }

  addEdit = (id_masina?: number): void => {
    const modalRef = this._modal.open(MasiniModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_masina = id_masina;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (masina: InterfataMasina): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `??tergere ma??in??`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Dori??i s?? ??terge??i ma??ina <b>${masina.Denumire_marca} ${masina.Denumire_model}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/masini/${masina.id}`).then(() => {
        this.toastr.success('Masina a fost ??tears?? cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ??tergerea ma??inii!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-informations', 0);
    this.limit = 70;
  }
}
