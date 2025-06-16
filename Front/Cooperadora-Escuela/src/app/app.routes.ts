import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

import { authGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component'
import { ProceduresComponent } from './pages/procedures/procedures.component';
import { Error404Component } from './pages/error404/error404.component';

import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailureComponent } from './pages/payment-failure/payment-failure.component';
import { PaymentPendingComponent } from './pages/payment-pending/payment-pending.component';
import { ProductAddComponent } from './pages/product-add/product-add.component';
import { MobileAppPromoComponent } from './pages/mobile-app-promo/mobile-app-promo.component'


export const routes: Routes = [
  // Rutas protegidas
  { path: 'home', component: HomeComponent,title: 'Inicio' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Perfil del Estudiante'  },
  { path: 'about-us', component: AboutUsComponent,canActivate: [authGuard], title: 'Quienes Somos'  },
  { path: 'contact', component: ContactComponent,canActivate: [authGuard], title: 'Contacto'  },
  { path: 'list-users', component: ListUsersComponent,canActivate: [authGuard]  },
  { path: 'products', component: ProductListComponent,canActivate: [authGuard], title: 'Productos'  },
  { path: 'cart',component:CartComponent,canActivate: [authGuard], title: 'Carrito de Compras'},
  { path: 'product-form/:id',component:ProductFormComponent,canActivate: [authGuard] },//coregir la ruta, agregarle el id
  { path: 'product-add',component:ProductAddComponent,canActivate: [authGuard] },
  { path: 'admin-panel',component:AdminPanelComponent,canActivate: [authGuard] },
  { path: 'checkout',component:CheckoutComponent,canActivate: [authGuard], title: 'Finalizar Compra' },
  { path: 'procedure',component:ProceduresComponent,canActivate: [authGuard], title: 'Cuota de Cooperadora'},
  { path: 'app-mobile',component:MobileAppPromoComponent,canActivate: [authGuard], title: 'Descargar App Móvil'},
  { path: 'success', component: PaymentSuccessComponent,canActivate: [authGuard], title: 'Pago Exitoso' },
  { path: 'failure', component: PaymentFailureComponent,canActivate: [authGuard], title: 'Pago Fallido' },
  { path: 'pending', component: PaymentPendingComponent,canActivate: [authGuard] , title: 'Pago Pendiente'},
  // Rutas públicas
  { path: '', component: HomeComponent , title: 'Inicio'},
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
  { path: 'register', component: RegisterComponent, title: 'Registrarse' },

  //  aca iria la ruta de error
  { path: '**', component:Error404Component, title: 'Página no encontrada' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
