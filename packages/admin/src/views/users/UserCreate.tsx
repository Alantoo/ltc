import React from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
  regex,
} from 'react-admin';

export const UserCreate = (props: CreateProps) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="/users">
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
    </Create>
  );
};
