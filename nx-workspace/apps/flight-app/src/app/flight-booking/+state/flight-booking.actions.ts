import { createAction, props } from '@ngrx/store';
import { Flight } from '@flight-workspace/flight-lib';
import { HttpErrorResponse } from '@angular/common/http';

export const loadFlights = createAction('[FlightBooking] LoadFlights', props<{ from: string; to: string; urgent: boolean }>());
export const loadFlightsSuccessfully = createAction('[FlightBooking] LoadFlightsSuccessfully', props<{ flights: Flight[] }>());
export const loadFlightsError = createAction('[FlightBooking] Load Flights Error', props<{ error: HttpErrorResponse }>());

export const updateFlight = createAction('[FlightBooking] Update Flight', props<{ flight: Flight }>());
