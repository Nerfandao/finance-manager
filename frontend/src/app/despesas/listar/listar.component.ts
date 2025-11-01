import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-listar',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  despesas: any[] = [];
  erro: string = '';

  constructor(private http: HttpClient) { }

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
}
