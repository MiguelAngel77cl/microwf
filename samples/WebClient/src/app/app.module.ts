import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from './shared/shared.module';
import { ShellModule } from './shell/shell.module';
import { LoginModule } from './login/login.module';
import { WorkflowModule } from './workflow/workflow.module';

import { httpInterceptorProviders } from './shared/services/interceptors';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shell/header.component';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './shell/home.component';
import { PageNotFoundComponent } from './shell/page-not-found.component';
import { AuthGuard } from './shared/services/models';

import { DispatchWorkflowComponent } from './workflow/dispatch-workflow.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dispatch/:assignee/:goto', component: DispatchWorkflowComponent },
      {
        path: 'holiday',
        loadChildren: './holiday/holiday.module#HolidayModule'
      },
      {
        path: 'issue',
        loadChildren: './issue/issue.module#IssueModule'
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    NgbModule.forRoot(),
    SharedModule,
    ShellModule,
    LoginModule,
    WorkflowModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
