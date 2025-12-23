import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ERROR_MESSAGES } from '../constants/app.constants';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | any): void {
    const notificationService = this.injector.get(NotificationService);

    let errorMessage = ERROR_MESSAGES.GENERIC;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    console.error('Global Error:', error);
    notificationService.showError(errorMessage);
  }
}
