import React, { useContext, useCallback, useState } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { DataContext } from 'contexts/DataContext';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'holder' | 'card' | 'closeBtn' | 'formTitle' | 'field';

const styles = (theme: Theme) => {
  const psTheme = theme as MyTheme;
  return createStyles({
    root: {},
    holder: {
      position: 'relative',
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      padding: '47px 24px 22px',
      borderRadius: 15,
      position: 'relative',
      width: '100%',
      maxWidth: 400,
      boxShadow:
        'inset 32.6px -32.6px 32.6px rgba(194, 194, 194, 0.176), inset -32.6px 32.6px 32.6px rgba(255, 255, 255, 0.176)',
      [psTheme.breakpoints.down('sm')]: {
        maxWidth: 500,
        margin: '0 auto',
      },
      '& > div': {
        padding: 0,
      },
    },
    closeBtn: {
      position: 'absolute',
      top: 15,
      right: 15,
    },
    formTitle: {
      padding: '0 15px',
    },
    field: {
      marginBottom: 20,
    },
  });
};

type PayOutPopupProps = WithStyles<ClassKey>;

const PayOutPopupView = ({ classes }: PayOutPopupProps) => {
  const { dataProvider, payOutPopupOpened, setPayOutPopupOpened } = useContext(
    DataContext,
  );
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [amountError, setAmountError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const onCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setPayOutPopupOpened(false);
      setIsSuccess(false);
      setAmount('');
      setAddress('');
    },
    [setPayOutPopupOpened],
  );

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setAmountError('');
  };

  const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setAddressError('');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError('');
    setAddressError('');
    dataProvider
      .createPayOutRequest({ amount, address })
      .then(({ error }) => {
        if (error) {
          if (error.address) {
            setAddressError(error.address);
          }
          if (error.amount) {
            setAmountError(error.amount);
          }
          if (typeof error === 'string') {
            setGlobalError(error);
          }
        } else {
          setIsSuccess(true);
          // refreshUserBalance();
        }
      })
      .catch((err) => {
        setGlobalError(err.message);
        console.error(err);
      });
  };

  return (
    <Modal className={classes.root} open={payOutPopupOpened}>
      <div className={classes.holder}>
        <Card className={classes.card} elevation={3}>
          <form onSubmit={onSubmit}>
            <Typography variant="h6" className={classes.formTitle}>
              Payout request
            </Typography>
            {isSuccess ? (
              <CardContent>
                <div>
                  <Typography>Request created</Typography>
                </div>
                <IconButton
                  className={classes.closeBtn}
                  size="small"
                  onClick={onCloseClick}
                >
                  <CloseIcon />
                </IconButton>
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <div>
                    <TextField
                      className={classes.field}
                      label="Amount"
                      variant="outlined"
                      value={amount}
                      onChange={onAmountChange}
                      error={!!amountError}
                      helperText={amountError ? amountError : ''}
                      fullWidth
                    />
                    <TextField
                      className={classes.field}
                      label="Address"
                      value={address}
                      onChange={onAddressChange}
                      error={!!addressError}
                      helperText={addressError ? addressError : ''}
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                  <IconButton
                    className={classes.closeBtn}
                    size="small"
                    onClick={onCloseClick}
                  >
                    <CloseIcon />
                  </IconButton>
                </CardContent>
                <CardActions>
                  <Button type="submit" variant="contained" color="primary">
                    Get Paid
                  </Button>
                </CardActions>
              </>
            )}
          </form>
        </Card>
      </div>
    </Modal>
  );
};

export const PayOutPopup = withStyles(styles)(PayOutPopupView);

export default PayOutPopup;
