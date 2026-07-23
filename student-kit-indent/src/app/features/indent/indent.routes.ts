import { Routes } from '@angular/router';

export const INDENT_ROUTES: Routes = [
  {
    path: 'new',
    title: 'New Indent | Little Millennium',
    loadComponent: () =>
      import('./pages/new-indent/new-indent.page').then((m) => m.NewIndentPage),
  },
  {
    path: 'uniform-section',
    title: 'Uniform Section | Little Millennium',
    loadComponent: () =>
      import('./pages/uniform-section/uniform-section.page').then((m) => m.UniformSectionPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'new' },
];
