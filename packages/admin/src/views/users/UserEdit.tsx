import * as React from 'react';
import {
  Edit,
  EditProps,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
  regex,
} from 'react-admin';

const redirect = (base: string, id: string) => {
  return `${base}/${id}/show`;
};

export const UserEdit = (props: EditProps) => {
  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput
          source="name"
          label="User Name"
          validate={regex(
            /^[a-zA-Z0-9-_]+$/,
            'Name is invalid, use only "a-z0-9_-"',
          )}
        />
        <TextInput source="email" label="Email" />
        <TextInput source="phone" label="Phone" />
        <PasswordInput source="password" label="Password" />
        <BooleanInput source="isAdmin" />
        <BooleanInput source="isBlocked" />
      </SimpleForm>
    </Edit>
  );
};
