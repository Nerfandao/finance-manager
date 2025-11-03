import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  despesas: any[] = [];
  erro: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.carregarDespesas();
  }

  carregarDespesas() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.erro = 'Usuário não autenticado';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8080/despesas', { headers }).subscribe({
      next: (data) => {
        this.despesas = data;
        this.erro = '';
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao carregar despesas';
      }
    });
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
