import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular/standalone';

export type ToastPosition = 'top' | 'middle' | 'bottom';
export type ToastColor = 'success' | 'danger' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  /**
   * Mostrar notificación toast
   */
  async showToast(
    message: string,
    color: ToastColor = 'success',
    position: ToastPosition = 'bottom',
    duration: number = 2000
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  /**
   * Mostrar confirmación
   */
  async showConfirmation(
    title: string,
    message: string,
    confirmText: string = 'Aceptar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          handler: () => false,
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => true,
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'confirm';
  }

  /**
   * Mostrar alerta
   */
  async showAlert(title: string, message: string, okText: string = 'OK') {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: [okText],
    });
    await alert.present();
  }

  /**
   * Atajos para casos comunes
   */
  async showSuccess(message: string) {
    return this.showToast(message, 'success');
  }

  async showError(message: string) {
    return this.showToast(message, 'danger');
  }

  async showWarning(message: string) {
    return this.showToast(message, 'warning');
  }

  async showInfo(message: string) {
    return this.showToast(message, 'info');
  }
}
