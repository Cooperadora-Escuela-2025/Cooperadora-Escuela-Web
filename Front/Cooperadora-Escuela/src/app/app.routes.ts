import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ListUsersComponent } from './pages/list-users/list-users.component';


export const routes: Routes = [
    // con restriccion
    
    { path: 'home',component:HomeComponent , canActivate: [authGuard] },
    { path: 'about-us', component: AboutUsComponent  },
    { path: 'contact', component: ContactComponent },
    {path:'profile',component:ProfileComponent, canActivate: [authGuard] },
    
 


    {path:'list-users',component:ListUsersComponent},
    // rutas publicas
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path:'register',component:RegisterComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
