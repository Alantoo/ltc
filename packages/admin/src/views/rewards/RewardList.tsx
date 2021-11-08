import * as React from 'react';
import { List, ListProps, Datagrid, TextField } from 'react-admin';
export const RewardList = (props: ListProps) => {
  return (
    <List {...props} sort={{ field: 'createdAt', order: 'DESC' }}>
      <Datagrid rowClick="show">
        <TextField label="List" source="list.name" />
        <TextField label="From" source="fromUser.name" />
        <TextField label="To" source="toUser.name" />
        <TextField source="payType" />
        <TextField source="payAddress" />
        <TextField source="payAmount" />
      </Datagrid>
    </List>
  );
};
