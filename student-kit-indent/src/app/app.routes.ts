import { Routes } from '@angular/router';
import { PagePlaceholderComponent } from './shared/components/page-placeholder/page-placeholder.component';

/**
 * Feature routes are lazy loaded; the placeholder modules share one component
 * and pass their heading through route data.
 */
const placeholder = (title: string) => ({
  component: PagePlaceholderComponent,
  data: { title },
});

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'indent/new' },
  {
    path: 'indent',
    loadChildren: () => import('./features/indent/indent.routes').then((m) => m.INDENT_ROUTES),
  },
  { path: 'dashboard', ...placeholder('Dashboard') },
  { path: 'student/list', ...placeholder('Student List') },
  { path: 'student/admissions', ...placeholder('Admissions') },
  { path: 'resource/staff', ...placeholder('Staff') },
  { path: 'invoice/list', ...placeholder('Invoice and Receipt') },
  { path: 'fee-structure', ...placeholder('Fee Structure') },
  { path: 'time-table', ...placeholder('Time Table') },
  { path: 'reports/indent', ...placeholder('Indent Report') },
  { path: 'downloads', ...placeholder('Downloads') },
  { path: '**', ...placeholder('Page not found') },
];
