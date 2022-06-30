import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { FormControl } from '@angular/forms';
import { combineLatest, interval, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css']
})
export class FlightLookaheadComponent implements OnInit {
  control = new FormControl();

  flights$: Observable<Flight[]>;
  isLoading = false;

  diff$: Observable<number>;
  online = false;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    /*this.flights$ = this.control.valueChanges.pipe(
      debounceTime(300),
      filter((input) => input.length > 2),
      distinctUntilChanged(),
      tap((input) => (this.isLoading = true)),
      switchMap((input) => this.load(input)),
      tap((_) => (this.isLoading = false))
    );*/

    const input$: Observable<string> = this.control.valueChanges.pipe(
      debounceTime(300),
      filter((input) => input.length > 2),
      distinctUntilChanged()
    );

    const online$: Observable<boolean> = interval(2000).pipe(
      startWith(0),
      map((_) => Math.random() < 0.5),
      distinctUntilChanged(),
      tap((online) => (this.online = online))
    );

    this.flights$ = combineLatest([input$, online$]).pipe(
      filter(([_, online]) => online),
      map(([input, _]) => input),
      tap((input) => (this.isLoading = true)),
      switchMap((input: string) => this.load(input)),
      tap((_) => (this.isLoading = false))
    );

    this.diff$ = this.flights$.pipe(
      startWith([]),
      pairwise(),
      map(([a, b]) => b.length - a.length)
    );
  }

  load(from: string, to: string = ''): Observable<Flight[]> {
    return this.flightService.find(from, to);
  }
}
