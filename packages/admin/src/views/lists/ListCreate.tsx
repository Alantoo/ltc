import React from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

export const ListCreate = (props: CreateProps) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="/lists">
        <TextInput source="name" />
        <NumberInput source="price" />
        <NumberInput source="selectCount" defaultValue={6} />
        <TextInput source="rotateTime" defaultValue="60d" />
      </SimpleForm>
    </Create>
  );
};
