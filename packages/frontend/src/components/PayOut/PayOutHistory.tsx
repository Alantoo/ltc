import React, { useContext, useEffect, useState } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { DataContext } from 'contexts/DataContext';
import { PayOut } from 'dataProvider';
import { getDateStr } from 'helpers';
import { MyTheme } from 'theme';

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      margin: '20px 0',
    },
  });
};

type PayOutHistoryProps = WithStyles<ClassKey>;

const PayOutHistoryView = ({ classes }: PayOutHistoryProps) => {
  const { dataProvider, payOutPopupOpened, setPayOutPopupOpened } = useContext(
    DataContext,
  );
  const [list, setList] = useState<Array<PayOut>>([]);

  useEffect(() => {
    dataProvider
      .getPayOutHistory()
      .then(({ data }) => {
        setList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onClick = () => {
    setPayOutPopupOpened(true);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5">Pay out history</Typography>
      {list.length ? (
        <TableContainer component="div">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Created at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.status.toUpperCase()}</TableCell>
                  <TableCell>{getDateStr(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No items</Typography>
      )}
    </div>
  );
};

export const PayOutHistory = withStyles(styles)(PayOutHistoryView);

export default PayOutHistory;
