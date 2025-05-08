import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuProfile: any;
  isAdminUser: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.menuProfile = user;
    });
   
    this.isAdminUser = this.authService.isAdmin();// solo lo ve el admin
  }


  logout(): void {
    this.authService.logout();
  }

  getUserProfile(): void {
    
    this.authService.getUs().subscribe({
      next: (user) => this.menuProfile = user,
      error: (err) => console.error('Error al obtener el usuario', err)
    });
   }
}
