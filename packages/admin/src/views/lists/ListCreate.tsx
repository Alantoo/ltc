import React from 'react';
import { Create, CreateProps, SimpleForm, TextInput } from 'react-admin';

export const ListCreate = (props: CreateProps) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="/lists">
        <TextInput source="name" label="Name" />
      </SimpleForm>
    </Create>
  );
};
