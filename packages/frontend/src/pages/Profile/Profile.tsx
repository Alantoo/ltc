import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
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

const rotateTimeToStr = (rotateTime: string): string => {
  const num = parseInt(rotateTime.slice(0, -1), 10);
  const mes = rotateTime.slice(-1);
  const measure = mes === 'd' ? 'day' : 'minute';
  return `${num}-${measure}`;
};

const countToStr = (count: number): string => {
  switch (count) {
    case 1: {
      return 'one';
    }
    case 2: {
      return 'two';
    }
    case 3: {
      return 'three';
    }
    case 4: {
      return 'four';
    }
    case 5: {
      return 'five';
    }
    case 6: {
      return 'six';
    }
    case 7: {
      return 'seven';
    }
    case 8: {
      return 'eight';
    }
    case 9: {
      return 'nine';
    }
    default: {
      return 'unknown';
    }
  }
};

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
  | 'balanceRow'
  | 'verifyInput'
  | 'verifyInputError'
  | 'verifyImg';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
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
  const [itemsList, setItemsList] = useState<Array<RotatorItem>>([]);
  const [itemsListCache, setItemsListCache] = useState(0);
  const itemsListCacheTimer = useRef<NodeJS.Timeout>();

  const updateActiveItem = useCallback(
    (newActiveItem) => {
      if (newActiveItem && newActiveItem.status === rotateStatus.ADDED) {
        setActiveItem(undefined);
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

  const userLink = `${window.location.origin}/${encodeURIComponent(
    user.name,
  )}/`;

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
  let listsListEl = null;

  if (activeItem) {
    const { name } = activeItemList || {};
    activeItemEl = (
      <div className={classes.activeItem}>
        <Typography className={classes.activeItemTitle} variant="h5">
          {name} Global Money List
        </Typography>
        <Typography className={classes.activeItemText}>
          You are about to enter the {name} Money List, but first you{' '}
          <b>must</b> click on seven of our members usernames randomly rotating
          through the money list starting at #1-7. The seven members selected
          will earn {name} each in the cryptocurrency of their choice and you’ll
          be entering the {name} money list for a total of 60 days. Once payment
          is made to the selected member, you must copy and paste the correct
          transaction i.d. from payment receipt into the designated slot and
          then click on verify button. You <b>must</b> verify each payment made
          to the selected members to be added to the {name} money list. After
          each payment made to selected members Check your email for transaction
          receipt. You must make sure to send the correct cryptocurrency to each
          member’s crypto address or those funds will be lost and never
          recovered.
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
                            itemId={activeItem.id}
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

  return (
    <Container maxWidth="xl">
      <Typography className={classes.text}>
        Share your affiliate link below to build your referral list
        <br />
        <a href={userLink} target="_blank">
          {userLink}
        </a>
      </Typography>
      {/*<div className={classes.balanceRow}>*/}
      {/*  <Typography variant="h6">Balance: ${userBalance || 0}</Typography>*/}
      {/*  <PayOutButton />*/}
      {/*</div>*/}

      {activeItemEl}

      <Typography component="div" className={classes.text}>
        <h2 className="h2 center">Takes less than 5 minutes to get started!</h2>
        <h3 className="h3">The Money Lists</h3>
        <p>
          The money lists work by using an algorithm to randomly rotate each
          member username through the money lists of other members free Global
          Money List websites. All positions in the money lists randomly rotate
          every ten seconds. There are six separate Money Lists your username
          can rotate through. There’s a $1.00 Money List, $5.00 Money List,
          $10.00 Money List, $20.00 Money List, $50.00 Money List, and a $100.00
          Money List you can be added to.
        </p>
        <p>
          Here’s the cost to be added to our various Money Lists. All payments
          must be made in one of the many cryptocurrencies we accept!
        </p>
        <p>
          <b>$100.00</b> Money List is <b>$2.95</b> per 60-day entry. You must also pay two
          random members <b>$100.00</b> each in cryptocurrency before you can be added
          to this Money List.
          <br />
          <b>$50.00</b> Money List is <b>$2.95</b> per 60-day entry. You must also pay three
          random members <b>$50.00</b> each in cryptocurrency before you can be added
          to this Money List.
          <br />
          <b>$20.00</b> Money List is <b>$2.95</b> per 60-day entry. You must also pay four
          random members <b>$20.00</b> each in cryptocurrency before you can be added
          to this Money List.
          <br />
          <b>$10.00</b> Money List is <b>$2.95</b> per 60-day entry. You must also pay five
          random members <b>$10.00</b> each in cryptocurrency before you can be added
          to this Money List.
          <br />
          <b>$5.00</b> Money List is <b>$2.95</b> per 60-day entry. You must also pay six
          random members <b>$5.00</b> each in cryptocurrency before you can be added to
          this Money List.
          <br />
          $1.00 Money List is <b>$2.95</b> per 60-day entry. You must also pay seven
          random members <b>$1.00</b> each in cryptocurrency before you can be added to
          this Money List.
        </p>
        <p>
          All earnings will be paid to you with one of the cryptocurrencies
          listed below.
          <br />
          Ethereum
          <br />
          Polygon
          <br />
          Bitcoin
          <br />
          Dogecoin
          <br />
          Litecoin
          <br />
          Stellar Lumens
          <br />
          Ripple network
          <br />
          all ERC-20 tokens
        </p>
        <p>
          You can join any of the money lists after you have signed up. You can
          pay to be added to the money lists as many times as you like! Global
          Money List currently signup hundreds of new members daily increasing
          your chance to win! Make sure to add yourself to the Money Lists as
          soon as possible!
        </p>
        <h3 className="h3">How to be added to the money lists</h3>
        <ul>
          <li>
            You must download Coinbase free cryptocurrency wallet to
            automatically collect your earnings.
          </li>
          <a
            href="https://wallet.coinbase.com/?utm_source=google_search_b&utm_medium=cpc&utm_campaign=15497172649&utm_content=133267465160&utm_term=coinbase&utm_creative=567664243589&cb_device=c&cb_placement=&cb_country=us&cb_city=open&cb_language=en_us&gclid=CjwKCAiA-9uNBhBTEiwAN3IlNFxO-wyKywn67Y8mqMhJof9hg1rN5bH5jaMaEr3-4i_NFZDQTuk_UhoCcocQAvD_BwE"
            className="link"
          >
            Click here to download.
          </a>
          <li>
            To purchase cryptocurrency from Coinbase you must first create an
            account.
          </li>
          <li>Select one of our six Global Money Lists to enter.</li>
          <li>
            You must use your Coinbase cryptocurrency wallet to Make the $2.95
            process fee to Global Money List.
          </li>

          <li>
            When your payment is accepted, you’re taken to a page where the
            money list you paid to be added to is now present.
          </li>
          <li>
            You must now click on the required number of members randomly
            rotating through the money list revolver starting at #1.
          </li>
          <li>
            Each of the members who username you’ve clicked on in the money list
            will be paid directly by you from your Coinbase wallet into their
            Coinbase wallet.
          </li>
          <li>
            Once payment is made to selected member, you must copy and paste the
            correct transaction i.d. from payment receipt into required slot and
            then click on verify button. You must verify each payment made to
            the selected members to be added to the money list.
          </li>
          <li>
            If you signed up on one of our members affiliate links that member
            will automatically be locked in the #1 position of the money list
            and receive the first payment.
          </li>
        </ul>
        <h3 className="h3">Referral List</h3>
        <p>
          Building your referral list is the most important way to create
          residual income using this online lottery system. Here’s how it works!
          When someone click on your affiliate link and sign up, they’re
          automatically added to your referral list. When any member listed in
          your referral list pay to be added to any of our money lists, your
          username will be locked in the #1 position of their money list. Once
          clicked on You’ll be paid either $1.00, $5.00, $10.00, $20.00, $50.00,
          or $100.00 in cryptocurrency depending on which money list your
          referral decides to be added to. Your referral will now click on the
          required amount members usernames randomly rotating through the money
          list to have themselves added to that money list. There is no limit to
          how large your referral list can grow to be, so the larger the list
          the more income for you. There’s absolutely no cost to you for
          building your referral list. Go to your homepage and copy your
          affiliate link to share with all of your family, friends, and network
          associates. This will rapidly grow your referral list causing you to
          earn unlimited amounts of income even long after you stopped promoting
          this system.
        </p>
      </Typography>

      {listsListEl}

      {/*<PayOutHistory />*/}
    </Container>
  );
};

export const Profile = withStyles(styles)(ProfileView);

export default Profile;
