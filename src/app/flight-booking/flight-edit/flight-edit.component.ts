// src/app/flight-booking/flight-edit/flight-edit.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanDeactivateComponent } from '../../shared/deactivation/can-deactivate.guard';
import { Observable, Observer, Subscription } from 'rxjs';
import { Flight } from '../flight';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateCity } from '../../shared/validation/city-validator';
import { validateRoundTrip } from '../../shared/validation/round-trip-validator';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss']
})
export class FlightEditComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  id = 0;
  showDetails = false;

  sender: Observer<boolean> | undefined;
  showWarning = false;

  flight: Flight | undefined;

  editForm: FormGroup;

  valueChangesSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private flightService: FlightService) {
    this.editForm = this.fb.group({
      id: [1],
      from: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity(['Graz', 'Wien', 'Hamburg', 'Berlin'])]
      ],
      to: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity(['Graz', 'Wien', 'Hamburg', 'Berlin'])]
      ],
      date: [null, [Validators.required]]
    });

    this.editForm.validator = validateRoundTrip;
  }

  ngOnInit(): void {
    this.route.params.subscribe((p) => {
      this.id = p.id;
      this.showDetails = p.showDetails;
    });

    this.route.data.subscribe((data) => {
      this.flight = data.flight;
      this.editForm.patchValue(data.flight);
    });

    console.log(this.editForm.value);
    console.log(this.editForm.valid);
    console.log(this.editForm.touched);
    console.log(this.editForm.dirty);

    this.valueChangesSubscription = this.editForm.valueChanges.subscribe((v) => {
      console.debug('changes', v);
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
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

  save(): void {
    this.flight = {
      ...this.flight,
      id: this.editForm.value.id,
      from: this.editForm.value.from,
      to: this.editForm.value.to,
      date: this.editForm.value.date
    };

    if (!this.flight.id) {
      this.flight.id = 0;
    }

    console.log('saving...');
    console.log(this.flight);

    this.flightService.save(this.flight).subscribe((flight) => {
      this.flight = flight;
      this.editForm.patchValue(flight);
    });
  }
}
