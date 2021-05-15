import * as React from 'react';
import { Show, ShowProps, SimpleShowLayout, TextField } from 'react-admin';

export const UserShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" />
        <TextField source="username" />
        <TextField source="email" />
        <TextField source="phone" />
      </SimpleShowLayout>
    </Show>
  );
};