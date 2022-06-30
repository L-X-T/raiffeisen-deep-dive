import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Observer, of, Subject, Subscription } from 'rxjs';
import { catchError, delay, map, share, takeUntil } from 'rxjs/operators';

import { AirportService } from '@flight-workspace/flight-lib';

@Component({
  selector: 'airport',
  templateUrl: './airport.component.html'
})
export class AirportComponent implements OnInit, OnDestroy {
  airports$: Observable<string[]> | undefined;

  // Unsubscribe with Subscription
  airports: string[] = [];
  airportsObserver: Observer<string[]> | undefined;
  airportsSubscription: Subscription | undefined;
  isLoading = true;
  isError = false;
  errorMessage = '';

  // Unsubscribe with takeUntil Subject
  takeUntilAirports: string[] = [];
  onDestroySubject = new Subject<void>();
  isLoadingTakeUntil = true;
  isErrorTakeUntil = false;
  errorMessageTakeUntil = '';

  // Async Pipe
  asyncAirports$: Observable<string[]> | undefined;
  isErrorAsyncPipe = false;
  errorMessageAsyncPipe = '';

  constructor(private airportService: AirportService, private router: Router) {}

  ngOnInit(): void {
    this.airports$ = this.airportService.findAll().pipe(
      delay(3000),
      // map((a) => []),
      share()
    );

    // Unsubscribe with Subscription
    this.airportsObserver = {
      next: (airports) => {
        this.airports = airports;
        this.isLoading = false;
        this.isError = false;
      },
      error: (err: HttpErrorResponse) => {
        console.warn(err.message);
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = err.message;
      },
      complete: () => console.log('airports observable completed')
    };

    this.airportsSubscription = this.airports$.subscribe(this.airportsObserver);

    // Unsubscribe with takeUntil Subject
    this.airports$.pipe(takeUntil(this.onDestroySubject)).subscribe({
      next: (airports) => this.onLoadAirportsSuccessfully(airports),
      error: (err: HttpErrorResponse) => this.onLoadAirportsError(err),
      complete: () => console.log('take until observable completed')
    });

    // Async Pipe
    this.asyncAirports$ = this.airports$.pipe(
      catchError((err: HttpErrorResponse) => {
        console.warn(err.message);
        this.isErrorAsyncPipe = true;
        this.errorMessageAsyncPipe = err.message;
        return of([]);
      })
    );

    console.log('[airports - ngOnInit] done');
  }

  ngOnDestroy(): void {
    // Unsubscribe with Subscription
    /*if (this.airportsSubscription) {
      this.airportsSubscription.unsubscribe();
    }*/
    this.airportsSubscription?.unsubscribe();

    // Unsubscribe with takeUntil Subject
    this.onDestroySubject.next();
    this.onDestroySubject.complete();

    console.log('[airports - ngOnDestroy] done');
  }

  /* unused method to show how to use promise */
  navigate(): void {
    this.router
      .navigate(['/home'])
      .then((hasNavigationSucceeded) => {
        console.log('promise success, has navigated: ' + hasNavigationSucceeded);
      })
      .catch((error) => {
        console.log('promise fail, error: ' + error);
      });
  }

  private onLoadAirportsSuccessfully(airports: string[]) {
    this.takeUntilAirports = airports;
    this.isLoadingTakeUntil = false;
    this.isErrorTakeUntil = false;
  }

  private onLoadAirportsError(err: HttpErrorResponse) {
    console.warn(err.message);
    this.isLoadingTakeUntil = false;
    this.isErrorTakeUntil = true;
    this.errorMessageTakeUntil = err.message;
  }
}
