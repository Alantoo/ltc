import * as React from 'react';
import {
  List,
  ListProps,
  Datagrid,
  TextField,
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
      <FilterList label="List" icon={<span></span>}>
        <FilterListItem label="$1.00" value={{ 'list.name': '$1.00' }} />
        <FilterListItem label="$5.00" value={{ 'list.name': '$5.00' }} />
        <FilterListItem label="$10.00" value={{ 'list.name': '$10.00' }} />
        <FilterListItem label="$20.00" value={{ 'list.name': '$20.00' }} />
        <FilterListItem label="$50.00" value={{ 'list.name': '$50.00' }} />
        <FilterListItem label="$100.00" value={{ 'list.name': '$100.00' }} />
      </FilterList>
    </CardContent>
  </Card>
);

export const RotatorList = (props: ListProps) => {
  return (
    <List
      {...props}
      sort={{ field: 'createdAt', order: 'DESC' }}
      aside={<FilterSidebar />}
    >
      <Datagrid rowClick="show">
        <TextField source="list.name" label="List" />
        <TextField source="status" label="Status" />
        <TextField source="user.name" label="User name" />
        <TextField source="user.email" label="User email" />
        <TextField source="createdAt" />
      </Datagrid>
    </List>
  );
};
