import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
  ],

}) export class LoginComponent {
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const body = {
      email: this.email, senha: this.senha
    }

      ;

    this.http.post('http://localhost:8080/auth/login', body).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/despesas']);
      }

      ,
      error: () => {
        this.erro = 'E-mail ou senha inválidos';
      }
    });
  }
}