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
import { Reward } from 'dataProvider';
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

type EarningsProps = WithStyles<ClassKey>;

const EarningsView = ({ classes }: EarningsProps) => {
  const { dataProvider } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<Array<Reward>>([]);

  useEffect(() => {
    dataProvider
      .getUserRewards()
      .then(({ data }) => {
        setRewards(data);
      })
      .catch((err) => {
        setRewards([]);
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
      {rewards.length ? (
        <div>
          <Typography variant="h5">Earnings</Typography>
          <TableContainer component="div">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>List</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>{reward.list.name}</TableCell>
                    <TableCell>{reward.fromUser.name}</TableCell>
                    <TableCell>{reward.payType}</TableCell>
                    <TableCell>{reward.payAddress}</TableCell>
                    <TableCell>{reward.payAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>
          <Typography>No Earnings yet</Typography>
        </div>
      )}
    </Container>
  );
};

export const Earnings = withStyles(styles)(EarningsView);

export default Earnings;
