import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css']
})
export class FlightLookaheadComponent implements OnInit {
  control = new FormControl();

  flights$: Observable<Flight[]>;
  isLoading = false;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.flights$ = this.control.valueChanges.pipe(
      debounceTime(300),
      filter((input) => input.length > 2),
      distinctUntilChanged(),
      tap((input) => (this.isLoading = true)),
      switchMap((input) => this.load(input)),
      tap((_) => (this.isLoading = false))
    );
  }

  load(from: string, to: string = ''): Observable<Flight[]> {
    return this.flightService.find(from, to);
  }
}
