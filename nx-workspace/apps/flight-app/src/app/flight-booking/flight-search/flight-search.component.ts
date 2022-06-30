import { Component, OnDestroy } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FlightBookingAppState } from '../+state/flight-booking.reducer';
import * as FlightBookingActions from '../+state/flight-booking.actions';
import { selectFlightsWithProps } from '../+state/flight-booking.selectors';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnDestroy {
  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;
  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  // flights$ = this.store.select((s) => s.flightBooking.flights);
  // flights$ = this.store.select(selectFilteredFlights);
  flights$ = this.store.select(selectFlightsWithProps({ blackList: [3, 4] }));
  flightsSubscription: Subscription;

  isLoading$ = this.store.select((s) => s.flightBooking.isLoading);
  errorMessage$ = this.store.select((s) => s.flightBooking.errorMessage);

  constructor(private flightService: FlightService, private store: Store<FlightBookingAppState>) {}

  get flights(): Flight[] {
    return this.flightService.flights;
  }

  ngOnDestroy(): void {
    this.flightsSubscription?.unsubscribe();
  }

  search(): void {
    if (!this.from || !this.to) return;

    /*this.flightsSubscription = this.flightService.find(this.from, this.to, this.urgent).subscribe({
      next: (flights) => {
        this.store.dispatch(FlightBookingActions.loadFlightsSuccessfully({ flights }));
      },
      error: (err) => {
        console.warn('find flights error: ', err);
      }
    });*/

    this.store.dispatch(
      FlightBookingActions.loadFlights({
        from: this.from,
        to: this.to,
        urgent: this.urgent
      })
    );
  }

  delay(): void {
    this.flights$.pipe(take(1)).subscribe((flights: Flight[]) => {
      if (flights.length > 0) {
        const flight = flights[0];
        const date = new Date(flight.date);
        const delayedDate = new Date(date.getTime() + 15 * 60 * 1000);
        const delayedFlight = { ...flight, date: delayedDate.toISOString() };

        this.store.dispatch(FlightBookingActions.updateFlight({ flight: delayedFlight }));
      }
    });
  }
}
