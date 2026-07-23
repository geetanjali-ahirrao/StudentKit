import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { EXTRA_UNIFORMS, STUDENT_KITS } from '../data/indent-catalog';
import { ExtraUniform, StudentKit } from '../models/indent.models';

/**
 * Read side of the module. Swap the `of(...)` calls for `HttpClient` requests
 * when a real API is available - nothing else in the app has to change.
 */
@Injectable({ providedIn: 'root' })
export class IndentCatalogService {
  private readonly latencyMs = 250;

  readonly centre = signal({ name: 'MIDC - Andheri', user: 'Ravi Mathur' });

  getStudentKits(): Observable<StudentKit[]> {
    return of(structuredClone(STUDENT_KITS)).pipe(delay(this.latencyMs));
  }

  getExtraUniforms(): Observable<ExtraUniform[]> {
    return of(structuredClone(EXTRA_UNIFORMS)).pipe(delay(this.latencyMs));
  }
}
