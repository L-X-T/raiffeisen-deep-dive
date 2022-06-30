import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as FlightBookingActions from './flight-booking.actions';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FlightService } from '@flight-workspace/flight-lib';

@Injectable()
export class FlightBookingEffects {
  loadFlights$ = createEffect(
    (): Observable<any> =>
      this.actions$.pipe(
        ofType(FlightBookingActions.loadFlights),
        switchMap((a) => this.flightService.find(a.from, a.to, a.urgent)),
        map((flights) => FlightBookingActions.loadFlightsSuccessfully({ flights }))
      )
  );

  constructor(private actions$: Actions, private flightService: FlightService) {}
}
