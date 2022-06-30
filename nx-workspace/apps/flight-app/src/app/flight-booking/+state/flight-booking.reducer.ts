import { createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';
import { Flight } from '@flight-workspace/flight-lib';

export const flightBookingFeatureKey = 'flightBooking';

export interface FlightBookingAppState {
  flightBooking: State;
}

export interface State {
  flights: Flight[];
  negativeList: number[];
}

export const initialState: State = {
  flights: [],
  negativeList: [3]
};

export const reducer = createReducer(
  initialState,

  // on(FlightBookingActions.loadFlights, (state) => state)

  on(FlightBookingActions.loadFlightsSuccessfully, (state, action) => {
    const flights = action.flights;
    return { ...state, flights };
  }),

  on(FlightBookingActions.updateFlight, (state, action) => {
    const updatedFlight = action.flight;
    const flights = state.flights.map((f) => (f.id === updatedFlight.id ? updatedFlight : f));
    return { ...state, flights };
  })
);
