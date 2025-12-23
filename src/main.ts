import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { CategoryService } from './app/services/category.service';
import { FirebaseService } from './app/services/firebase.service';

function initializeCategoryService(categoryService: CategoryService) {
  return () => categoryService.init();
}

function initializeFirebase(firebaseService: FirebaseService) {
  return () => firebaseService.initialize();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFirebase,
      deps: [FirebaseService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCategoryService,
      deps: [CategoryService],
      multi: true,
    },
  ],
});
