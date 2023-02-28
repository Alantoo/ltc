import React from 'react';
import Typography from '@material-ui/core/Typography';
import { MainImgWithContent } from '../../components/MainImgWithContent';
import { Paragraph } from '../../components/Paragraph';
import styles from './Privacy.module.scss';

const Privacy = () => {
  return (
    <div className={styles.largeBottomPadding}>
      <MainImgWithContent
        title="PRIVACY "
        subtitle="Global Money List - Privacy Policy"
      />
      <Typography component="div">
        <Paragraph
          title="GENERAL"
          subtitle="Globalmoneylist.com (“Company” or “we” or “us” or “our”) respects the privacy of its users (“user” or “you”) that use our website located at http://lettercopy.com, including other media forms, media channels, mobile website or mobile application related or connected thereto (collectively, the “Website”). The following Company privacy policy (“Privacy Policy”) is designed to inform you, as a user of the Website, about the types of information that Company may gather about or collect from you in connection with your use of the Website. It also is intended to explain the conditions under which Company uses and discloses that information, and your rights in relation to that information. Changes to this Privacy Policy are discussed at the end of this document. Each time you use the Website, however, the current version of this Privacy Policy will apply. Accordingly, each time you use the Website you should check the date of this Privacy Policy (which appears at the beginning of this document) and review any changes since the last time you used the Website."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="69px auto 0"
          extraSubtitle={[
            'The Website is hosted in the United States of America and is subject to U.S. state and federal law. If you are accessing our Website from other jurisdictions, please be advised that you are transferring your personal information to us in the United States, and by using our Website, you consent to that transfer and use of your personal information in accordance with this Privacy Policy. You also agree to abide by the applicable laws of applicable states and U.S. federal law concerning your use of the Website and your agreements with us. Any persons accessing our Website from any jurisdiction with laws or regulations governing the use of the Internet, including personal data collection, use and disclosure, different from those of the jurisdictions mentioned above may only use the Website in a manner lawful in their jurisdiction. If your use of the Website would be unlawful in your jurisdiction, please do not use the Website.',
            'BY USING OR ACCESSING THE WEBSITE, YOU ARE ACCEPTING THE PRACTICES DESCRIBED IN THIS PRIVACY POLICY.',
          ]}
        />
        <h3 className={styles.textCenter}>
          GATHERING, USE AND DISCLOSURE OF NON-PERSONALLY IDENTIFYING
          INFORMATION
        </h3>
        <Paragraph
          title="Users of the Website Generally"
          subtitle="“Non-Personally-Identifying Information” is information that, without the aid of additional information, cannot be directly associated with a specific person. “Personally-Identifying Information,” by contrast, is information such as a name or email address that, without more, can be directly associated with a specific person. Like most website operators, Company gathers from users of the Website Non-Personally Identifying Information of the sort that Web browsers, depending on their settings, may make available. That information includes the user’s Internet Protocol (IP) address, operating system, browser type and the locations of the websites the user views right before arriving at, while navigating and immediately after leaving the Website. Although such information is not Personally-Identifying Information, it may be possible for Company to determine from an IP address a user’s Internet service provider and the geographic location of the visitor’s point of connectivity as well as other statistical usage data. Company analyzes Non-Personally-Identifying Information gathered from users of the Website to help Company better understand how the Website is being used. By identifying patterns and trends in usage, Company is able to better design the Website to improve users’ experiences, both in terms of content and ease of use. From time to time, Company may also release the Non-Personally-Identifying Information gathered from Website users in the aggregate, such as by publishing a report on trends in the usage of the Website."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="20px auto 0 "
        />
        <Paragraph
          title="Web Cookies"
          subtitle="“Non-Personally-Identifying Information” is information that, without the aid of additional information, cannot be directly associated with a specific person. “Personally-Identifying Information,” by contrast, is information such as a name or email address that, without more, can be directly associated with a specific person. Like most website operators, Company gathers from users of the Website Non-Personally Identifying Information of the sort that Web browsers, depending on their settings, may make available. That information includes the user’s Internet Protocol (IP) address, operating system, browser type and the locations of the websites the user views right before arriving at, while navigating and immediately after leaving the Website. Although such information is not Personally-Identifying Information, it may be possible for Company to determine from an IP address a user’s Internet service provider and the geographic location of the visitor’s point of connectivity as well as other statistical usage data. Company analyzes Non-Personally-Identifying Information gathered from users of the Website to help Company better understand how the Website is being used. By identifying patterns and trends in usage, Company is able to better design the Website to improve users’ experiences, both in terms of content and ease of use. From time to time, Company may also release the Non-Personally-Identifying Information gathered from Website users in the aggregate, such as by publishing a report on trends in the usage of the Website."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="20px auto 0 "
        />
        <Paragraph
          title="Web Beacons"
          subtitle="“Web Beacon” is an object that is embedded in a web page or email that is usually invisible to the user and allows website operators to check whether a user has viewed a particular web page or an email. Company may use Web Beacons on the Website and in emails to count users who have visited particular pages, viewed emails and to deliver co-branded services. Web Beacons are not used to access users’ Personally-Identifying Information. They are a technique Company may use to compile aggregated statistics about Website usage. Web Beacons collect only a limited set of information, including a Web Cookie number, time and date of a page or email view and a description of the page or email on which the Web Beacon resides. You may not decline Web Beacons. However, they can be rendered ineffective by declining all Web Cookies or modifying your browser setting to notify you each time a Web Cookie is tendered, permitting you to accept or decline Web Cookies on an individual basis."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="20px auto 0 "
        />
        <Paragraph
          title="Analytics"
          subtitle="We may partner with selected third parties to allow tracking technology on the Website, which will enable them to collect data about how you interact with the Website and our services over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="20px auto 0 "
        />
        <Paragraph
          title="Aggregated and Non-Personally-Identifying Information"
          subtitle="We may share aggregated and Non-Personally Identifying Information we collect under any of the above circumstances. We may also share it with third parties and our affiliate companies to develop and deliver targeted advertising on the Website and on websites of third parties. We may combine Non-Personally Identifying Information we collect with additional Non-Personally Identifying Information collected from other sources. We also may share aggregated information with third parties, including advisors, advertisers and investors, for the purpose of conducting general business analysis. For example, we may tell our advertisers the number of visitors to the Website and the most popular features or services accessed. This information does not contain any Personally-Identifying Information and may be used to develop website content and services that we hope you and other users will find of interest and to target content and advertising."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="20px auto 0 "
        />
        <div className={styles.additionalTermsContainer}>
          <h3>Mobile Device Additional Terms</h3>
          <ul>
            <li>
              Mobile Device. If you use a mobile device to access the Website or
              download any of our applications, we may collect device
              information (such as your mobile device ID, model and
              manufacturer), operating system, version information and IP
              address.
            </li>
            <li>
              Geo-Location Information. Unless we have received your prior
              consent, we do not access or track any location-based information
              from your mobile device at any time while downloading or using our
              mobile application or our services, except that it may be possible
              for Company to determine from an IP address the geographic
              location of your point of connectivity, in which case we may
              gather and use such general location data.
            </li>
            <li>
              Push Notifications. We send you push notifications if you choose
              to receive them, letting you know when someone has sent you a
              message or for other service-related matters. If you wish to
              opt-out from receiving these types of communications, you may turn
              them off in your device’s settings.
            </li>
            <li>
              Mobile Analytics. We use mobile analytics software to allow us to
              better understand the functionality of our mobile software on your
              phone. This software may record information, such as how often you
              use the application, the events that occur within the application,
              aggregated usage, performance data and where the application was
              downloaded from. We do not link the information we store within
              the analytics software to any Personally-Identifying Information
              you submit within the mobile application.
            </li>
          </ul>
        </div>
        <Paragraph
          title="SOCIAL MEDIA "
          subtitle="We may use hyperlinks on the Website which will redirect you to a social network if you click on the respective link. However, when you click on a social plug-in, such as Facebook’s “Like” button, Twitter’s “tweet” button or the Google+, that particular social network’s plugin will be activated and your browser will directly connect to that provider’s servers. If you do not use these buttons, none of your data will be sent to the respective social network’s plugin provider. So for example, when you click on the Facebook’s “Like” button on the Website, Facebook will receive your IP address, the browser version and screen resolution, and the operating system of the device you have used to access the Website. Settings regarding privacy protection can be found on the websites of these social networks and are not within our control."
          subtitleTopMargin={10}
          subtitleLineHeight="27px"
          containerMargin="20px auto 0 "
        />
      </Typography>
    </div>
  );
};

export default Privacy;
