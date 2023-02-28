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
import { Referral } from 'dataProvider';
import { MyTheme } from 'theme';
import { MainImgWithContent } from '../../components/MainImgWithContent';

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

type ReferralsProps = WithStyles<ClassKey>;

const ReferralsView = ({ classes }: ReferralsProps) => {
  const { dataProvider } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Array<Referral>>([]);

  useEffect(() => {
    dataProvider
      .getUserReferrals()
      .then(({ data }) => {
        setReferrals(data);
      })
      .catch((err) => {
        setReferrals([]);
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
    <>
      <MainImgWithContent
        title="REFERRAL LIST"
        subtitle="Global Money List - Referral List"
      />
      <Container maxWidth="xl">
        {referrals.length ? (
          <div>
            <Typography variant="h5">Referrals</Typography>
            <TableContainer component="div">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    {/*<TableCell>Status</TableCell>*/}
                    {/*<TableCell>Created at</TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>{referral.name}</TableCell>
                      <TableCell>{referral.email}</TableCell>
                      {/*<TableCell>{referral.status.toUpperCase()}</TableCell>*/}
                      {/*<TableCell>{getDateStr(historyItem.createdAt)}</TableCell>*/}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div>
            <Typography>No Referrals yet</Typography>
          </div>
        )}
      </Container>
    </>
  );
};

export const Referrals = withStyles(styles)(ReferralsView);

export default Referrals;
