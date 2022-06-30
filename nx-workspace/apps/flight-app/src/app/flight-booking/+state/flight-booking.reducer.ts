import { createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';
import { Flight } from '@flight-workspace/flight-lib';

export const flightBookingFeatureKey = 'flightBooking';

export interface FlightBookingAppState {
  flightBooking: State;
}

export interface State {
  flights: Flight[];
  isLoading: boolean;
  errorMessage: string;
  negativeList: number[];
}

export const initialState: State = {
  flights: [],
  isLoading: false,
  errorMessage: '',
  negativeList: [3]
};

export const reducer = createReducer(
  initialState,

  on(FlightBookingActions.loadFlights, (state) => ({ ...state, flights: [], isLoading: true, errorMessage: '' })),

  on(FlightBookingActions.loadFlightsSuccessfully, (state, action) => {
    const flights = action.flights;
    return { ...state, flights, isLoading: false };
  }),

  on(FlightBookingActions.loadFlightsError, (state, action) => {
    const errorMessage = action.error.message;
    return { ...state, isLoading: false, errorMessage };
  }),

  on(FlightBookingActions.updateFlight, (state, action) => {
    const updatedFlight = action.flight;
    const flights = state.flights.map((f) => (f.id === updatedFlight.id ? updatedFlight : f));
    return { ...state, flights };
  })
);
