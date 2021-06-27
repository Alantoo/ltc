import * as React from 'react';
import { Edit, EditProps, SimpleForm, TextInput } from 'react-admin';

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
        <TextInput source="action" label="Action" />
      </SimpleForm>
    </Edit>
  );
};
