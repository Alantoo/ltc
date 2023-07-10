import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import profileStyles from './Profile.module.scss';
import { Redirect } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import {
  DataProvider,
  List,
  RotatorItem,
  ItemStatus,
  rotateStatus,
} from 'dataProvider';
import { MyTheme } from 'theme';
import { rotateTimeToStr } from '../../helpers/rotateTimeToStr';
import { countToStr } from '../../helpers/countToStr';
import { AboutContent } from '../About/AboutContent';
import { DoubleEntryOffer } from '../../components/DoubleEntryOffer';
import { SingleEntryOffer } from '../../components/SingleEntryOffer';
import { MainImgWithContent } from '../../components/MainImgWithContent';

const IS_DEV = window.localStorage['IS_DEV'] === 't';

type ClassKey =
  | 'root'
  | 'loading'
  | 'text'
  | 'verify'
  | 'grid'
  | 'gridItem'
  | 'gridItemTop'
  | 'gridItemBottom'
  | 'activeItem'
  | 'activeItemTitle'
  | 'activeItemText'
  | 'activeItemTable'
  | 'success'
  | 'balanceRow'
  | 'verifyInput'
  | 'verifyInputError'
  | 'verifyImg';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 30,
    },
    text: {
      '& a': {
        color: '#0fa5df',
        textDecoration: 'none',
      },
      '& a:hover': {
        textDecoration: 'underline',
      },
      '& .h2': {
        margin: 0,
        marginBottom: '1%',
      },
      '& .h3': {
        margin: 0,
        marginBottom: '1%',
      },
      '& p': {
        margin: 0,
        marginBottom: '1%',
      },
      '& .center': {
        textAlign: 'center',
      },
    },
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
      padding: '10px 15px',
      textAlign: 'center',
      '& > a': {
        display: 'inline-block',
        margin: '0 5px',
        padding: '10px 20px',
        borderRadius: 20,
        background: '#052f85',
        color: 'white',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
      },
      '& > a:hover': {
        background: '#114abe',
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
        fontSize: 18,
      },
      '& td, & th': {
        padding: 10,
        border: 'solid 1px black',
        background: myTheme.palette.primary.main,
      },
      '& td:first-child, & th:first-child': {
        width: '1%',
      },
    },
    success: {
      textAlign: 'center',
    },
    verify: {
      padding: '30px 0',
      textAlign: 'center',
    },
    balanceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    verifyInput: {
      height: 21,
      width: 400,
    },
    verifyInputError: {
      fontSize: 13,
      color: 'red',
    },
    verifyImg: {
      width: 150,
      height: 150,
    },
  });
};

type CheckFormProps = WithStyles<ClassKey> & {
  itemId: string | number;
  selectId: string | number;
  dataProvider: DataProvider;
  onUpdate: (data: ItemStatus) => void;
};

const CheckForm = ({
  classes,
  itemId,
  selectId,
  dataProvider,
  onUpdate,
}: CheckFormProps) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    setError('');
    dataProvider
      .addItemApproveUser(itemId, selectId, text)
      .then((data) => {
        onUpdate(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  return (
    <form action="#" onSubmit={onFormSubmit}>
      <input
        className={classes.verifyInput}
        type="text"
        value={text}
        onChange={onChange}
        placeholder="Transaction ID"
        disabled={loading}
      />
      <button disabled={loading}>verify</button>
      <br />
      <div className={classes.verifyInputError}>{error}</div>
    </form>
  );
};

type ProfileProps = WithStyles<ClassKey>;

const ProfileView = ({ classes }: ProfileProps) => {
  const { auth, user, loading } = useContext(AuthContext);
  const { dataProvider } = useContext(DataContext);
  const [isSent, setIsSent] = useState(false);
  const [list, setList] = useState<Array<List>>([]);
  const [activeItem, setActiveItem] = useState<RotatorItem>();
  const [activeItemList, setActiveItemList] = useState<List>();
  const [activeItemSuccess, setActiveItemSuccess] = useState('');
  const [itemsList, setItemsList] = useState<Array<RotatorItem>>([]);
  const [itemsListCache, setItemsListCache] = useState(0);
  const itemsListCacheTimer = useRef<NodeJS.Timeout>();

  const updateActiveItem = useCallback(
    (newActiveItem) => {
      if (newActiveItem && newActiveItem.status === rotateStatus.ADDED) {
        setActiveItem(undefined);
        if (activeItemList) {
          setActiveItemSuccess(activeItemList.name);
        }
        updateItemsList([]);
      } else if (JSON.stringify(activeItem) !== JSON.stringify(newActiveItem)) {
        setActiveItem(newActiveItem);
      }
    },
    [activeItem, setActiveItem, setItemsList],
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
    // refreshUserBalance();
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
  }, [activeItem, itemsListCache]);

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
      setActiveItemSuccess('');
      dataProvider
        .listStart(listId, direct)
        .then((data = { url: '' }) => {
          if (data.url) {
            window.open(data.url, '_blank');
          } else {
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [dataProvider],
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
    [dataProvider, activeItem, updateActiveItem, updateItemsList],
  );

  const onUserSelectUpdate = useCallback(
    (data) => {
      if (!data) {
        return;
      }
      const { item, list } = data || {};
      updateActiveItem(item);
      updateItemsList(list);
    },
    [updateActiveItem, updateItemsList],
  );

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/" />;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userLink = `${window.location.origin}/${encodeURIComponent(
    user?.name ?? 'unknown',
  )}/`;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

  let activeItemEl = null;
  let activeItemSuccessEl = null;
  let listsListEl = null;

  if (activeItem) {
    const { name, selectCount } = activeItemList || {};
    activeItemEl = (
      <div className={classes.activeItem}>
        <Typography className={classes.activeItemTitle} variant="h5">
          {name} Global Money List
        </Typography>
        <Typography className={classes.activeItemText}>
          You are about to enter the {name} Money List, but first you{' '}
          <b>must</b> click on {countToStr(selectCount)} of our members
          usernames randomly rotating through the money list starting at #1-7.
          The {countToStr(selectCount)} members selected will earn {name} each
          in the cryptocurrency of their choice and you’ll be entering the{' '}
          {name} money list for a total of 60 days. Once payment is made to the
          selected member, you must copy and paste the correct transaction i.d.
          from payment receipt into the designated slot and then click on verify
          button. You <b>must</b> verify each payment made to the selected
          members to be added to the {name} money list. After each payment made
          to selected members Check your email for transaction receipt. You must
          make sure to send the correct cryptocurrency to each member’s crypto
          address or those funds will be lost and never recovered.
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

                const onApproveUpdate = (data: ItemStatus) => {
                  onUserSelectUpdate(data);
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
                      <br />
                      {item.isSelected && !item.isPaid ? (
                        <>
                          {item.payAddress} - {item.payAmount} {item.payType}
                          <br />
                          {item.payQrCode ? (
                            <img
                              className={classes.verifyImg}
                              src={item.payQrCode}
                              alt="qr-code"
                            />
                          ) : null}
                          <CheckForm
                            itemId={activeItem?.id ?? index}
                            selectId={item.id}
                            onUpdate={onApproveUpdate}
                            dataProvider={dataProvider}
                            classes={classes}
                          />
                        </>
                      ) : null}
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
    listsListEl = (
      <ul className={classes.grid}>
        {list.map(
          ({ id, name, price, entryPrice, selectCount, rotateTime }) => {
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
                  {rotateTimeToStr(rotateTime)} entry into {name} <br />
                  Money List for ${entryPrice.toFixed(2)} plus pay <br />{' '}
                  {countToStr(selectCount)} members ${price.toFixed(2)} each in{' '}
                  <br /> Cryptocurrency
                </Typography>
                <Typography className={classes.gridItemBottom} component="div">
                  <a onClick={onPayClick}>Pay Now</a>
                  {IS_DEV ? (
                    <a onClick={onPayDirectClick}>Pay Dev Now</a>
                  ) : null}
                </Typography>
              </li>
            );
          },
        )}
      </ul>
    );
  }

  if (activeItemSuccess) {
    activeItemSuccessEl = (
      <Typography className={classes.success} component="div">
        <h3 className="h3">
          Congratulation you’ve been entered into the {activeItemSuccess} Money
          List
        </h3>
      </Typography>
    );
  }

  return (
    <div className={classes.root}>
      <MainImgWithContent
        title="global money list"
        subtitle="The greatest Residual Income System Ever! Earn hundreds of dollars in bitcoin daily"
        align="center"
      />
      {activeItemEl}
      {activeItemSuccessEl}
      <AboutContent />
      <p className={profileStyles.secondEntryTitle}>
        Add a second entry of yourself into the money list you choose for less
        than 25% more of the total cost. Instead of one entry You’ll have two
        separate entries in the money list you choose which will greatly
        increase your chances to earn money. Please see prices below.
      </p>
      <DoubleEntryOffer
        offers={list.filter((offer) => offer.selectCount === 2)}
      />
      <p className={profileStyles.notInterestedText}>
        Not Interested in our double entry offer? No problem, simply make a
        selection below for a single entry into one of the money lists of your
        choice.
      </p>
      <SingleEntryOffer
        offers={list.filter((offer) => offer.selectCount === 1)}
      />
      );
    </div>
  );
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;
