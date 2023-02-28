import { MainImgWithContent } from '../../components/MainImgWithContent';
import { Paragraph } from '../../components/Paragraph';
import styles from './About.module.scss';
import { ThreeColumnsPicture } from '../../components/ThreeColumnsPiture';
import threeColumnImg from 'assets/snapEdit2.png';
import { CryptoCard } from './CryptoCard';
import bitcoin from 'assets/bitcoin.png';
import ethereum from 'assets/ethereum.png';
import { HowToBeAdded } from './HowToBeAdded';
const About = () => {
  return (
    <div className={styles.container}>
      <MainImgWithContent
        title="About"
        subtitle="This page will tell about us"
        align="left"
      />
      <p className={styles.less5MinTitle}>
        Takes less than 5 minutes to get started!
      </p>
      <Paragraph
        title="The Money Lists"
        subtitle="The money lists work by using an algorithm to randomly rotate each member username through the money lists of our Global Money List website. All positions in the money lists randomly rotate every ten seconds. There are six separate Money Lists your username can rotate through. There’s a $1.00 Money List, $5.00 Money List, $10.00 Money List, $20.00 Money List, $50.00 Money List, and a $100.00 Money List you can be added to.
        Here’s the cost to be added to our various Money Lists. All payments must be made in Bitcoin or Ethereum cryptocurrency!"
        subtitleTopMargin={5}
        subtitleLineHeight={'27px'}
        containerMargin={'30px auto 0 '}
      />
      <ThreeColumnsPicture
        leftColumn={{
          list: [
            '$100.00 Money List is $2.95 per 60-day entry. You must also pay two random members $100.00 each in cryptocurrency before you can be added to this Money List.',
            '$50.00 Money List is $2.95 per 60-day entry. You must also pay two random members $50.00 each in cryptocurrency before you can be added to this Money List.',
            '$20.00 Money List is $2.95 per 60-day entry. You must also pay two random members $20.00 each in cryptocurrency before you can be added to this Money List.',
          ],
          isList: true,
          lineContent: '',
          extraClass: styles.leftColumn,
        }}
        rightColumn={{
          list: [
            '$10.00 Money List is $2.95 per 60-day entry. You must also pay two random members $10.00 each in cryptocurrency before you can be added to this Money List.',
            '$5.00 Money List is $2.95 per 60-day entry. You must also pay two random members $5.00 each in cryptocurrency before you can be added to this Money List.',
            '$1.00 Money List is $2.95 per 60-day entry. You must also pay two random members $1.00 each in cryptocurrency before you can be added to this Money List.',
          ],
          isList: true,
          lineContent: '',
        }}
        img={threeColumnImg}
        imgAlt={'phone with money'}
        imgWidth={1440}
        imgHeight={492}
        extraClass={styles.threeColumnContainer}
      />
      <p className={styles.earningWillBePaid}>
        All earnings will be paid to you with one of the cryptocurrencies listed
        below.
      </p>
      <div className={styles.cryptoCardsContainer}>
        <CryptoCard cryptoName="Bitcoin" img={bitcoin} />
        <CryptoCard cryptoName="Ethereum" img={ethereum} />
      </div>
      <p className={styles.joinText}>
        You can join any of the money lists after you have signed up. You can
        pay to be added to the money lists as many times as you like! Global
        Money List currently signup hundreds of new members daily increasing
        your chance to win! Make sure to add yourself to the Money Lists as soon
        as possible!
      </p>
      <HowToBeAdded />
      <Paragraph
        title="Referral List"
        subtitle="Building your referral list is the most important way to create residual income using this system. Here’s how it works! When someone click on your affiliate link and sign up, they’re automatically added to your referral list. When any member listed in your referral list pay to be added to any of our money lists, your username will be locked in the #1 position of their money list. Once clicked on You’ll be paid either $1.00, $5.00, $10.00, $20.00, $50.00, or $100.00 in cryptocurrency depending on which money list your referral decides to be added to. Your referral will now click on the required number of members usernames randomly rotating through the money list to have themselves added to that money list. There is no limit to how large your referral list can grow to be, so the larger the list the more income for you. Go to your homepage and copy your affiliate link to share with all of your family, friends, and network associates. This will rapidly grow your referral list causing you to earn unlimited amounts of income even long after you stopped promoting this system."
        subtitleTopMargin={5}
        subtitleLineHeight="26px"
        containerMargin="10px auto 150px"
      />
    </div>
  );
};
export default About;
