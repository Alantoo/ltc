import styles from './AboutContent.module.scss';
import { Paragraph } from '../../../components/Paragraph';
import { ThreeColumnsPicture } from '../../../components/ThreeColumnsPiture';
import phone from '../../../assets/threeColumnImage/phone.png';
import { CryptoCard } from '../CryptoCard';
import bitcoin from '../../../assets/bitcoin.png';
import ethereum from '../../../assets/ethereum.png';
import { HowToBeAdded } from '../HowToBeAdded';
export const AboutContent = () => {
  return (
    <>
      <p className={styles.less5MinTitle}>
        Takes less than 5 minutes to get started!
      </p>

      <Paragraph
        title="The Money Lists"
        subtitle="The money lists work by using an algorithm to randomly rotate each member username through the money lists of our Global Money List website. All positions in the money lists randomly rotate every ten seconds. There are six separate Money Lists your username can rotate through. There’s a $1.00 Money List, $5.00 Money List, $10.00 Money List, $20.00 Money List, $50.00 Money List, and a $100.00 Money List you can be added to.
        Here’s the cost to be added to our various Money Lists. All payments must be made in Bitcoin cryptocurrency!"
        subtitleTopMargin={5}
        subtitleLineHeight={'27px'}
        containerMargin={'30px auto 0 '}
      />
      <ThreeColumnsPicture
        leftColumn={{
          list: [
            '$100.00 Money List - You must pay two random members $100.00 each in Bitcoin before you can be added to this Money List. All entries are for 60 days.',
            '$50.00 Money List - You must pay three random members $50.00 each in Bitcoin before you can be added to this Money List. All entries are for 60 days.',
            '$20.00 Money List - You must pay four random members $20.00 each in Bitcoin   before you can be added to this Money List. All entries are for 60 days.',
          ],
          isList: true,
          lineContent: '',
          extraClass: styles.leftColumn,
        }}
        rightColumn={{
          list: [
            '$10.00 Money List - You must pay five random members $10.00 each in Bitcoin before you can be added to this Money List. All entries are for 60 days.',
            '$5.00 Money List - You must pay six random members $5.00 each in Bitcoin before you can be added to this Money List. All entries are for 60 days.',
            '$1.00 Money List - You must pay seven random members $1.00 each in Bitcoin before you can be added to this Money List. All entries are for 60 days.',
          ],
          isList: true,
          lineContent: '',
        }}
        img={phone}
        imgAlt={'phone with money'}
        imgWidth={360}
        imgHeight={520}
        extraClass={styles.threeColumnContainer}
      />
      <p className={styles.earningWillBePaid}>
        All earnings will be paid to you in Bitcoin cryptocurrency.
      </p>
      <div className={styles.cryptoCardsContainer}>
        <CryptoCard
          cryptoName="Bitcoin"
          img={bitcoin}
          width={595}
          height={373}
        />
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
        subtitle={`Building your referral list is the most important way to create residual income
        using this system. Here’s how it works! When someone click on your affiliate link and sign
         up, they’re automatically added to your referral list. When any member listed in your referral 
         list pay to be added to any of our money lists, your username will be locked in the #1 position 
         of their money list. Once clicked on You’ll be paid either $1.00, $5.00, $10.00, $20.00,
          $50.00, or $100.00 in Bitcoin cryptocurrency depending on which money list your referral
           decides to be added to. Your referral will now click on the required number of members 
           usernames randomly rotating through the money list to have themselves added to that money
            list. There is no limit to how large your referral list can grow to be, so the larger th
            e list the more income for you. Go to your homepage and copy your affiliate link to share
             with all of your family, friends, and network associates. This will rapidly grow your re
             ferral list causing you to earn unlimited amounts of income even long after you stopped 
             promoting this system.`}
        subtitleTopMargin={5}
        subtitleLineHeight="26px"
        containerMargin="10px auto 0"
      />
    </>
  );
};
