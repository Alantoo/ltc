import React from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
} from 'react-admin';

export const UserCreate = (props: CreateProps) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="/users">
        <TextInput source="name" label="User Name" />
        <TextInput source="email" label="Email" />
        <TextInput source="phone" label="Phone" />
        <PasswordInput source="password" label="Password" />
        <BooleanInput source="isAdmin" />
      </SimpleForm>
    </Create>
  );
};
