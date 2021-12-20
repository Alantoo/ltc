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
        <p>State of Illinois </p>
        <h2 className={classes.center}>PRIVACY POLICY</h2>
        <h2 className={classes.center}>GLOBALMONEYLIST.COM</h2>
        <p>Version Date: November 06, 2017</p>
        <h3>GENERAL</h3>
        <p>
          globalmoneylist.com (“Company” or “we” or “us” or “our”) respects the
          privacy of its users (“user” or “you”) that use our website located at
          http://lettercopy.com, including other media forms, media channels,
          mobile website or mobile application related or connected thereto
          (collectively, the “Website”). The following Company privacy policy
          (“Privacy Policy”) is designed to inform you, as a user of the
          Website, about the types of information that Company may gather about
          or collect from you in connection with your use of the Website. It
          also is intended to explain the conditions under which Company uses
          and discloses that information, and your rights in relation to that
          information. Changes to this Privacy Policy are discussed at the end
          of this document. Each time you use the Website, however, the current
          version of this Privacy Policy will apply. Accordingly, each time you
          use the Website you should check the date of this Privacy Policy
          (which appears at the beginning of this document) and review any
          changes since the last time you used the Website.
        </p>
        <p>
          The Website is hosted in the United States of America and is subject
          to U.S. state and federal law. If you are accessing our Website from
          other jurisdictions, please be advised that you are transferring your
          personal information to us in the United States, and by using our
          Website, you consent to that transfer and use of your personal
          information in accordance with this Privacy Policy. You also agree to
          abide by the applicable laws of applicable states and U.S. federal law
          concerning your use of the Website and your agreements with us. Any
          persons accessing our Website from any jurisdiction with laws or
          regulations governing the use of the Internet, including personal data
          collection, use and disclosure, different from those of the
          jurisdictions mentioned above may only use the Website in a manner
          lawful in their jurisdiction. If your use of the Website would be
          unlawful in your jurisdiction, please do not use the Website.
        </p>
        <p>
          BY USING OR ACCESSING THE WEBSITE, YOU ARE ACCEPTING THE PRACTICES
          DESCRIBED IN THIS PRIVACY POLICY.
        </p>
        <h3>
          GATHERING, USE AND DISCLOSURE OF NON-PERSONALLY IDENTIFYING
          INFORMATION
        </h3>
        <h3>Users of the Website Generally</h3>
        <p>
          “Non-Personally-Identifying Information” is information that, without
          the aid of additional information, cannot be directly associated with
          a specific person. “Personally-Identifying Information,” by contrast,
          is information such as a name or email address that, without more, can
          be directly associated with a specific person. Like most website
          operators, Company gathers from users of the Website Non-Personally
          Identifying Information of the sort that Web browsers, depending on
          their settings, may make available. That information includes the
          user’s Internet Protocol (IP) address, operating system, browser type
          and the locations of the websites the user views right before arriving
          at, while navigating and immediately after leaving the Website.
          Although such information is not Personally-Identifying Information,
          it may be possible for Company to determine from an IP address a
          user’s Internet service provider and the geographic location of the
          visitor’s point of connectivity as well as other statistical usage
          data. Company analyzes Non-Personally-Identifying Information gathered
          from users of the Website to help Company better understand how the
          Website is being used. By identifying patterns and trends in usage,
          Company is able to better design the Website to improve users’
          experiences, both in terms of content and ease of use. From time to
          time, Company may also release the Non-Personally-Identifying
          Information gathered from Website users in the aggregate, such as by
          publishing a report on trends in the usage of the Website.
        </p>
        <h3>Web Cookies</h3>
        <p>
          A “Web Cookie” is a string of information which assigns you a unique
          identification that a website stores on a user’s computer, and that
          the user’s browser provides to the website each time the user submits
          a query to the website. We use cookies on the Website to keep track of
          services you have used, to record registration information regarding
          your login name and password, to record your user preferences, to keep
          you logged into the Website and to facilitate purchase procedures.
          Company also uses Web Cookies to track the pages that users visit
          during each Website session, both to help Company improve users’
          experiences and to help Company understand how the Website is being
          used. As with other NonPersonally-Identifying Information gathered
          from users of the Website, Company analyzes and discloses in
          aggregated form information gathered using Web Cookies, so as to help
          Company, its partners and others better understand how the Website is
          being used. COMPANY USERS WHO DO NOT WISH TO HAVE WEB COOKIES PLACED
          ON THEIR COMPUTERS SHOULD SET THEIR BROWSERS TO REFUSE WEB COOKIES
          BEFORE ACCESSING THE WEBSITE, WITH THE UNDERSTANDING THAT CERTAIN
          FEATURES OF THE WEBSITE MAY NOT FUNCTION PROPERLY WITHOUT THE AID OF
          WEB COOKIES. WEBSITE USERS WHO REFUSE WEB COOKIES ASSUME ALL
          RESPONSIBILITY FOR ANY RESULTING LOSS OF FUNCTIONALITY.
        </p>
        <h3>Web Beacons</h3>
        <p>
          A “Web Beacon” is an object that is embedded in a web page or email
          that is usually invisible to the user and allows website operators to
          check whether a user has viewed a particular web page or an email.
          Company may use Web Beacons on the Website and in emails to count
          users who have visited particular pages, viewed emails and to deliver
          co-branded services. Web Beacons are not used to access users’
          Personally-Identifying Information. They are a technique Company may
          use to compile aggregated statistics about Website usage. Web Beacons
          collect only a limited set of information, including a Web Cookie
          number, time and date of a page or email view and a description of the
          page or email on which the Web Beacon resides. You may not decline Web
          Beacons. However, they can be rendered ineffective by declining all
          Web Cookies or modifying your browser setting to notify you each time
          a Web Cookie is tendered, permitting you to accept or decline Web
          Cookies on an individual basis.
        </p>
        <h3>Analytics</h3>
        <p>
          We may partner with selected third parties to allow tracking
          technology on the Website, which will enable them to collect data
          about how you interact with the Website and our services over time.
          This information may be used to, among other things, analyze and track
          data, determine the popularity of certain content and better
          understand online activity.
        </p>
        <h3>Aggregated and Non-Personally-Identifying Information</h3>
        <p>
          We may share aggregated and Non-Personally Identifying Information we
          collect under any of the above circumstances. We may also share it
          with third parties and our affiliate companies to develop and deliver
          targeted advertising on the Website and on websites of third parties.
          We may combine Non-Personally Identifying Information we collect with
          additional Non-Personally Identifying Information collected from other
          sources. We also may share aggregated information with third parties,
          including advisors, advertisers and investors, for the purpose of
          conducting general business analysis. For example, we may tell our
          advertisers the number of visitors to the Website and the most popular
          features or services accessed. This information does not contain any
          Personally-Identifying Information and may be used to develop website
          content and services that we hope you and other users will find of
          interest and to target content and advertising.
        </p>
        <h3>Mobile Device Additional Terms</h3>
        <ul>
          <li>
            <b>Mobile Device.</b> If you use a mobile device to access the
            Website or download any of our applications, we may collect device
            information (such as your mobile device ID, model and manufacturer),
            operating system, version information and IP address.
          </li>
          <li>
            <b>Geo-Location Information.</b> Unless we have received your prior
            consent, we do not access or track any location-based information
            from your mobile device at any time while downloading or using our
            mobile application or our services, except that it may be possible
            for Company to determine from an IP address the geographic location
            of your point of connectivity, in which case we may gather and use
            such general location data.
          </li>
          <li>
            <b>Push Notifications.</b> We send you push notifications if you
            choose to receive them, letting you know when someone has sent you a
            message or for other service-related matters. If you wish to opt-out
            from receiving these types of communications, you may turn them off
            in your device’s settings.
          </li>
          <li>
            <b>Mobile Analytics.</b> We use mobile analytics software to allow
            us to better understand the functionality of our mobile software on
            your phone. This software may record information, such as how often
            you use the application, the events that occur within the
            application, aggregated usage, performance data and where the
            application was downloaded from. We do not link the information we
            store within the analytics software to any Personally-Identifying
            Information you submit within the mobile application.
          </li>
        </ul>
        <h3>SOCIAL MEDIA</h3>
        <p>
          We may use hyperlinks on the Website which will redirect you to a
          social network if you click on the respective link. However, when you
          click on a social plug-in, such as Facebook’s “Like” button, Twitter’s
          “tweet” button or the Google+, that particular social network’s plugin
          will be activated and your browser will directly connect to that
          provider’s servers. If you do not use these buttons, none of your data
          will be sent to the respective social network’s plugin provider. So
          for example, when you click on the Facebook’s “Like” button on the
          Website, Facebook will receive your IP address, the browser version
          and screen resolution, and the operating system of the device you have
          used to access the Website. Settings regarding privacy protection can
          be found on the websites of these social networks and are not within
          our control.
        </p>
        <h3>
          COLLECTION, USE AND DISCLOSURE OF PERSONALLY-IDENTIFYING INFORMATION
        </h3>
        <h3>Website Registration</h3>
        <p>
          As defined above, Personally-Identifying Information is information
          that can be directly associated with a specific person. Company may
          collect a range of Personally-Identifying Information from and about
          Website users. Much of the Personally-Identifying Information
          collected by Company about users is information provided by users
          themselves when (1) registering for our service, (2) logging in with
          social network credentials, (3) participating in polls, contests,
          surveys or other features of our service, or responding to offers or
          advertisements, (4) communicating with us, (5) creating a public
          profile or (6) signing up to receive newsletters. That information may
          include each user’s name, address, email address and telephone number,
          and, if you transact business with us, financial information such as
          your payment method (valid credit card number, type, expiration date
          or other financial information). We also may request information about
          your interests and activities, your gender, age, date of birth,
          username, hometown and other demographic or relevant information as
          determined by Company from time to time. Users of the Website are
          under no obligation to provide Company with Personally-Identifying
          Information of any kind, with the caveat that a user’s refusal to do
          so may prevent the user from using certain Website features.
        </p>
        <p>
          BY REGISTERING WITH OR USING THE WEBSITE, YOU CONSENT TO THE USE AND
          DISCLOSURE OF YOUR PERSONALLY-IDENTIFYING INFORMATION AS DESCRIBED IN
          THIS “COLLECTION, USE AND DISCLOSURE OF PERSONALLY-IDENTIFYING
          INFORMATION” SECTION.
        </p>
        <h3>Company Communications</h3>
        <p>
          We may occasionally use your name and email address to send you
          notifications regarding new services offered by the Website that we
          think you may find valuable. We may also send you service-related
          announcements from time to time through the general operation of the
          service. Generally, you may opt out of such emails at the time of
          registration or through your account settings, though we reserve the
          right to send you notices about your account, such as service
          announcements and administrative messages, even if you opt out of all
          voluntary email notifications.
        </p>
        <h3>Company Disclosures</h3>
        <p>
          Company will disclose Personally-Identifying Information under the
          following circumstances:
        </p>
        <ul>
          <li>
            <b>By Law or to Protect Rights.</b> When we believe disclosure is
            appropriate, we may disclose Personally-Identifying Information in
            connection with efforts to investigate, prevent or take other action
            regarding illegal activity, suspected fraud or other wrongdoing; to
            protect and defend the rights, property or safety of Company, our
            users, our employees or others; to comply with applicable law or
            cooperate with law enforcement; to enforce our Terms of Use or other
            agreements or policies, in response to a subpoena or similar
            investigative demand, a court order or a request for cooperation
            from a law enforcement or other government agency; to establish or
            exercise our legal rights; to defend against legal claims; or as
            otherwise required by law. In such cases, we may raise or waive any
            legal objection or right available to us.
          </li>
          <li>
            <b>Marketing Communications.</b> Unless users opt-out from receiving
            Company marketing materials upon registration, Company may email
            users about products and services that Company believes may be of
            interest to them. If you wish to opt-out of receiving marketing
            materials from Company, you may do so by following the unsubscribe
            link in the email communications, by going to your account settings
            (if applicable) or contacting us using the contact information
            below.
          </li>
          <li>
            <b>Third-Party Service Providers.</b> We may share your
            Personally-Identifying Information, which may include your name and
            contact information (including email address) with our authorized
            service providers that perform certain services on our behalf. These
            services may include fulfilling orders, providing customer service
            and marketing assistance, performing business and sales analysis,
            supporting the Website’s functionality and supporting contests,
            sweepstakes, surveys and other features offered through the Website.
            We may also share your name, contact information and credit card
            information with our authorized service providers who process credit
            card payments. These service providers may have access to personal
            information needed to perform their functions but are not permitted
            to share or use such information for any other purpose.
          </li>
          <li>
            <b>Business Transfers; Bankruptcy.</b> Company reserves the right to
            transfer all Personally-Identifying Information in its possession to
            a successor organization in the event of a merger, acquisition,
            bankruptcy or other sale of all or a portion of Company’s assets.
            Other than to the extent ordered by a bankruptcy or other court, the
            use and disclosure of all transferred Personally-Identifying
            Information will be subject to this Privacy Policy, or to a new
            privacy policy if you are given notice of that new privacy policy
            and are given an opportunity to affirmatively optout of it.
            Personally-Identifying Information submitted or collected after a
            transfer, however, may be subject to a new privacy policy adopted by
            the successor organization.
          </li>
        </ul>
        <h3>
          Changing Personally-Identifying Information; Account Termination
        </h3>
        <p>
          You may at any time review or change your Personally-Identifying
          Information by going to your account settings (if applicable) or
          contacting us using the contact information below. Upon your request,
          we will deactivate or delete your account and contact information from
          our active databases. Such information will be deactivated or deleted
          as soon as practicable based on your account activity and accordance
          with our deactivation policy and applicable law. To make this request,
          either go to your account settings (ifapplicable) or contact us as
          provided below. We will retain in our files some
          Personally-Identifying Information to prevent fraud, to troubleshoot
          problems, to assist with any investigations, to enforce our Terms of
          Use and to comply with legal requirements as is permitted by law.
          Therefore, you should not expect that all your Personally-Identifying
          Information will be completely removed from our databases in response
          to your requests. Additionally, we keep a history of changed
          information to investigate suspected fraud with your account.
        </p>
        <h3>General Use</h3>
        <p>
          Company uses the Personally-Identifying Information in the file we
          maintain about you, and other information we obtain from your current
          and past activities on the Website (1) to deliver the products and
          services that you have requested; (2) to manage your account and
          provide you with customer support; (3) to communicate with you by
          email, postal mail, telephone and/or mobile devices about products or
          services that may be of interest to you either from us, our affiliate
          companies or other third parties; (4) to develop and display content
          and advertising tailored to your interests on the Website and other
          sites; (5) to resolve disputes and troubleshoot problems; (6) to
          measure consumer interest in our services; (7) to inform you of
          updates; (8) to customize your experience; (9) to detect and protect
          us against error, fraud and other criminal activity; (10) to enforce
          our Terms of Use; and (11) to do as otherwise described to you at the
          time of collection. At times, we may look across multiple users to
          identify problems. In particular, we may examine your
          Personally-Identifying Information to identify users using multiple
          user IDs or aliases. We may compare and review your
          Personally-Identifying Information for accuracy and to detect errors
          and omissions. We may use financial information or payment method to
          process payment for any purchases made on the Website, enroll you in
          the discount, rebate, and other programs in which you elect to
          participate, to protect against or identify possible fraudulent
          transactions and otherwise as needed to manage our business.
        </p>
        <h3>COLLECTION AND USE OF INFORMATION BY THIRD PARTIES GENERALLY</h3>
        <p>
          Company contractually prohibits its contractors, affiliates, vendors
          and suppliers from disclosing Personally-Identifying Information
          received from Company, other than in accordance with this Privacy
          Policy. However, third parties are under no obligation to comply with
          this Privacy Policy with respect to Personally-Identifying Information
          that users provide directly to those third parties, or that those
          third parties collect for themselves. These third parties include
          advertisers, providers of games, utilities, widgets and a variety of
          other third-party applications accessible through the Website. Company
          neither owns nor controls the third-party websites and applications
          accessible through the Website. Thus, this Privacy Policy does not
          apply to information provided to or gathered by the third parties that
          operate them. Before visiting a third party, or using a third-party
          application, whether by means of a link on the Website, directly
          through the Website or otherwise, and before providing any
          Personally-Identifying Information to any such third party, users
          should inform themselves of the privacy policies and practices (if
          any) of the third party responsible for that website or application,
          and should take those steps necessary to, in those users’ discretion,
          protect their privacy.
        </p>
        <h3>SECURITY</h3>
        <p>
          We take the security of your Personally-Identifying Information
          seriously and use reasonable electronic, personnel and physical
          measures to protect it from loss, theft, alteration or misuse.
          However, please be advised that even the best security measures cannot
          fully eliminate all risks. We cannot guarantee that only authorized
          persons will view your information. We are not responsible for
          third-party circumvention of any privacy settings or security
          measures.
        </p>
        <p>
          We are dedicated to protect all information on the Website as is
          necessary. However, you are responsible for maintaining the
          confidentiality of your Personally-Identifying Information by keeping
          your password confidential. You should change your password
          immediately if you believe someone has gained unauthorized access to
          it or your account. If you lose control of your account, you should
          notify us immediately.
        </p>
        <h3>PRIVACY POLICY CHANGES</h3>
        <p>
          Company may, in its sole discretion, change this Privacy Policy from
          time to time. Any and all changes to Company’s Privacy Policy will be
          reflected on this page and the date new versions are posted will be
          stated at the top of this Privacy Policy. Unless stated otherwise, our
          current Privacy Policy applies to all information that we have about
          you and your account. Users should regularly check this page for any
          changes to this Privacy Policy. Company will always post new versions
          of the Privacy Policy on the Website. However, Company may, as
          determined in its discretion, decide to notify users of changes made
          to this Privacy Policy via email or otherwise. Accordingly, it is
          important that users always maintain and update their contact
          information.
        </p>
        <h3>CHILDREN</h3>
        <p>
          The Children's Online Privacy Protection Act ("COPPA") protects the
          online privacy of children under 13 years of age. We do not knowingly
          collect or maintain Personally-Identifying Information from anyone
          under the age of 13, unless or except as permitted by law. Any person
          who provides Personally-Identifying Information through the Website
          represents to us that he or she is 13 years of age or older. If we
          learn that Personally-Identifying Information has been collected from
          a user under 13 years of age on or through the Website, then we will
          take the appropriate steps to cause this information to be deleted. If
          you are the parent or legal guardian of a child under 13 who has
          become a member of the Website or has otherwise transferred
          Personally-Identifying Information to the Website, please contact
          Company using our contact information below to have that child's
          account terminated and information deleted.
        </p>
        <h3>CALIFORNIA PRIVACY RIGHTS</h3>
        <p>
          California Civil Code Section 1798.83, also known as the "Shine The
          Light" law, permits our users who are California residents to request
          and obtain from us, once a year and free of charge, information about
          the Personally-Identifying Information (if any) we disclosed to third
          parties for direct marketing purposes in the preceding calendar year.
          If applicable, this information would include a list of the categories
          of the Personally-Identifying Information that was shared and the
          names and addresses of all third parties with which we shared
          Personally-Identifying Information in the immediately preceding
          calendar year. If you are a California resident and would like to make
          such a request, please submit your request in writing to our privacy
          officer as listed below.
        </p>
        <h3>DO-NOT-TRACK POLICY</h3>
        <p>
          Most web browsers and some mobile operating systems include a
          Do-Not-Track (“DNT”) feature or setting you can activate to signal
          your privacy preference not to have data about your online browsing
          activities monitored and collected. Because there is not yet a common
          understanding of how to interpret the DNT signal, the Website
          currently does not respond to DNT browser signals or mechanisms.
        </p>
        <h3>CONTACT</h3>
        <p>
          If you have any questions regarding our Privacy Policy, please contact
          our Privacy Officer at: globalmoneylist.com
          <br />
          Attn: Privacy Officer
        </p>
        <h2>GENERAL INSTRUCTION</h2>
        <h3>WHAT IS A PRIVACY POLICY?</h3>
        <p>
          A Privacy Policy is a document or statement that describes how a
          company gathers, uses, manages, and releases the information of
          customers or visitors to its website. By accessing the company’s
          website, users accept to have to having their information collected
          and disclosed in accordance with the company’s Privacy Policy.
        </p>
        <h3>WHAT SHOULD BE INCLUDED?</h3>
        <p>
          A simple Privacy Policy will identify the following basic elements:
        </p>
        <ul>
          <li>
            Company: The name of the company that owns the website collecting
            information from its users.
          </li>
          <li>
            Website: The URL address of the company’s website that the user will
            be browsing and accessing.
          </li>
          <li>
            User’s Information: A description of the type of information that
            the website collects and discloses.
          </li>
          <li>
            Collection, Use, and Disclosure: What information the company will
            collect , how they will collect and use the information, and when
            and to whom they will disclose the information.
          </li>
        </ul>
        <h3>WHEN IS IT NEEDED?</h3>
        <p>
          While there is no federal law in the United States requiring that
          websites establish a Privacy Policy, many states and most other
          countries do require a website that collects and stores any personal
          information from its users to have one.
        </p>
        <p>
          In the United States, the Federal Trade Commission (FTC) regulates
          laws and policies regarding the privacy practices of businesses and
          the protection of their customers’ personal information. The FTC also
          helps to enforce federal laws concerning the privacy of customers’
          information, including the following:
        </p>
        <ul>
          <li>
            Fair Credit Reporting Act (FCRA), which limits how companies can
            obtain and use a customer’s credit and background reports.{' '}
          </li>
          <li>
            Gramm-Leach-Bliley Act, which requires financial institutions to
            clearly explain their information sharing practices and also
            restricts the sharing and use of specific financial information.
          </li>
          <li>
            Health Insurance Portability and Accountability Act (HIPAA) created
            a “Privacy Rule” that establishes a national set of standards of how
            health care service providers can use an individual’s protected
            health information.
          </li>
          <li>
            Children’s Online Privacy Protection Act (COPPA), requires websites
            that target and/or collect information from children under the age
            of 13 to post a Privacy Policy that complies with the COPPA
            requirements, and also implements certain parental notice and
            consent requirements.
          </li>
        </ul>
        <p>
          Even if your company or website is not in a jurisdiction that requires
          a privacy policy, the reach of your website may subject it to the laws
          of other states and countries. For example, California, has enacted
          the California Online Privacy Protection Act of 2003 (CALOPPA) which
          requires any website collecting personal information to have a Privacy
          Policy posted on its website that is easily accessible to its users.
          Even if your website is not run from California, CALOPPA applies to
          any website that collects personal information from a California
          resident. Therefore it is likely that your website will be subject to
          the CALOPPA regulations.
        </p>
        <p>
          The European Union has more established laws regarding privacy
          protection, including the Data Protection Directive (95/46/EC) and the
          E-Privacy Directive (2002/58/EC). These directives state that personal
          information of European Union residents can only be transferred to
          countries outside of the European Union that have policies with an
          adequate level of protection.
        </p>
        <p>
          Therefore, if you are a website that gathers, stores, or uses personal
          information and data from clients and users, you should have a Privacy
          Policy for your website. You also need to make sure that you adhere to
          the promises and disclosures set forth in that policy.
        </p>
        <h3>OTHER NAMES</h3>
        <p>
          A Privacy Policy may also be called: Privacy Statement, Internet
          Privacy Policy, Website Privacy Policy, Privacy Notice, Privacy Page,
          Privacy Information Policy
        </p>
      </Typography>
    </Container>
  );
};

export const Privacy = withStyles(styles)(PrivacyView);

export default Privacy;
