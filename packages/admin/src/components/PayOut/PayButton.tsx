import React, { useState } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useDataProvider, useRefresh } from 'react-admin';
import { MyDataProvider, PayOut } from 'dataProvider';
import { MyTheme } from 'theme';

type ClassKey = 'main';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    main: {
      width: '1%',
      textAlign: 'right',
    },
  });
};

type DashboardPageProps = WithStyles<ClassKey> & {
  source?: string;
  cellClassName?: string;
  record?: PayOut;
};

const DashboardPageView = ({
  classes,
  record,
  ...props
}: DashboardPageProps) => {
  const dataProvider = useDataProvider() as MyDataProvider;
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!record || loading) {
      return null;
    }

    setLoading(true);

    dataProvider
      .approvePayOut(record)
      .then((newRecord) => {
        console.log(newRecord);
        refresh();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!record) {
    return null;
  }

  if (record.status === 'done') {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      color="primary"
      size="small"
      variant="contained"
      disabled={loading}
    >
      Pay
    </Button>
  );
};

export const PayButton = withStyles(styles)(DashboardPageView);

export default PayButton;
