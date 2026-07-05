export interface CommunityProject {
  id: string;
  name: string;
  title: string;
  description: string;
  wokwiLink: string;
  raw: Record<string, string>;
}

export interface CommunityProjectFormValues {
  name: string;
  title: string;
  description: string;
  wokwiLink: string;
}

export const DEFAULT_PROJECTS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8Rwen4Xf5Bjs3cTBDMIlnXhkf2BmWVzowk6csWB3bTa4OdU7GqHpN5QmQQOmDfaM-LO0on0_3kNiq/pub?output=csv';

export const DEFAULT_SUBMISSION_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbyKUuO4qJ1tmV9xYPuJ1NTNgFSxh_l_nRXKAfgDayTiGsQkU0vUmMHN3PlXg1-9qSp2/exec';
