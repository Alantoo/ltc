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
  TextInput,
  Filter,
} from 'react-admin';

const PostFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="query" alwaysOn />
  </Filter>
);

export const UserListMembers = (props: ListProps) => {
  return (
    <List
      {...props}
      sort={{ field: 'createdAt', order: 'DESC' }}
      filters={<PostFilter />}
      filter={{ isAdmin: false }}
    >
      <Datagrid rowClick="show">
        <TextField source="name" />
        <EmailField source="email" />
        <TextField source="phone" />
        <TextField source="balance" />
        <BooleanField source="isBlocked" />
        <TextField source="refer.name" label="Referral" />
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
