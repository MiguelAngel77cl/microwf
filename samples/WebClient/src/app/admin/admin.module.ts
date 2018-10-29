import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IconModule } from './../shared/icon/icon.module';
import { ListModule } from './../shared/list/list.module';
import { FormdefModule, FormdefRegistry } from './../shared/formdef/index';
import { WorkflowModule } from '../workflow/workflow.module';
import { ScrollerModule } from '../shared/scroller/scroller.module';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { WorkflowComponent } from './workflow.component';
import { WorkflowListItemComponent } from './workflow-list-item.component';
import { AdministratorClaimGuard } from './administratorClaimGuard';

import { WorkflowSearchComponent } from './workflow-search.component';
import { WorkflowSearchSlot } from './models';

const ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdministratorClaimGuard],
    children: [
      { path: 'detail/:id', component: WorkflowComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormdefModule,
    WorkflowModule,
    IconModule,
    ListModule,
    ScrollerModule
  ],
  declarations: [
    AdminDashboardComponent,
    WorkflowComponent,
    WorkflowListItemComponent,
    WorkflowSearchComponent
  ],
  providers: [
    AdministratorClaimGuard
  ]
})
export class AdminModule {
  public constructor(
    private _slotRegistry: FormdefRegistry
  ) {
    this._slotRegistry.register(new WorkflowSearchSlot());
  }
}
