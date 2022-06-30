import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as FlightBookingActions from './flight-booking.actions';

@Injectable()
export class FlightBookingEffects {
  /*loadFlightBookings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FlightBookingActions.loadFlights),
    );
  });*/

  constructor(private actions$: Actions) {}
}
