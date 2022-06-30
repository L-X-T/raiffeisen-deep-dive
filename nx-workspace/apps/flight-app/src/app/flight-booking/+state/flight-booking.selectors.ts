import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFlightBooking from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<fromFlightBooking.State>(fromFlightBooking.flightBookingFeatureKey);

export const selectFlights = createSelector(selectFlightBookingState, (s) => s.flights);
export const selectNegativeList = createSelector(selectFlightBookingState, (s) => s.negativeList);

export const selectFilteredFlights = createSelector(selectFlights, selectNegativeList, (flights, negativeList) =>
  flights.filter((f) => !negativeList.includes(f.id))
);
