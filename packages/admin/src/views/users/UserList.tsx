import * as React from 'react';
import {
  List,
  ListProps,
  Datagrid,
  TextField,
  EmailField,
  TextFieldProps,
} from 'react-admin';
// import { isAdmin, isAgent } from '../../authProvider'

const RoleField = ({ record }: TextFieldProps) => {
  if (!record) {
    return null;
  }
  const profile = { ...record, roles: record.roles || [] };
  const isAdminRecord = false; // isAdmin(profile);
  const isAgentRecord = false; // isAgent(profile);
  if (isAdminRecord) {
    return <span>Admin</span>;
  } else if (isAgentRecord) {
    return <span>Agent</span>;
  } else if (record && record.pa) {
    return <span>User</span>;
  }
  return <span>Cognito</span>;
};

export const UserList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="username" />
        <RoleField source="role" />
        <EmailField source="email" />
        <TextField source="phone" />
        <TextField source="pa" label="Account eth" />
        <TextField source="account_btc" />
      </Datagrid>
    </List>
  );
};
