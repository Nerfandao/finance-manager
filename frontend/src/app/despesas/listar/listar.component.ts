import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

declare var Swal: any;

import { FormsModule } from '@angular/forms';

import { FormModalComponent } from '../form-modal/form-modal.component';

import { DraggableDirective } from '../../core/draggable.directive';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, FormModalComponent, DraggableDirective],
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

  // Filtros
  categorias: string[] = [];
  meses = [
    { valor: 1, nome: 'Janeiro' }, { valor: 2, nome: 'Fevereiro' }, { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' }, { valor: 5, nome: 'Maio' }, { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' }, { valor: 8, nome: 'Agosto' }, { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' }, { valor: 11, nome: 'Novembro' }, { valor: 12, nome: 'Dezembro' }
  ];
  categoriaSelecionada: string = '';
  mesSelecionado: number | string = '';
  anoSelecionado: number | string = '';

  @ViewChild(FormModalComponent) formModal: FormModalComponent | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.colunaOrdenacao = 'data';
    this.direcaoOrdenacao = 'desc';
    this.carregarDespesas();
    this.carregarCategorias();
  }

  openModal(id: number | null) {
    this.selectedDespesaId = id;
    this.showModal = true;
  }

  handleModalClose(shouldReload: boolean) {
    this.showModal = false;
    this.selectedDespesaId = null;
    if (shouldReload) {
      this.carregarDespesas();
      this.carregarCategorias();
    }
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
        this.aplicarOrdenacao();
        this.filtrarDespesas();
        this.erro = '';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = err.error?.message || 'Erro ao carregar despesas';
        this.loading = false;
      }
    });
  }

  carregarCategorias() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<string[]>('http://localhost:8080/despesas/categorias', { headers }).subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
      }
    });
  }

  validarAno(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Remove non-digit characters
    value = value.replace(/\D/g, '');

    // Limit to 4 digits
    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    // Update the input value and model
    inputElement.value = value;
    this.anoSelecionado = value;

    // Trigger filtering
    this.filtrarDespesas();
  }

  ordenarPor(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }

    this.aplicarOrdenacao();
    this.filtrarDespesas();
  }

  private aplicarOrdenacao() {
    this.despesas.sort((a, b) => {
      const valorA = a[this.colunaOrdenacao];
      const valorB = b[this.colunaOrdenacao];
      const direcao = this.direcaoOrdenacao === 'asc' ? 1 : -1;

      if (typeof valorA === 'string') {
        return valorA.localeCompare(valorB) * direcao;
      } else {
        return (valorA - valorB) * direcao;
      }
    });
  }

  filtrarDespesas() {
    let despesasFiltradas = this.despesas;

    if (this.termoBusca) {
      despesasFiltradas = despesasFiltradas.filter(despesa =>
        despesa.descricao.toLowerCase().includes(this.termoBusca.toLowerCase())
      );
    }

    if (this.categoriaSelecionada) {
      despesasFiltradas = despesasFiltradas.filter(despesa =>
        despesa.categoria === this.categoriaSelecionada
      );
    }

    if (this.mesSelecionado) {
      despesasFiltradas = despesasFiltradas.filter(despesa => {
        const mesDespesa = new Date(despesa.data).getMonth() + 1;
        return mesDespesa === Number(this.mesSelecionado);
      });
    }

    if (this.anoSelecionado) {
      despesasFiltradas = despesasFiltradas.filter(despesa => {
        const anoDespesa = new Date(despesa.data).getFullYear();
        return anoDespesa === Number(this.anoSelecionado);
      });
    }

    this.despesasFiltradas = despesasFiltradas;
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
