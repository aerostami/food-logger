import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestangularModule } from 'ngx-restangular';
import { Restangular } from 'ngx-restangular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConfig } from '../../app.config';
@Injectable({
  providedIn: 'root'
})
export class HttpRestService {
  restServer: Restangular;
  constructor(
    private http: HttpClient,
    private spinnerService: NgxSpinnerService,
    private restangular: Restangular) {

  }
  getRestNutritionix() {
    return this.restangular.withConfig((RestangularConfigurer) => {
        const header = {};
        // localStorage.setItem('nutritionIXIndex', '' + 0);
        const nu = +localStorage.getItem('nutritionIXIndex' ) || 0;
        header['x-app-id'] = AppConfig.nutritionix[nu].id;
        header['x-app-key'] = AppConfig.nutritionix[nu].key;
        header['spinner'] = false;
        RestangularConfigurer.setBaseUrl(AppConfig.nutritionix[nu].base_url);
        RestangularConfigurer.setDefaultHeaders(
            header);
        RestangularConfigurer.setErrorInterceptor((response, deferred, responseHandler) => {
            this.spinnerService.hide();
            if (response.data.message === 'usage limits exceeded') {
                const new_nu = (+localStorage.getItem('nutritionIXIndex') + 1) % AppConfig.nutritionix.length ;
                localStorage.setItem('nutritionIXIndex', '' + new_nu);
            }
            return response;

        });
    });
}
}
