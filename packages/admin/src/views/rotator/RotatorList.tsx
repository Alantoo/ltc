import * as React from 'react';
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  EmailField,
  TextFieldProps,
} from 'react-admin';

export const RotatorList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="listId" />
        <TextField source="userId" />
      </Datagrid>
    </List>
  );
};
