import * as React from 'react';
import { Edit, EditProps, SimpleForm, TextInput } from 'react-admin';

const redirect = (base: string, id: string) => {
  return `${base}/${id}/show`;
};

export const UserEdit = (props: EditProps) => {
  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput source="name" />
        <TextInput source="email" />
      </SimpleForm>
    </Edit>
  );
};
