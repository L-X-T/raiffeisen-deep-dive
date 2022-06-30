import { Component, OnDestroy } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FlightBookingAppState } from '../+state/flight-booking.reducer';
import * as FlightBookingActions from '../+state/flight-booking.actions';

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

  flights$ = this.store.select((s) => s.flightBooking.flights);
  flightsSubscription: Subscription;

  constructor(private flightService: FlightService, private store: Store<FlightBookingAppState>) {}

  get flights(): Flight[] {
    return this.flightService.flights;
  }

  ngOnDestroy(): void {
    this.flightsSubscription?.unsubscribe();
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightsSubscription = this.flightService.find(this.from, this.to, this.urgent).subscribe({
      next: (flights) => {
        this.store.dispatch(FlightBookingActions.loadFlightsSuccessfully({ flights }));
      },
      error: (err) => {
        console.warn('find flights error: ', err);
      }
    });
  }

  delay(): void {
    this.flightService.delay();
  }
}
