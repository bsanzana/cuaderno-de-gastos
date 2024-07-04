import { Component, OnInit, inject } from '@angular/core';
// import { NotificationsService } from 'angular2-notifications';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ]
})
export class UsersComponent implements OnInit {

  constructor(
    // private notificationsService : NotificationsService,
    private router               : Router,
  ) {  }

  ngOnInit() {
    this.router.navigate(['/administracion/gestion/productores']);
  }
}
