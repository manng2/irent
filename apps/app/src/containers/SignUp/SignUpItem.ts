import { date, InferType, mixed, number, object, ref, string } from '@/yup';

export const signUpFormValidateSchema = object().shape({
  name: string().label('Tên').max(50).required(),
  address: string().label('Địa chỉ email').required(),
  email: string().label('Địa chỉ email').required(),
  password: string().label('Mật khẩu').required(),
  confirmPassword: string()
    .oneOf([ref('password')], 'Mật khẩu không khớp')
    .required(),
  dob: date().required(),
  ioc: string().label('CCCD/CMND').integer().lengths([9, 12]).required(),
  phoneNumber: string().phone().required(),
  role: mixed<'Renter' | 'Owner'>().required(),
});

export type SignUpFormValues = InferType<typeof signUpFormValidateSchema>;
