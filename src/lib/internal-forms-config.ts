export type InternalFormEntry = {
  id: string;
  title: string;
  description: string;
  googleFormUrl: string;
  available: boolean;
};

export const INTERNAL_FORMS: readonly InternalFormEntry[] = [
  {
    id: 'invoice-request',
    title: 'Invoice Request Form',
    description:
      'Submit invoice requests for events. Data populates the AR Form_Responses sheet.',
    googleFormUrl: 'https://forms.gle/fMkyGPgjFz6R59Wn9',
    available: true,
  },
  {
    id: 'pm-coordinator',
    title: 'Project Manager/Coordinator Request Form',
    description: 'Request PM or coordinator assignment for events.',
    googleFormUrl: 'https://forms.gle/ZL3nJekXySBuZa158',
    available: true,
  },
  {
    id: 'payables',
    title: 'LCP Payables Request Form - AP',
    description: 'Submit payment requests with supporting documentation.',
    googleFormUrl: 'https://forms.gle/vPLqsXJz2hBVKJSu7',
    available: true,
  },
  {
    id: 'attendance',
    title: 'Employee Attendance Infraction Log',
    description: 'Log tardy, call out, and no call/no show infractions.',
    googleFormUrl: 'https://forms.gle/oVFF9EAsTFDwYZTs7',
    available: true,
  },
] as const;
