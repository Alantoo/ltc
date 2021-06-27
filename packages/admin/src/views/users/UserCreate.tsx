import React from 'react';
import { Create, CreateProps, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = (props: CreateProps) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="/users">
        <TextInput source="name" label="User Name" />
        <TextInput source="email" label="Email" />
        <TextInput source="phone" label="Phone" />
        <TextInput source="action" label="Action" />
      </SimpleForm>
    </Create>
  );
};
