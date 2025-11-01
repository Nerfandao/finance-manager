import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListarComponent } from './despesas/listar/listar.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'despesas', component: ListarComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
