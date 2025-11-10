import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

}) export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    if (!this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    const body = {
      email: this.email, senha: this.senha
    }

    this.http.post('http://localhost:8080/auth/login', body).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/despesas']);
      },
      error: () => {
        this.erro = 'E-mail ou senha inválidos';
      }
    });
  }
}