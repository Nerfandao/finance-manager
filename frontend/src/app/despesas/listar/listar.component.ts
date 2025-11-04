import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

declare var Swal: any;

import { FormsModule } from '@angular/forms';

import { FormModalComponent } from '../form-modal/form-modal.component';

import { DraggableDirective } from '../../core/draggable.directive';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink, FormsModule, FormModalComponent, DraggableDirective],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  despesas: any[] = [];
  despesasFiltradas: any[] = [];
  erro: string = '';
  loading: boolean = false;
  totalDespesas: number = 0;
  ultimaDespesa: string = '';
  termoBusca: string = '';
  colunaOrdenacao: string = 'data';
  direcaoOrdenacao: string = 'desc';
  showModal: boolean = false;
  selectedDespesaId: number | null = null;

  @ViewChild(FormModalComponent) formModal: FormModalComponent | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.carregarDespesas();
  }

  openModal(id: number | null) {
    this.selectedDespesaId = id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDespesaId = null;
    this.carregarDespesas();
  }

  save() {
    this.formModal?.salvar();
  }

  isSaveDisabled(): boolean {
    return !this.formModal?.despesaForm.valid;
  }

  carregarDespesas() {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      this.erro = 'Usuário não autenticado';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8080/despesas', { headers }).subscribe({
      next: (data) => {
        this.despesas = data;
        this.ordenarPor('data'); // Initial sort
        this.despesasFiltradas = this.despesas;
        this.erro = '';
        this.loading = false;
        this.calcularResumo();
      },
      error: (err) => {
        console.error(err);
        this.erro = err.error?.message || 'Erro ao carregar despesas';
        this.loading = false;
      }
    });
  }

  ordenarPor(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }

    this.despesas.sort((a, b) => {
      const valorA = a[coluna];
      const valorB = b[coluna];
      const direcao = this.direcaoOrdenacao === 'asc' ? 1 : -1;

      if (typeof valorA === 'string') {
        return valorA.localeCompare(valorB) * direcao;
      } else {
        return (valorA - valorB) * direcao;
      }
    });

    this.filtrarDespesas();
  }

  filtrarDespesas() {
    if (this.termoBusca) {
      this.despesasFiltradas = this.despesas.filter(despesa =>
        despesa.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        despesa.categoria.toLowerCase().includes(this.termoBusca.toLowerCase())
      );
    } else {
      this.despesasFiltradas = this.despesas;
    }
    this.calcularResumo();
  }

  calcularResumo() {
    this.totalDespesas = this.despesasFiltradas.reduce((acc, despesa) => acc + despesa.valor, 0);
    if (this.despesasFiltradas.length > 0) {
      this.ultimaDespesa = this.despesasFiltradas[0].data;
    } else {
      this.ultimaDespesa = '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  excluirDespesa(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.erro = 'Usuário não autenticado';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8080/despesas/${id}`, { headers }).subscribe({
          next: () => {
            this.carregarDespesas();
            Swal.fire(
              'Excluído!',
              'Sua despesa foi excluída.',
              'success'
            )
          },
          error: (err) => {
            console.error(err);
            this.erro = 'Erro ao excluir despesa';
            Swal.fire(
              'Erro!',
              'Ocorreu um erro ao excluir a despesa.',
              'error'
            )
          }
        });
      }
    })
  }
}
