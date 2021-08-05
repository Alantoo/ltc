import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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
import { PayOutButton, PayOutHistory } from 'components/PayOut';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import { List, RotatorItem, rotateStatus } from 'dataProvider';
import { getDateStr } from 'helpers';

import { MyTheme } from 'theme';

type ClassKey =
  | 'root'
  | 'verify'
  | 'grid'
  | 'gridItem'
  | 'gridItemTop'
  | 'gridItemBottom'
  | 'activeItem'
  | 'activeItemTitle'
  | 'activeItemText'
  | 'activeItemTable'
  | 'table'
  | 'balanceRow';

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
    activeItemTitle: {
      textAlign: 'center',
      marginBottom: 10,
    },
    activeItemText: {
      marginBottom: 30,
    },
    activeItemTable: {
      '& table': {
        width: '100%',
        textAlign: 'center',
        borderCollapse: 'collapse',
      },
      '& table button': {
        paddingTop: 4,
        paddingBottom: 4,
      },
      '& td, & th': {
        padding: 10,
        border: 'solid 1px black',
        background: myTheme.palette.primary.main,
      },
    },
    verify: {
      padding: '30px 0',
      textAlign: 'center',
    },
    table: {
      margin: '10px 0 20px',
      borderCollapse: 'collapse',
      '& td': {
        padding: 4,
        border: 'solid 1px black',
      },
    },
    balanceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  });
};

type ProfileProps = WithStyles<ClassKey>;

const ProfileView = ({ classes }: ProfileProps) => {
  const { auth, user } = useContext(AuthContext);
  const { dataProvider, userBalance, refreshUserBalance } = useContext(
    DataContext,
  );
  const [isSent, setIsSent] = useState(false);
  const [list, setList] = useState<Array<List>>([]);
  const [historyList, setHistoryList] = useState<Array<RotatorItem>>([]);
  const [historyCache, setHistoryCache] = useState(0);
  const [activeItem, setActiveItem] = useState<RotatorItem>();
  const [activeItemList, setActiveItemList] = useState<List>();
  const [itemsList, setItemsList] = useState<Array<RotatorItem>>([]);
  const [itemsListCache, setItemsListCache] = useState(0);
  const itemsListCacheTimer = useRef<NodeJS.Timeout>();

  const updateActiveItem = useCallback(
    (newActiveItem) => {
      if (newActiveItem && newActiveItem.status === rotateStatus.ADDED) {
        setHistoryCache(historyCache + 1);
        setActiveItem(undefined);
        updateItemsList([]);
      } else if (JSON.stringify(activeItem) !== JSON.stringify(newActiveItem)) {
        setActiveItem(newActiveItem);
      }
    },
    [activeItem, setActiveItem, historyCache, setHistoryList, setItemsList],
  );

  const updateItemsList = useCallback(
    (newItemsList) => {
      setItemsList(newItemsList);
      if (newItemsList && newItemsList[0]) {
        setActiveItemList(newItemsList[0].list);
      } else {
        setActiveItemList(undefined);
      }
      if (itemsListCacheTimer.current) {
        clearTimeout(itemsListCacheTimer.current);
      }
      itemsListCacheTimer.current = setTimeout(() => {
        setItemsListCache(itemsListCache + 1);
      }, 10000);
    },
    [setItemsList, itemsListCacheTimer, itemsListCache, setItemsListCache],
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
    refreshUserBalance();
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
        updateItemsList(list);
        updateActiveItem(item);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [!!activeItem, itemsListCache]);

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
    (listId: string | number, direct?: boolean) => {
      dataProvider
        .listStart(listId, direct)
        .then((data = { url: '' }) => {
          if (data.url) {
            window.open(data.url, '_blank');
          } else {
            window.location.reload();
          }

          setHistoryCache(historyCache + 1);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [dataProvider, historyCache, setHistoryCache],
  );

  const onUserSelect = useCallback(
    (selectedItemId: string | number, index: number) => {
      if (!activeItem) {
        return;
      }
      dataProvider
        .addItemUser(activeItem.id, selectedItemId, index)
        .then((data) => {
          const { item, list } = data || {};
          updateActiveItem(item);
          updateItemsList(list);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [
      dataProvider,
      activeItem,
      updateActiveItem,
      updateItemsList,
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
    const { name } = activeItemList || {};
    activeOrList = (
      <div className={classes.activeItem}>
        <Typography className={classes.activeItemTitle} variant="h5">
          {name} Global Money List Rotator
        </Typography>
        <Typography className={classes.activeItemText}>
          You are about to enter the {name} Global Money List Rotator, but first
          you must click on six of our members usernames listed below to
          complete your entry. If #1 in the list has already been selected
          please proceed to click on the remaining position #2 through #6. The
          six members selected will earn {name} each and you'll be entering the
          money list for a total of 60 days.
        </Typography>

        <Typography className={classes.activeItemTable} component="div">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item, index) => {
                const onSelectedChange = (e: React.MouseEvent) => {
                  e.preventDefault();
                  onUserSelect(item.id, index);
                };
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <button
                        onClick={onSelectedChange}
                        disabled={item.isSelected}
                      >
                        {item.user.name}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Typography>
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

          const onPayDirectClick = (e: React.MouseEvent) => {
            e.preventDefault();
            onPaySubmit(id, true);
          };

          return (
            <li key={id} className={classes.gridItem}>
              <Typography className={classes.gridItemTop} component="div">
                60-day entry into the {name}
                <br />
                Global Money List revolver For ${price}
              </Typography>
              <div className={classes.gridItemBottom}>
                <a href="#" onClick={onPayClick}>
                  <img src={gpay} alt="gpay" />
                </a>
                <a href="#" onClick={onPayDirectClick}>
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
      <div className={classes.balanceRow}>
        <Typography variant="h6">Balance: ${userBalance || 0}</Typography>
        <PayOutButton />
      </div>

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
      ) : null}

      <PayOutHistory />
    </Container>
  );
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;
