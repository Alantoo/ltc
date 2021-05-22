import * as React from 'react';
import { Show, ShowProps, SimpleShowLayout, TextField } from 'react-admin';

export const ListShow = (props: ShowProps) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" />
      </SimpleShowLayout>
    </Show>
  );
};
