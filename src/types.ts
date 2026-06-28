export type UserTypeID = 'student' | 'instructor' | 'administrator' | 'parent';

export type AccessLevelID = 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5';

export interface SquadUser {
  id: string;
  dbId?: string; // real MongoDB _id returned from backend after registration
  user_type_id: string; // dropdown value mapped from: Student, Teacher/Instructor, Administrator, Parent/Guardian
  nic: string;
  password?: string;
  email: string;
  passport: string;
  title_id: string; // Mr, Mrs, Ms, Dr, Rev
  first_name: string;
  middle_name: string;
  last_name: string;
  sex: string; // male, female, other
  dob: string;
  phone: string;
  access_level_id: string; // dropdown value mapped from: Level 1, Level 2, Level 3, Level 4, Level 5
}
