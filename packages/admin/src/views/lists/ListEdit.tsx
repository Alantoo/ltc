import * as React from 'react';
import {
  Edit,
  EditProps,
  NumberInput,
  SimpleForm,
  TextInput,
} from 'react-admin';

const redirect = (base: string, id: string) => {
  return `${base}/${id}/show`;
};

export const ListEdit = (props: EditProps) => {
  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput source="name" />
        <NumberInput source="price" />
      </SimpleForm>
    </Edit>
  );
};
