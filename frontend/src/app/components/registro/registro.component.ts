import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nome = '';
  email = '';
  senha = '';
  erro = '';

  constructor(private http: HttpClient, private router: Router) { }

  registrar() {
    if (!this.nome || !this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    const usuario = {
      nome: this.nome,
      email: this.email,
      senha: this.senha
    };

    this.http.post('http://localhost:8080/usuarios', usuario).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao criar conta.';
        console.error(err);
      }
    });
  }
}
