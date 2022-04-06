import { NgModule } from '@angular/core';

import { TestRoutingModule } from './test.routing.module';
import { TestComponent } from './test.component';

@NgModule({
  declarations: [TestComponent],
  imports: [TestRoutingModule],
  providers: []
})
export class TestModule {}
