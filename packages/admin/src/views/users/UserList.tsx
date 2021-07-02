import * as React from 'react';
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
} from 'react-admin';

export const UserList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="name" />
        <EmailField source="email" />
        <BooleanField source="isAdmin" />
        <TextField source="phone" />
        <ShowButton basePath="/users" label="View" />
        <EditButton basePath="/users" label="Edit" />
        <DeleteButton basePath="/users" label="Delete" />
        {/* Add suspend button
        Add Earnings button */}
        );
      </Datagrid>
    </List>
  );
};
