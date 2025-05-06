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
  userProfile: any;

  constructor(private router: Router, private profileService: ProfileService,private authService: AuthService) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserFromStorage();
  }


  logout(): void {
    this.authService.logout();
  }

  getUserProfile(): void {
    
    this.profileService.getProfile().subscribe({
     next: (profile) => this.userProfile = profile,
     error: (err) => console.error('Error al obtener el perfil', err)
    })
   }
}
