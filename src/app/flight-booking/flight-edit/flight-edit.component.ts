// src/app/flight-booking/flight-edit/flight-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanDeactivateComponent } from '../../shared/deactivation/can-deactivate.guard';
import { Observable, Observer } from 'rxjs';
import { Flight } from '../flight';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss']
})
export class FlightEditComponent implements OnInit, CanDeactivateComponent {
  id = 0;
  showDetails = false;

  sender: Observer<boolean> | undefined;
  showWarning = false;

  flight: Flight | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((p) => {
      this.id = p.id;
      this.showDetails = p.showDetails;
    });

    this.route.data.subscribe((data) => {
      this.flight = data.flight;
    });
  }

  decide(decision: boolean): void {
    this.showWarning = false;
    if (this.sender) {
      this.sender.next(decision);
      this.sender.complete();
    }
  }

  canDeactivate(): Observable<boolean> {
    return new Observable((sender: Observer<boolean>) => {
      this.sender = sender;
      this.showWarning = true;
    });
  }
}
