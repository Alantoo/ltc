import React from 'react';
import { Create, CreateProps, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = (props: CreateProps) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="/users">
        <TextInput source="pa" label="Public address" />
      </SimpleForm>
    </Create>
  );
};
