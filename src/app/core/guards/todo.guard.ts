import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TodoService } from '../../services/todo.service';

@Injectable({
  providedIn: 'root',
})
export class TodoGuard implements CanActivate {
  constructor(
    private todoService: TodoService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Validar que el servicio esté inicializado
    const todos = this.todoService.getTodosValue();
    
    if (!todos) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
