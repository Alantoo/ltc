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
  FilterList,
  FilterListItem,
  FilterLiveSearch,
} from 'react-admin';
import { Card as MuiCard, CardContent, withStyles } from '@material-ui/core';

const Card = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: '15em',
      marginLeft: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))(MuiCard);

const FilterSidebar = () => (
  <Card>
    <CardContent>
      <FilterLiveSearch source="query" />
      <FilterList label="Role" icon={<span></span>}>
        <FilterListItem label="Admin" value={{ isAdmin: true }} />
        <FilterListItem label="User" value={{ isAdmin: false }} />
      </FilterList>
    </CardContent>
  </Card>
);

export const UserList = (props: ListProps) => {
  return (
    <List
      {...props}
      sort={{ field: 'createdAt', order: 'DESC' }}
      aside={<FilterSidebar />}
    >
      <Datagrid rowClick="show">
        <TextField source="name" />
        <EmailField source="email" />
        <TextField source="phone" />
        <BooleanField source="isAdmin" />
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
