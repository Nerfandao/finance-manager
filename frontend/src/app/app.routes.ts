import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListarComponent } from './despesas/listar/listar.component';
import { RegistroComponent } from './components/registro/registro.component';

import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'despesas', component: ListarComponent, canActivate: [AuthGuard] },
    { path: 'registro', component: RegistroComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
