import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PersoaneModalComponent } from './persoane-modal/persoane-modal.component';
import { InterfataMasina } from '../masini/masini.component';


export interface InterfataPersoana {
    id: number;
    nume: string;
    prenume: string;
    CNP: string;
    Varsta: number;
    anul_fabricatiei: number[];
    capacitate_cilindrica: number[];
    denumire_masina: string[];
    taxa_de_impozit: number[];
    id_masini: number[];
}

@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
  styleUrls: ['./persoane.component.scss']
})
export class PersoaneComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persoane: InterfataPersoana[] = [];
  persoaneFiltrate: InterfataPersoana[] = [];

  // filtrare
  filtrareNume: string = ''
  filtrareCNP: string = ''
  filtrareVarsta: string = ''

  set _filtrareNume(value: string) {
    this.filtrareNume = value
    this.persoaneFiltrate = this.persoane.filter(p => {
      return ((p.nume.toLowerCase().includes(this.filtrareNume.toLowerCase()) || p.prenume.toLowerCase().includes(this.filtrareNume.toLowerCase())) && p.CNP.includes(this.filtrareCNP) && (Number(this.filtrareVarsta) ? Number(this.filtrareVarsta) === p.Varsta : true))
    })
  }

  set _filtrareCNP(value: string) {
    this.filtrareCNP = value
    this.persoaneFiltrate = this.persoane.filter(p => {
      return ((p.nume.toLowerCase().includes(this.filtrareNume.toLowerCase()) || p.prenume.toLowerCase().includes(this.filtrareNume.toLowerCase())) && p.CNP.includes(this.filtrareCNP) && (Number(this.filtrareVarsta) ? Number(this.filtrareVarsta) === p.Varsta : true))
    })
  }
  
  set _filtrareVarsta(value: string) {
    this.filtrareVarsta = value
    this.persoaneFiltrate = this.persoane.filter(p => {
      return ((p.nume.toLowerCase().includes(this.filtrareNume.toLowerCase()) || p.prenume.toLowerCase().includes(this.filtrareNume.toLowerCase())) && p.CNP.includes(this.filtrareCNP) && (Number(this.filtrareVarsta) ? Number(this.filtrareVarsta) === p.Varsta : true))
    })
  }

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/persoane').then(({ data }) => {
      this.persoane = data;
      this.persoaneFiltrate = data.filter(((p: InterfataPersoana) => {
        return ((p.nume.includes(this.filtrareNume) || p.prenume.includes(this.filtrareNume)) && p.CNP.includes(this.filtrareCNP) && (Number(this.filtrareVarsta) ? Number(this.filtrareVarsta) === p.Varsta : true))
      }))
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }

  addEdit = (id_persoana?: number): void => {
    const modalRef = this._modal.open(PersoaneModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_persoana = id_persoana;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (persoana: InterfataPersoana): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere persoană`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana <b>${persoana.nume} ${persoana.prenume}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/persoane/${persoana.id}`).then(() => {
        this.toastr.success('Persoana a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea persoanei!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-persoane')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-persoane', 0);
    this.limit = 70;
  }
}
