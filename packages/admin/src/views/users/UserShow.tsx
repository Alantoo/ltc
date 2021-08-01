import * as React from 'react';
import {
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
  BooleanField,
} from 'react-admin';

export const UserShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" />
        <TextField source="email" />
        <TextField source="phone" />
        <TextField source="balance" />
        <BooleanField source="isAdmin" />
        <BooleanField source="isBlocked" />
      </SimpleShowLayout>
    </Show>
  );
};
