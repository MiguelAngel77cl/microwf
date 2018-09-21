import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { HttpWrapperService } from '../shared/services/httpWrapper.service';

import { Workflow, WorkflowDefinition } from './models';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  public constructor(
    private _http: HttpWrapperService,
  ) { }

  public workflows(): Observable<Array<Workflow>> {
    return this._http.get<Array<Workflow>>('workflow');
  }

  public get(id: number): Observable<Workflow> {
    return this._http.get<Workflow>(`workflow/${id}`);
  }

  // TODO: workflow/{id}/history
  // TODO: workflow/{id}/variables

  public mywork(): Observable<Array<Workflow>> {
    return this._http.get<Array<Workflow>>('workflow/mywork');
  }

  public getInstance(type: string, correlationId: number): Observable<Workflow> {
    const params = new HttpParams()
      .set('type', type)
      .set('correlationId', correlationId.toString());

    return this._http.get<Workflow>(`workflow/instance`, params);
  }

  public definitions(): Observable<Array<WorkflowDefinition>> {
    return this._http.get<Array<WorkflowDefinition>>('workflow/definitions');
  }

  public dot(type: string): Observable<string> {
    return this._http.getAsText(`workflow/dot/${type}`);
  }
}
