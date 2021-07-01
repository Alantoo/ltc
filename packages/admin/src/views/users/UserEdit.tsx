import * as React from 'react';
import {
  Edit,
  EditProps,
  SimpleForm,
  TextInput,
  PasswordInput,
} from 'react-admin';

const redirect = (base: string, id: string) => {
  return `${base}/${id}/show`;
};

export const UserEdit = (props: EditProps) => {
  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput source="name" label="User Name" />
        <TextInput source="email" label="Email" />
        <TextInput source="phone" label="Phone" />
        <PasswordInput source="password" label="Password" />
      </SimpleForm>
    </Edit>
  );
};
