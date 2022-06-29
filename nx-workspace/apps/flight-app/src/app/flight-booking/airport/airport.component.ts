import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirportService } from '@flight-workspace/flight-lib';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { delay, share, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'airport',
  templateUrl: './airport.component.html'
})
export class AirportComponent implements OnInit, OnDestroy {
  airports$: Observable<string[]>;
  airportsObserver: Observer<string[]>;

  // Unsubscribe with Subscription
  airports: string[] = [];
  airportsSubscription: Subscription | undefined;

  // Unsubscribe with takeUntil Subject
  takeUntilAirports: string[] = [];
  onDestroySubject = new Subject<void>();

  // flags
  isLoading = true;
  isError = false;
  errorMessage = '';

  constructor(private airportService: AirportService, private router: Router) {}

  ngOnInit(): void {
    this.airports$ = this.airportService.findAll().pipe(delay(3000), share());

    this.airportsObserver = {
      next: (airports) => {
        this.airports = airports;
        this.isLoading = false;
        this.isError = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message);
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = err.message;
      },
      complete: () => console.log('complete')
    };

    this.airportsSubscription = this.airports$.subscribe(this.airportsObserver);

    const takeUntilObserver = {
      ...this.airportsObserver,
      next: (airports) => {
        this.takeUntilAirports = airports;
        this.isLoading = false;
        this.isError = false;
      }
    };

    this.airports$.pipe(takeUntil(this.onDestroySubject)).subscribe(takeUntilObserver);

    console.log('sync code');
  }

  ngOnDestroy(): void {
    /*if (this.airportsSubscription) {
      this.airportsSubscription.unsubscribe();
    }*/

    this.airportsSubscription?.unsubscribe();

    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  navigate(): void {
    this.router.navigate(['/home']).then((isSuccess) => {
      this.isError = !isSuccess;
    });
  }
}
