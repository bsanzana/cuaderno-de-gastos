import { Component, OnInit } from '@angular/core';
// import { NotificationsService } from 'angular2-notifications';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-method',
  templateUrl: './method.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ]
})
export class MethodComponent implements OnInit {
  constructor(
    // private notificationsService : NotificationsService,
    private router               : Router
  ) {  }

  ngOnInit() {
    this.router.navigate(['/metodos/mano-de-obra']);
  }
}
