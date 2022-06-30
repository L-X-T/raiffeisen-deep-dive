import { createAction, props } from '@ngrx/store';
import { Flight } from '@flight-workspace/flight-lib';

export const loadFlights = createAction('[FlightBooking] LoadFlights');
export const loadFlightsSuccessfully = createAction('[FlightBooking] LoadFlightsSuccessfully', props<{ flights: Flight[] }>());

