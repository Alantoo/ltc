import React from 'react';
import Typography from '@material-ui/core/Typography';
import { MyFAQ } from './MyFAQ';
import styles from './FAQ.module.scss';
import { MainImgWithContent } from '../../components/MainImgWithContent';
import { WhatAreYouWaitingOn } from '../../components/WhatAreYouWaitingFor';
export const FAQ = () => {
  return (
    <>
      <MainImgWithContent
        title="FAQs "
        subtitle="Global Money List - Frequently Asked Questions"
        align="left"
      />
      <Typography component="div" className={styles.FAQsContainer}>
        <MyFAQ
          title="Will my referral list remain active if I close/delete my account?"
          subtitle="
            Your referral list will only be active for the duration of your
            account meaning you will lose all the participants in your referral
            list if you close your account or your account is terminated.1111"
        />
        <MyFAQ
          title="Where can I find my free Global Money List website link?"
          subtitle="Your free Global Money List website link is located on the upper
          left-hand corner of your homepage after you`ve login."
        />
        <MyFAQ
          title="What type of payment are accepted for entry into the Global Money
          List?"
          subtitle="We only accept these cryptocurrencies Ethereum, Polygon, Bitcoin,
          Dogecoin, Litecoin, Stellar Lumens, and Ripple network."
        />
        <MyFAQ
          title="What other payments options are provided for entry into the Global
          Money List?"
          subtitle="There is no other payment option at this moment."
        />
        <MyFAQ
          title="What is the duration of each paid entry into the Global Money List
          revolvers?"
          subtitle="There`s a duration of 60 days for each paid entry into any of our
          six Money List."
        />
        <MyFAQ
          title="How many times can I enter any of the Money List?"
          subtitle="As often as you like. There`s no limits."
        />
        <MyFAQ
          title="How will I know the link to my free Global Money List website is
          actually mine?"
          subtitle="If you look closely at the link to your free Global Money List
          website, you`ll see your username which is uniquely yours."
        />
        <MyFAQ
          title="How do I build my Referral list?"
          subtitle="Share your free Global Money List website link with friends,
          family, and network associates."
        />
        <MyFAQ
          title="What happens when a member of my referral list pays to enter into
          any of the Global Money List revolvers?"
          subtitle="You will be locked in the first position of that particular Global
          Money List revolver and automatically paid."
        />
        <MyFAQ
          title="Does it cost to sign up and create an account?"
          subtitle="No, it`s free to sign up and create an account."
        />
        <MyFAQ
          title="How do I receive my winnings?"
          subtitle="Our system will deposit your winnings directly into your
          cryptocurrency wallet."
        />
        <MyFAQ
          title="Am I obligated to make payments on Global Money List using my
          Coinbase cryptocurrency wallet?"
          subtitle="You`re only obligated to use your Coinbase cryptocurrency wallet
          when making a payment directly to Global Money List."
        />
        <MyFAQ
          title="How much are Coinbase cryptocurrency wallets?"
          subtitle="hey`re free! You can Click here to download a free Coinbase
          cryptocurrency wallet."
        />
        <WhatAreYouWaitingOn />
      </Typography>
    </>
  );
};
