import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-adicionar',
  standalone: true,
  templateUrl: './form.component.html',
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  descricao: string = '';
  valor: number | null = null;
  valorDisplay: string = '';

  despesaId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.despesaId = +id;
        this.carregarDespesa(this.despesaId);
      }
    });
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

    let request;

    if (this.isEditMode && this.despesaId) {
      request = this.http.put(`http://localhost:8080/despesas/${this.despesaId}`, despesa, { headers });
    } else {
      request = this.http.post('http://localhost:8080/despesas', despesa, { headers });
    }

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Despesa ${this.isEditMode ? 'atualizada' : 'adicionada'} com sucesso!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/despesas']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Erro ao ${this.isEditMode ? 'atualizar' : 'adicionar'} a despesa.`
        });
      }
    });
  }
}