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
  | 'gridItemBottom';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    grid: {
      margin: '0 -10px 0 -10px',
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
  const [usersList, setUsersList] = useState<Array<User>>([]);

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
        setUsersList([]);
      } else if (JSON.stringify(activeItem) !== JSON.stringify(newActiveItem)) {
        setActiveItem(newActiveItem);
      }
    },
    [activeItem, setActiveItem, historyCache, setHistoryList, setUsersList],
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
        setUsersList(list);
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
          setUsersList(list);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [dataProvider, updateActiveItem, setUsersList],
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
          setUsersList(list);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [
      dataProvider,
      activeItem,
      updateActiveItem,
      setUsersList,
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

  if (activeItem) {
    const { selected = [] } = activeItem;
    return (
      <Container maxWidth="xl">
        <div>Active item</div>
        <ul>
          {usersList.map((item: User) => {
            const isSelected = selected.includes(`${item.itemId}`);
            const onSelectedChange = (e: React.ChangeEvent) => {
              e.preventDefault();
              onUserSelect(item.itemId);
            };
            return (
              <li key={item.itemId}>
                <Checkbox
                  onChange={onSelectedChange}
                  disabled={isSelected}
                  checked={isSelected}
                />
                {item.email}
              </li>
            );
          })}
        </ul>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
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

      <div>
        {historyList.map((historyItem) => {
          return <div key={historyItem.id}>{historyItem.id}</div>;
        })}
      </div>
    </Container>
  );
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;
