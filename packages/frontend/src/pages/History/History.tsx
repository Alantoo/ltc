import React, { useContext, useEffect, useState } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { DataContext } from 'contexts/DataContext';
import { RotatorItem } from 'dataProvider';
import { getDateStr } from 'helpers';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'loading';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    loading: {
      padding: 30,
      textAlign: 'center',
    },
  });
};

type HistoryProps = WithStyles<ClassKey>;

const HistoryView = ({ classes }: HistoryProps) => {
  const { dataProvider } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [historyList, setHistoryList] = useState<Array<RotatorItem>>([]);

  useEffect(() => {
    dataProvider
      .getUserHistory()
      .then((data) => {
        setHistoryList(data);
      })
      .catch((err) => {
        setHistoryList([]);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <div className={classes.loading}>
          <Typography>Loading...</Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {historyList.length ? (
        <div>
          <Typography variant="h5">History</Typography>
          <TableContainer component="div">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>List name</TableCell>
                  <TableCell>User email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyList.map((historyItem) => (
                  <TableRow key={historyItem.id}>
                    <TableCell>{historyItem.list.name}</TableCell>
                    <TableCell>{historyItem.user.email}</TableCell>
                    <TableCell>{historyItem.status.toUpperCase()}</TableCell>
                    <TableCell>{getDateStr(historyItem.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>
          <Typography>No History yet</Typography>
        </div>
      )}
    </Container>
  );
};

export const History = withStyles(styles)(HistoryView);

export default History;
