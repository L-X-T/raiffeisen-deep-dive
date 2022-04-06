import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { PreloadingStrategy, Route } from '@angular/router';

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, loadMe: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      const delay: number = route.data['delay'];
      console.log('preload called on ' + route.path + ' with a delay of ' + delay);
      return timer(delay).pipe(
        flatMap((_) => {
          console.log('Loading now ' + route.path + ' module');
          return loadMe();
        })
      );
    } else {
      console.log('no preload for the path ' + route.path);
      return of(null);
    }
  }
}
