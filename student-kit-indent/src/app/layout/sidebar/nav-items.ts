import { IconName } from '../../shared/components/icon/icon.component';

export interface NavChild {
  label: string;
  route: string;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: IconName;
  children: NavChild[];
}

/** Sidebar structure. Only the Indent group is implemented end to end. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    children: [{ label: 'Overview', route: '/dashboard' }],
  },
  {
    id: 'student',
    label: 'Student',
    icon: 'user',
    children: [
      { label: 'Student List', route: '/student/list' },
      { label: 'Admissions', route: '/student/admissions' },
    ],
  },
  {
    id: 'resource',
    label: 'Resource',
    icon: 'users',
    children: [{ label: 'Staff', route: '/resource/staff' }],
  },
  {
    id: 'indent',
    label: 'Indent',
    icon: 'cart',
    children: [
      { label: 'New Indent', route: '/indent/new' },
      { label: 'Uniform Section', route: '/indent/uniform-section' },
    ],
  },
  {
    id: 'invoice',
    label: 'Invoice and Receipt',
    icon: 'file-text',
    children: [{ label: 'Invoices', route: '/invoice/list' }],
  },
  {
    id: 'fee',
    label: 'Fee Structure',
    icon: 'rupee',
    children: [{ label: 'Term Fees', route: '/fee-structure' }],
  },
  {
    id: 'timetable',
    label: 'Time Table',
    icon: 'calendar',
    children: [{ label: 'Weekly Plan', route: '/time-table' }],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'chart',
    children: [{ label: 'Indent Report', route: '/reports/indent' }],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    icon: 'download',
    children: [{ label: 'Circulars', route: '/downloads' }],
  },
];
