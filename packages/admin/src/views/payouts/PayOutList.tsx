import * as React from 'react';
import { List, ListProps, Datagrid, TextField } from 'react-admin';
import { PayButton } from 'components/PayOut';
export const PayOutList = (props: ListProps) => {
  return (
    <List {...props} sort={{ field: 'createdAt', order: 'DESC' }}>
      <Datagrid rowClick="show">
        <TextField source="status" />
        <TextField source="amount" />
        <TextField source="rates" />
        <TextField source="amountEth" />
        <PayButton cellClassName="list-btns" />
      </Datagrid>
    </List>
  );
};
