import React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import banner from 'assets/banner.png';
import blueBg from 'assets/blue-bg.png';
import { MyTheme } from 'theme';

type ClassKey = 'root' | 'introSlide' | 'simpleSlide' | 'bgSlide';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
    introSlide: {
      position: 'relative',
      minHeight: 200,
      padding: '5% 0',
      textAlign: 'center',
      color: myTheme.palette.background.default,
      background: `url("${banner}")`,
      backgroundSize: 'cover',
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
      '& a': {
        margin: '10px 0',
        display: 'inline-block',
        padding: '15px 30px',
        background: myTheme.palette.primary.main,
        color: 'black',
        textDecoration: 'none',
        '&:hover': {
          background: lighten(myTheme.palette.primary.main, 0.2),
        },
      },
    },
    simpleSlide: {
      padding: '4% 0',
      '& .center': {
        textAlign: 'center',
      },
      '& a': {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
    bgSlide: {
      padding: '3% 0',
      background: `url("${blueBg}")`,
      backgroundSize: 'cover',
      color: myTheme.palette.background.default,
      '& hr': {
        borderWidth: '0 0 3px 0',
        borderColor: myTheme.palette.background.default,
        width: '40%',
        margin: '25px auto',
      },
    },
  });
};

type HomeProps = WithStyles<ClassKey>;

const HomeView = ({ classes }: HomeProps) => {
  return (
    <>
      <div className={`${classes.introSlide} gradientBg`}>
        <Container maxWidth="xl">
          <Typography component="div">
            <h2 className="h2">
              EARN HUNDREDS OF DOLLARS IN CRYPTOCURRENCY DAILY
            </h2>
            <h3 className="h3">
              The easiest way you’ll ever receive Bitcoins!
            </h3>
            <p>***Make unlimited cash flow in our cryptocurrency lists***</p>
            <p>
              ***Build your referral list and make money on autopilot without
              spending a dime***
            </p>
            <h3 className="h3">
              Takes less than 5 minutes to start earning a lifetime of income
            </h3>
            <a href="#" className="btn">
              GET YOUR FREE WEBSITE NOW!
            </a>
          </Typography>
        </Container>
      </div>
      <div className={classes.simpleSlide}>
        <Container maxWidth="xl">
          <Typography component="div">
            <p>
              Are you tired of joining money making opportunities only to
              discover you’ve wasted your precious time on advertising a biz
              that makes little to no money? Unfortunately, the internet is
              riddled with scams like this costing you more money than you’ll
              earn. Global Money List is the commonsense solution to your
              money-making woes. When you join Global Money List your username
              can be added to any of our six rotating money lists. Every time a
              member clicks on your username rotating through the money list,
              you’ll be paid either $1.00, $5.00, $10.00, $20.00, $50.00, or
              $100.00 in bitcoin or other cryptocurrencies. You’ll also receive
              a free copy of this website to share with others and build your
              referral list.
            </p>
            <p>
              There are many money list systems out there, but what makes Global
              Money List different is our system is cheat proof. Similar money
              list systems have many dishonest participants who never pay the
              members who are already listed, but add themselves to the list.
              This prompts many to label these money-making opportunities as
              scams. Global Money List guarantees you six members will be paid
              prior to any member entering the money list revolver. Our members
              who enter the money list revolver will consistently rotate for a
              whopping 60 days! Can you imagine walking into a casino and having
              the opportunity to pay a one-time fee to have unlimited play on a
              slot machine for 60 days. This is exactly what Global Money List
              is offering you with our one-of-a-kind cash flow system. Our money
              lists automatically rotate our members username randomly every 10
              seconds giving you the best possibility to make hundreds maybe
              even thousands of dollars in cryptocurrency every day! Most money
              list systems require you send money to the participants listed via
              PayPal which violate their rules and cause PayPal to suspend or
              terminate your account. Our system will allow you to transfer your
              earnings directly into your cryptocurrency wallet.
            </p>
            <h3>The Money List Revolvers</h3>
            <p>
              The Money List Revolvers work by randomly rotating each member
              username through the money lists of other members free Global
              Money List websites. All six positions in the Money Lists randomly
              rotate every ten seconds. There are six separate Money List
              revolvers your username can rotate through. There’s a $1.00 Money
              List, $5.00 Money List, $10.00 Money List, $20.00 Money List,
              $50.00 Money List, and a $100.00 Money List you can added to.
            </p>
            <p>
              Here’s the cost to be added to our various Money List Revolvers.
              All payments must be made in one of the many cryptocurrencies we
              accept!
            </p>
            <p>
              $100.00 Money List Revolver is $604.95 per 60 days.
              <br />
              $50.00 Money List Revolver is $304.95 per 60 days.
              <br />
              $20.00 Money List Revolver is $124.95 per 60 days.
              <br />
              $10.00 Money List Revolver is $64.95 per 60 days.
              <br />
              $5.00 Money List Revolver is $34.95 per 60 days.
              <br />
              $1.00 Money List Revolver is $10.95 per 60 days.
            </p>
            <p>
              All earnings will be paid to you in the cryptocurrency members use
              when being added to the money list. If a member make payment using
              bitcoin and click on your username rotating through the money
              list, you’ll receive your payment in bitcoin.
            </p>
            <p>
              You can join the Money List Revolvers after you have signed up.
              You can pay to be added to the money list revolvers as many times
              as you like! Global Money List currently issues out over 1000 free
              copies of this website daily This means your username will rotate
              through all our members free Global Money List websites making
              your income grow faster! Make sure to add yourself to the Money
              List Revolver as soon as possible! Please click here to view our
              video to better understand how the Money List Revolver Works.
            </p>
          </Typography>
        </Container>
      </div>
      <div className={classes.bgSlide}>
        <Container maxWidth="xl">
          <Typography component="div">
            <h3>How you’ll earn using the Global Money List system</h3>
            <hr />
            <ul>
              <li>
                Signup to create your <b>FREE</b> Global Money List account.
              </li>
              <li>
                Make sure to go to your email account and validate your email
                address.
              </li>
              <li>
                Login your Global Money List account and select one of our three
                Global Money List revolvers to enter.
              </li>
              <li>
                Select your preferred payment option and make the required
                payment to enter the Global Money List revolver you’ve selected.
              </li>
              <li>
                When your payment is accepted, you’re taken to a page where The
                Money List Revolver you paid to be added to is now present.
              </li>
              <li>
                You <b>must</b> now click on six of our members usernames
                rotating through the money list starting at #1-6. You
                <b>must</b> complete this step to be added to The Money List
                Revolver. If you signed up on one of our members free Global
                Money List website that member will automatically be locked in
                the #1 position of the money list revolver and receive the first
                payment.
              </li>
              <li>
                Each of the six members who username you’ve clicked on in The
                Money List Revolver will be paid depending on which money list
                revolver you selected to enter. For example, if you’ve selected
                the $10.00 money list revolver for each of the six members whose
                username received a click, they will be paid $10.00 in
                cryptocurrency each.
              </li>
              <li>
                Go to your homepage after login and copy the link to your free
                Global Money List website to share with all of your family,
                friends, and network associates. This will rapidly grow your
                referral list causing you to earn unlimited amounts of income
                even long after you stopped promoting this system. Please see
                below for better understanding of the referral list.
              </li>
            </ul>
          </Typography>
        </Container>
      </div>
      <div className={classes.simpleSlide}>
        <Container maxWidth="xl">
          <Typography component="div">
            <h3 className="center">Referral List</h3>
            <p>
              Building your referral list is the most important way to create
              residual income using this money-making opportunity. Here’s how it
              works! When someone signs up while visiting your free Global Money
              List website, they’re automatically added to your referral list.
              When any member listed in your referral list pay to be added to
              the Global Money List revolvers, your username will be locked in
              the #1 position of their money list revolver. Once clicked on
              You’ll be paid either $1.00, $5.00, $10.00, $20.00, $50.00, or
              $100.00 in cryptocurrency depending on which money list revolver
              your referral decides to be added to. Your referral will now click
              on five more members usernames rotating through the money list in
              order to have themselves added to the money list. There is no
              limit how large your referral list can grow to be, so the larger
              the list the more income for you. There’s absolutely no cost to
              you for building your referral list.
            </p>
            <h3 className="center">
              Hey, what are you waiting on?
              <br />
              <a href="#">Join Now!</a>
            </h3>
          </Typography>
        </Container>
      </div>
    </>
  );
};

export const Home = withStyles(styles)(HomeView);

export default Home;
