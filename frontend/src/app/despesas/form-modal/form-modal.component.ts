import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-form-modal',
  standalone: true,
  templateUrl: './form-modal.component.html',
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit {
  @Input() despesaId: number | null = null;
  @Output() formClosed = new EventEmitter<void>();

  descricao: string = '';
  valor: number | null = null;
  valorDisplay: string = '';
  data: string = '';
  categoria: string = '';

  isEditMode: boolean = false;

  @ViewChild('despesaForm') despesaForm: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.despesaId) {
      this.isEditMode = true;
      this.carregarDespesa(this.despesaId);
    }
  }

  onValorChange(event: any) {
    const unformattedValue = event.replace(/[^0-9,-]+/g, '').replace(',', '.');
    this.valor = parseFloat(unformattedValue);
  }

  formatValor() {
    if (this.valor !== null) {
      this.valorDisplay = this.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
      this.valorDisplay = '';
    }
  }

  unformatValor() {
    if (this.valorDisplay) {
      const unformatted = this.valorDisplay.replace(/[R$.,]/g, '').replace(/\s/g, '').replace(',', '.');
      this.valor = parseFloat(unformatted);
      this.valorDisplay = this.valor.toString(); // Display as raw number for editing
    }
  }

  carregarDespesa(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:8080/despesas/${id}`, { headers }).subscribe({
      next: (data) => {
        this.descricao = data.descricao;
        this.valor = data.valor;
        this.formatValor();
        this.data = new Date(data.data).toISOString().split('T')[0];
        this.categoria = data.categoria;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erro!', 'Não foi possível carregar os dados da despesa.', 'error');
      }
    });
  }

  salvar() {
    if (this.valor === null) {
      this.valor = 0;
    }
    const despesa = {
      descricao: this.descricao,
      valor: this.valor,
      data: this.data,
      categoria: this.categoria
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    Swal.fire({
      title: 'Salvando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let request;

    if (this.isEditMode && this.despesaId) {
      request = this.http.put(`http://localhost:8080/despesas/${this.despesaId}`, despesa, { headers });
    } else {
      request = this.http.post('http://localhost:8080/despesas', despesa, { headers });
    }

    request.subscribe({
      next: () => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Despesa ${this.isEditMode ? 'atualizada' : 'adicionada'} com sucesso!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.formClosed.emit();
        });
      },
      error: (err) => {
        Swal.close();
        console.error(err);
        if (err.status === 400 && err.error) {
          let errorMessages = '';
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errorMessages += `${err.error[key]}<br>`;
            }
          }
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: errorMessages
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Erro ao ${this.isEditMode ? 'atualizar' : 'adicionar'} a despesa.`
          });
        }
      }
    });
  }
