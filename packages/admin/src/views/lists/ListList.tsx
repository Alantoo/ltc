import * as React from 'react';
import { List, ListProps, Datagrid, TextField } from 'react-admin';

export const ListList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="name" />
        <TextField source="entryPrice" />
        <TextField source="price" />
        <TextField source="selectCount" />
        <TextField source="rotateTime" />
      </Datagrid>
    </List>
  );
};
