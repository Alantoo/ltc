import React, { useContext, useCallback, useState, useEffect } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import gpay from 'assets/pay/gpay.png';
import bitpay from 'assets/pay/bitpay.png';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import { List, RotatorItem, User, rotateStatus } from 'dataProvider';

import { MyTheme } from 'theme';

type ClassKey =
  | 'root'
  | 'verify'
  | 'grid'
  | 'gridItem'
  | 'gridItemTop'
  | 'gridItemBottom'
  | 'activeItem';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    grid: {
      margin: '0 -10px 30px -10px',
      padding: 0,
      listStyle: 'none',
      textAlign: 'center',
    },
    gridItem: {
      display: 'inline-block',
      width: '31%',
      margin: '10px 1%',
      padding: 0,
      border: 'solid 1px #828282',
    },
    gridItemTop: {
      padding: '10px 15px',
      background: '#f2b624',
      textAlign: 'center',
    },
    gridItemBottom: {
      display: 'flex',
      padding: '10px 15px',
      '& > a': {
        width: '50%',
        marginLeft: 5,
      },
      '& > a:first-child': {
        marginLeft: 0,
      },
      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto',
      },
    },
    activeItem: {
      marginBottom: 30,
    },
    verify: {
      padding: '30px 0',
      textAlign: 'center',
    },
  });
};

type ProfileProps = WithStyles<ClassKey>;

const ProfileView = ({ classes }: ProfileProps) => {
  const { auth, user } = useContext(AuthContext);
  const { dataProvider } = useContext(DataContext);
  const [isSent, setIsSent] = useState(false);
  const [list, setList] = useState<Array<List>>([]);
  const [historyList, setHistoryList] = useState<Array<RotatorItem>>([]);
  const [historyCache, setHistoryCache] = useState(0);
  const [activeItem, setActiveItem] = useState<RotatorItem>();
  const [itemsList, setItemsList] = useState<Array<RotatorItem>>([]);

  // const gridItems = [
  //   { name: '$100.00', price: '$604.95' },
  //   { name: '$50.00', price: '$304.95' },
  //   { name: '$20.00', price: '$124.95' },
  //   { name: '$10.00', price: '$64.95' },
  //   { name: '$5.00', price: '$34.95' },
  //   { name: '$1.00', price: '$10.95' },
  // ];

  const updateActiveItem = useCallback(
    (newActiveItem) => {
      if (newActiveItem && newActiveItem.status === rotateStatus.ADDED) {
        setHistoryCache(historyCache + 1);
        setActiveItem(undefined);
        setItemsList([]);
      } else if (JSON.stringify(activeItem) !== JSON.stringify(newActiveItem)) {
        setActiveItem(newActiveItem);
      }
    },
    [activeItem, setActiveItem, historyCache, setHistoryList, setItemsList],
  );

  useEffect(() => {
    dataProvider
      .getUserHistory()
      .then((data) => {
        setHistoryList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [historyCache]);

  useEffect(() => {
    dataProvider
      .getUserStatus()
      .then((data) => {
        const { item, list } = data || {};
        updateActiveItem(item);
        setList(list);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!activeItem) {
      return;
    }
    dataProvider
      .getItemStatus(activeItem.id)
      .then((data) => {
        const { item, list } = data || {};
        setItemsList(list);
        updateActiveItem(item);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [!!activeItem]);

  const onSendClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      auth
        .sendVerificationCode()
        .then(() => {
          setIsSent(true);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [auth, setIsSent],
  );

  const onPaySubmit = useCallback(
    (listId: string | number) => {
      dataProvider
        .listStart(listId)
        .then((data) => {
          const { item, list } = data || {};
          updateActiveItem(item);
          setItemsList(list);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [dataProvider, updateActiveItem, setItemsList],
  );

  const onUserSelect = useCallback(
    (userId: string | number) => {
      if (!activeItem) {
        return;
      }
      dataProvider
        .addItemUser(activeItem.id, userId)
        .then((data) => {
          const { item, list } = data || {};
          updateActiveItem(item);
          setItemsList(list);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [
      dataProvider,
      activeItem,
      updateActiveItem,
      setItemsList,
      historyCache,
      setHistoryCache,
    ],
  );

  if (!user) {
    return null;
  }

  if (!user.isVerified) {
    return (
      <Container maxWidth="xl">
        <Typography className={classes.verify}>
          Please verify your email
          <br /> <br />
          {isSent ? (
            <Button onClick={onSendClick} variant="contained" color="primary">
              Send again
            </Button>
          ) : (
            <Button onClick={onSendClick} variant="contained" color="primary">
              Send code
            </Button>
          )}
        </Typography>
      </Container>
    );
  }

  let activeOrList = null;

  if (activeItem) {
    const { selected = [] } = activeItem;
    activeOrList = (
      <div className={classes.activeItem}>
        <Typography variant="h5">Active item</Typography>
        <Typography>Please select users</Typography>
        <TableContainer component="div">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>User name</TableCell>
                <TableCell>User email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsList.map((item) => {
                const isSelected = selected.includes(`${item.id}`);
                const onSelectedChange = (e: React.ChangeEvent) => {
                  e.preventDefault();
                  onUserSelect(item.id);
                };
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        onChange={onSelectedChange}
                        disabled={isSelected}
                        checked={isSelected}
                      />
                    </TableCell>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>{item.user.email}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    activeOrList = (
      <ul className={classes.grid}>
        {list.map(({ id, name, price }) => {
          const onPayClick = (e: React.MouseEvent) => {
            e.preventDefault();
            onPaySubmit(id);
          };

          return (
            <li key={id} className={classes.gridItem}>
              <Typography className={classes.gridItemTop} component="div">
                60-day entry into the {name}
                <br />
                Global Money List revolver For {price}
              </Typography>
              <div className={classes.gridItemBottom}>
                <a href="#" onClick={onPayClick}>
                  <img src={gpay} alt="gpay" />
                </a>
                <a href="#" onClick={onPayClick}>
                  <img src={bitpay} alt="bitpay" />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <Container maxWidth="xl">
      {activeOrList}

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
                </TableRow>
              </TableHead>
              <TableBody>
                {historyList.map((historyItem) => (
                  <TableRow key={historyItem.id}>
                    <TableCell>{historyItem.list.name}</TableCell>
                    <TableCell>{historyItem.user.email}</TableCell>
                    <TableCell>{historyItem.status.toUpperCase()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : null}
    </Container>
  );
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;
