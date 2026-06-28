import { SquadUser } from './types';

export const USER_TYPES = [
  { id: 'student', label: 'Student' },
  { id: 'instructor', label: 'Teacher / Instructor' },
  { id: 'administrator', label: 'Administrator' },
  { id: 'parent', label: 'Parent / Guardian' }
];

export const ACCESS_LEVELS = [
  { id: 1, label: 'Level 1' },
  { id: 2, label: 'Level 2' },
  { id: 3, label: 'Level 3' },
  { id: 4, label: 'Level 4' },
  { id: 5, label: 'Level 5' },
  { id: 6, label: 'Level 6' }
];

export const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Rev'];

export const SEXES = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' }
];

export const INITIAL_USERS: SquadUser[] = [
  {
    id: 'squad_u1',
    user_type_id: 'instructor',
    nic: 'jackson',
    password: 'jenish_password',
    email: 'jacson@gmail.com',
    passport: 'abcsd',
    title_id: 'Mr',
    first_name: 'Jenish',
    middle_name: 'J',
    last_name: 'D',
    sex: 'male',
    dob: '1998-05-04',
    phone: '8837092370',
    access_level_id: 4
  },
  {
    id: 'squad_u2',
    user_type_id: 'student',
    nic: 'almamater',
    password: 'secure_pass_99',
    email: 'explorealmamater@gmail.com',
    passport: 'pp-77889',
    title_id: 'Ms',
    first_name: 'Elena',
    middle_name: 'R',
    last_name: 'Rostova',
    sex: 'female',
    dob: '2001-11-20',
    phone: '7730948512',
    access_level_id: 2
  },
  {
    id: 'squad_u3',
    user_type_id: 'administrator',
    nic: 'mvance',
    password: 'admin_sys_master',
    email: 'marcus.vance@squad.edu',
    passport: 'pp-10203',
    title_id: 'Dr',
    first_name: 'Marcus',
    middle_name: 'V',
    last_name: 'Vance',
    sex: 'male',
    dob: '1984-03-12',
    phone: '9920138402',
    access_level_id: 5
  }
];
