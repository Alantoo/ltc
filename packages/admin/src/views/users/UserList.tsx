import * as React from 'react';
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  EmailField,
  TextFieldProps,
} from 'react-admin';

export const UserList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="name" />
        <EmailField source="email" />
      </Datagrid>
    </List>
  );
};
