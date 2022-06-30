import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as FlightBookingActions from './flight-booking.actions';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { FlightService } from '@flight-workspace/flight-lib';

@Injectable()
export class FlightBookingEffects {
  loadFlights$ = createEffect(
    (): Observable<any> =>
      this.actions$.pipe(
        ofType(FlightBookingActions.loadFlights),
        switchMap((a) =>
          this.flightService.find(a.from, a.to, a.urgent).pipe(
            delay(1000),
            map((flights) => FlightBookingActions.loadFlightsSuccessfully({ flights })),
            catchError((error) => of(FlightBookingActions.loadFlightsError({ error })))
          )
        )
      )
  );

  constructor(private actions$: Actions, private flightService: FlightService) {}
}
