import React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'center';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    center: {
      textAlign: 'center',
    },
  });
};

type PrivacyProps = WithStyles<ClassKey>;

const PrivacyView = ({ classes }: PrivacyProps) => {
  return (
    <Container maxWidth="xl">
      <Typography component="div">
        <p>
          Q) Will my referral list remain active if I close/delete my account?
        </p>
        <p>
          A) Your referral list will only be active for the duration of your
          account meaning you will lose all the participants in your referral
          list if you close your account or your account is terminated.
        </p>
        <p>Q) Where can I find my free Global Money List website link?</p>
        <p>
          A) Your free Global Money List website link is located on the upper
          left-hand corner of your homepage after you`ve login.
        </p>
        <p>
          Q) What type of payment are accepted for entry into the Global Money
          List?
        </p>
        <p>
          A) We only accept these cryptocurrencies Ethereum, Polygon, Bitcoin,
          Dogecoin, Litecoin, Stellar Lumens, and Ripple network.
        </p>
        <p>
          Q) What other payments options are provided for entry into the Global
          Money List?
        </p>
        <p>A) There is no other payment option at this moment.</p>
        <p>
          Q) What is the duration of each paid entry into the Global Money List
          revolvers?
        </p>
        <p>
          A) There`s a duration of 60 days for each paid entry into any of our
          six Money List.
        </p>
        <p>Q) How many times can I enter any of the Money List?</p>
        <p>A) As often as you like. There`s no limits.</p>

        <p>
          Q) How will I know the link to my free Global Money List website is
          actually mine?
        </p>
        <p>
          A) If you look closely at the link to your free Global Money List
          website, you`ll see your username which is uniquely yours.
        </p>
        <p>Q) How do I build my Referral list?</p>
        <p>
          A) Share your free Global Money List website link with friends,
          family, and network associates.
        </p>
        <p>
          Q) What happens when a member of my referral list pays to enter into
          any of the Global Money List revolvers?
        </p>
        <p>
          A) You will be locked in the first position of that particular Global
          Money List revolver and automatically paid.
        </p>
        <p>Q) Does it cost to sign up and create an account?</p>
        <p>A) No, it`s free to sign up and create an account.</p>
        <p>Q) How do I receive my winnings?</p>
        <p>
          A) Our system will deposit your winnings directly into your
          cryptocurrency wallet.
        </p>
        <p>
          Q) Am I obligated to make payments on Global Money List using my
          Coinbase cryptocurrency wallet?
        </p>
        <p>
          A) You`re only obligated to use your Coinbase cryptocurrency wallet
          when making a payment directly to Global Money List.
        </p>
        <p>Q) How much are Coinbase cryptocurrency wallets?</p>
        <p>
          A) They`re free! You can Click here to download a free Coinbase
          cryptocurrency wallet.
        </p>
      </Typography>
    </Container>
  );
};

export const FAQ = withStyles(styles)(PrivacyView);

export default FAQ;
