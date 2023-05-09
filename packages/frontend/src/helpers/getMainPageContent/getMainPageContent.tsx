import styles from './getMainPageContent.module.scss';
import { JwtPayload } from '../../authProvider';
import { ThreeColumnsPicture } from '../../components/ThreeColumnsPiture';
import { AboutContent } from '../../pages/About/AboutContent';
import { WhatAreYouWaitingOn } from '../../components/WhatAreYouWaitingFor';
import { Paragraph } from '../../components/Paragraph';
import person from 'assets/threeColumnImage/person.png';
import {DoubleEntryOffer} from "../../components/DoubleEntryOffer";
import {SingleEntryOffer} from "../../components/SingleEntryOffer";
export const getMainPageContent = (
  user: JwtPayload | undefined,
): JSX.Element => {
  if (user) {
    return (
      <>
        <AboutContent />
        <p className={styles.secondEntryTitle}>
          Add a second entry of yourself into the money list you choose for less
          than 25% more of the total cost. Instead of one entry You’ll have two
          separate entries in the money list you choose which will greatly
          increase your chances to earn money. Please see prices below.
        </p>
          <DoubleEntryOffer/>
          <p className={styles.notInterestedText}>Not Interested in our double entry offer? No problem, simply make a selection below for a single entry into one of the money lists of your choice.</p>
          <SingleEntryOffer/>
      </>
    );
  }
  return (
    <>
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
        img={person}
        imgAlt="picture with person and money"
        imgWidth={360}
        imgHeight={520}
        extraClass={styles.threeColumnsExtraClass}
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
    </>
  );
};
