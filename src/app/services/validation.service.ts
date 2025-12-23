import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { APP_CONSTANTS } from '../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  /**
   * Validar título de tarea
   */
  validateTodoTitle(title: string): ValidationErrors | null {
    if (!title) {
      return { required: true };
    }

    if (title.length < APP_CONSTANTS.MIN_TITLE_LENGTH) {
      return { minLength: { requiredLength: APP_CONSTANTS.MIN_TITLE_LENGTH } };
    }

    if (title.length > APP_CONSTANTS.MAX_TITLE_LENGTH) {
      return { maxLength: { requiredLength: APP_CONSTANTS.MAX_TITLE_LENGTH } };
    }

    return null;
  }

  /**
   * Validar descripción
   */
  validateDescription(description: string): ValidationErrors | null {
    if (!description) return null;

    if (description.length > APP_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
      return { maxLength: { requiredLength: APP_CONSTANTS.MAX_DESCRIPTION_LENGTH } };
    }

    return null;
  }

  /**
   * Validar fecha
   */
  validateDate(date: any): ValidationErrors | null {
    if (!date) return null;

    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj < today) {
      return { pastDate: true };
    }

    return null;
  }

  /**
   * Obtener mensajes de error
   */
  getErrorMessage(control: AbstractControl | null): string {
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control.hasError('minlength')) {
      const length = control.getError('minlength').requiredLength;
      return `Mínimo ${length} caracteres requeridos`;
    }

    if (control.hasError('maxlength')) {
      const length = control.getError('maxlength').requiredLength;
      return `Máximo ${length} caracteres permitidos`;
    }

    if (control.hasError('pastDate')) {
      return 'La fecha no puede ser en el pasado';
    }

    return 'Campo inválido';
  }
}
