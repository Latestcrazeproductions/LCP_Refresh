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
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdR1LNOM00P2OfMhDigEx93jBlJfrwJLSNgArQcUNDUKNBFuA/viewform',
    available: true,
  },
  {
    id: 'pm-coordinator',
    title: 'Project Manager/Coordinator Request Form',
    description: 'Request PM or coordinator assignment for events.',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdjm4N7nN6hjqeyz_hTOmMLfoDsXiImlwWIsmu6yXNb7Onj4g/viewform',
    available: true,
  },
  {
    id: 'payables',
    title: 'LCP Payables Request Form - AP',
    description: 'Submit payment requests with supporting documentation.',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSckoQtdQQTMZnN_G0aZ26KfoQpW-jUkkeH3XNzV_pDsQ9YQOQ/viewform',
    available: true,
  },
  {
    id: 'attendance',
    title: 'Employee Attendance Infraction Log',
    description: 'Log tardy, call out, and no call/no show infractions.',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfCmbm8tNxiEjM1iiXc3oGeBkfeUYT9D9yg74Ld_9uk1r-8Ag/viewform',
    available: true,
  },
] as const;
