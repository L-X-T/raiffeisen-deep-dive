import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { FormControl } from '@angular/forms';
import { combineLatest, interval, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  delay,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  retry,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css']
})
export class FlightLookaheadComponent implements OnInit {
  fromControl: FormControl = new FormControl();
  toControl: FormControl = new FormControl();

  flights$: Observable<Flight[]>;
  isLoading = false;

  diff$: Observable<number>;
  online = false;

  private refreshClickSubject = new Subject<void>();
  readonly refreshClick$ = this.refreshClickSubject.asObservable();

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

    /*const input$: Observable<string> = this.control.valueChanges.pipe(
      debounceTime(300),
      filter((input) => input.length > 2),
      distinctUntilChanged()
    );*/

    const fromInput$: Observable<string> = this.fromControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      // filter((input) => input.length > 2),
      distinctUntilChanged()
    );

    const toInput$: Observable<string> = this.toControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      // filter((input) => input.length > 2),
      distinctUntilChanged()
    );

    const online$: Observable<boolean> = interval(2000).pipe(
      startWith(0),
      map((_) => Math.random() < 0.5),
      distinctUntilChanged(),
      tap((online) => (this.online = online))
    );

    /*this.flights$ = combineLatest([input$, online$]).pipe(
      filter(([_, online]) => online),
      map(([input, _]) => input),
      tap((input) => (this.isLoading = true)),
      switchMap((input: string) => this.load(input)),
      tap((_) => (this.isLoading = false))
    );*/

    const combined$ = combineLatest([fromInput$, toInput$, online$]).pipe(
      distinctUntilChanged(
        (x: [from: string, to: string, online: boolean], y: [from: string, to: string, online: boolean]) => x[0] === y[0] && x[1] === y[1]
      )
    );
    const refresh$ = this.refreshClick$.pipe(map((_) => [this.fromControl.value, this.toControl.value, this.online]));

    this.flights$ = merge(combined$, refresh$).pipe(
      filter(([f, t, online]) => (f || t) && online),
      map(([from, to, _]) => [from, to]),
      tap(([from, to]) => (this.isLoading = true)),
      switchMap(([from, to]) => this.load(from, to)),
      tap((_) => (this.isLoading = false))
    );

    this.diff$ = this.flights$.pipe(
      startWith([]),
      pairwise(),
      map(([a, b]) => b.length - a.length)
    );
  }

  load(from: string, to: string = ''): Observable<Flight[]> {
    return this.flightService.find(from, to).pipe(
      delay(1000),
      retry(3), // retry for 3 times
      catchError((err) => {
        // if all 4 fail catch error
        console.warn('Error caught: ' + err);
        return of([]);
      })
    );
  }

  onRefresh(): void {
    this.refreshClickSubject.next();
  }
}
