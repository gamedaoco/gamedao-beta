import { FormikProps } from 'formik';

// ----------------------------------------------------------------------

export type InitialValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  subscription?: string;
  isMonthly?: boolean;
  method?: string;
  card?: string;
  newCardName?: string;
  newCardNumber?: string;
  newCardExpired?: string;
  newCardCvv?: string;
};

export type PaymentFormikProps = FormikProps<InitialValues>;
