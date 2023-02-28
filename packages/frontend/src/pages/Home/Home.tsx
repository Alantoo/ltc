import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { AuthContext } from 'contexts/AuthContext';
import banner from 'assets/banner.png';
import blueBg from 'assets/blue-bg.png';
import { MyTheme } from 'theme';
import { MainImgWithContent } from '../../components/MainImgWithContent';
import { Paragraph } from '../../components/Paragraph';
import { ThreeColumnsPicture } from '../../components/ThreeColumnsPiture';
import editWithPerson from 'assets/snapEdit.png';
import { WhatAreYouWaitingOn } from '../../components/WhatAreYouWaitingFor';
type ClassKey =
  | 'root'
  | 'introSlide'
  | 'simpleSlide'
  | 'bgSlide'
  | 'threeColumnsPicture';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      overflow: 'hidden',
      '& .center': {
        textAlign: 'center',
      },
      '& .buttonInImg': {
        background: '#FF8121',
        borderRadius: '5px',
        fontFamily: 'Halant',
        fontWeight: '700',
        fontSize: '21px',
        color: 'white',
        border: 'unset',
        padding: '10px 24px',
        margin: '36px auto 0',
        height: '48px',
        width: 152,
      },
    },
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
      '& .link': {
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
    threeColumnsPicture: {
      margin: '32px 0 0 0',
    },
  });
};

type HomeProps = WithStyles<ClassKey>;

const HomeView = ({ classes }: HomeProps) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }
  if (user) {
    return <Redirect to="/profile" />;
  }
  return (
    <div className={classes.root}>
      <MainImgWithContent
        title="global money list"
        subtitle="The greatest Residual Income System Ever! Earn hundreds of dollars in bitcoin daily"
      >
        <button className="buttonInImg">Join Now</button>
      </MainImgWithContent>
      <Paragraph
        title="Welcome to Global Money List the easiest way to earn unlimited amounts of Bitcoin or Ethereum cryptocurrency daily."
        subtitle="When you join Global Money List you can be added to any of our six money lists. Every time a member clicks on your username rotating through the money lists, you’ll be paid either$1.00, $5.00, $10.00, $20.00, $50.00, or $100.00 in Bitcoin or Ethereum. You’ll also receive an affiliate link to share with others and build your referral list which allows you to make money on autopilot."
        subtitleTopMargin={15}
        subtitleLineHeight="26.78px"
        containerMargin={'42px auto 0 117px'}
      />
      <ThreeColumnsPicture
        leftColumn={{
          isList: false,
          lineContent: `What makes Global Money List system cheat proof is that themembers select the winners who are 
          randomly rotating throughthe money lists. Global Money List guarantees you as many asseven members will be 
          paid prior to any member entering themoney lists. Members who enter any of our money lists willconsistently 
          rotate for a whopping 60 days! Can you imaginewalking into a casino and having the opportunity to pay 
          aone-time fee to have unlimited play on a slot machine for 60days. This is exactly what Global Money List is
           offering you withour one-of-a-kind residual income system. Our money listsautomatically rotate our members
            username randomly every10 seconds giving you the best possibility to make hundredsmaybe even thousands of
             dollars in Bitcoin or Ethereumcryptocurrency every day! Our system is designed to deposityour winnings 
             instantly into your cryptocurrency wallet.`,
          list: [],
        }}
        rightColumn={{
          isList: true,
          lineContent: '',
          list: [
            'Free to signup',
            'Six money lists to choose from',
            'Each entry is for 60 days',
            'Share your affiliate link to build your referral list',
            'Winnings instantly deposited into your crypto wallet',
            'Build your referral list and make money on autopilot',
            'Our money list system is cheat proof',
            'Unlimited entry into our money lists',
            'The easiest way you’ll ever receive Bitcoins',
            'Anybody anywhere can participate and win',
          ],
        }}
        img={editWithPerson}
        imgAlt="picture with person and money"
        imgWidth={1478}
        imgHeight={535}
        extraClass={classes.threeColumnsPicture}
      />
      <Paragraph
        title={`Referral List`}
        subtitle={`Building your referral list is the most important way to create residual income using this system. Here’s how it works! When someone click on your affiliate link and sign up, they’reautomatically added to your referral list. When any member listed in your referral list pay to be added to any of our money lists, your username will be locked in the #1 position of theirmoney list. Once clicked on You’ll be paid either $1.00, $5.00, $10.00, $20.00, $50.00, or $100.00 in cryptocurrency depending on which money list your referral decides to be added to.Your referral will now click on the required number of members usernames randomly rotating through the money list to have themselves added to that money list. There is no limit tohow large your referral list can grow to be, so the larger the list the more income for you. Go to your homepage and copy your affiliate link to share with all of your family, friends, andnetwork associates. This will rapidly grow your referral list causing you to earn unlimited amounts of income even long after you stopped promoting this system.
        `}
        subtitleTopMargin={3}
        subtitleLineHeight="31px"
        containerMargin="70px auto 0 71px"
      />
      <WhatAreYouWaitingOn />
    </div>
  );
};

export const Home = withStyles(styles)(HomeView);

export default Home;
