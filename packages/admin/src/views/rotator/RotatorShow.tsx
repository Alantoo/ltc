import * as React from 'react';
import { Show, ShowProps, SimpleShowLayout, TextField } from 'react-admin';

export const RotatorShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="listId" />
        <TextField source="userId" />
      </SimpleShowLayout>
    </Show>
  );
};
