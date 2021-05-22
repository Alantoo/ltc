import * as React from 'react';
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  EmailField,
  TextFieldProps,
} from 'react-admin';

export const ListList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="name" />
      </Datagrid>
    </List>
  );
};
