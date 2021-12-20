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

type ClassKey = 'root';

const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {},
  });
};

type TermsProps = WithStyles<ClassKey>;

const TermsView = ({ classes }: TermsProps) => {
  return (
    <Container maxWidth="xl">
      <Typography component="div">
        <h3>Globalmoneylist.com</h3>
        <h3>Terms of Use</h3>
        <p>
          Last updated: November 06, 2017
          <br />
          Please read these Terms of Use ("Terms", "Terms of Use") carefully
          before using thehttp://globalmoneylist.com website (the "Service")
          operated by Global Money List ("us", "we", or "our").
          <br />
          Your access to and use of the Service is conditioned upon your
          acceptance of andcompliance with these Terms. These Terms apply to all
          visitors, users and others whowish to access or use the Service.
          <br />
          By accessing or using the Service you agree to be bound by these
          Terms. If you disagree with any part of the terms then you do not have
          permission to access the Service.
        </p>
        <h3>Purchases</h3>
        <p>
          If you wish to purchase any product or service made available through
          the Service ("Purchase"), you may be asked to supply certain
          information relevant to your Purchase including, without limitation,
          your credit card number, the expiration date of your credit card, your
          billing address, and your shipping information.
          <br />
          You represent and warrant that: (i) you have the legal right to use
          any credit card(s) or other payment method(s) in connection with any
          Purchase; and that (ii) the information you supply to us is true,
          correct and complete.
          <br />
          The service may employ the use of third party services for the purpose
          of facilitating payment and the completion of Purchases. By submitting
          your information, you grant us the right to provide the information to
          these third parties subject to our Privacy Policy.
          <br />
          We reserve the right to refuse or cancel your order at any time for
          reasons including but not limited to: product or service availability,
          errors in the description or price of the product or service, error in
          your order or other reasons.
          <br />
          We reserve the right to refuse or cancel your order if fraud or an
          unauthorized or illegal transaction is suspected.
        </p>
        <h3>Availability, Errors and Inaccuracies</h3>
        <p>
          We are constantly updating product and service offerings on the
          Service. We may experience delays in updating information on the
          Service and in our advertising on other web sites. The information
          found on the Service may contain errors or inaccuracies and may not be
          complete or current. Products or services may be mispriced, described
          inaccurately, or unavailable on the Service and we cannot guarantee
          the accuracy or completeness of any information found on the Service.
          <br />
          We therefore reserve the right to change or update information and to
          correct errors, inaccuracies, or omissions at any time without prior
          notice.
        </p>
        <h3>Intellectual Property</h3>
        <p>
          The Service and its original content, features and functionality are
          and will remain the exclusive property of Global Money List and its
          licensors. The Service is protected by copyright, trademark, and other
          laws of both the United States and foreign countries. Our trademarks
          and trade dress may not be used in connection with any product or
          service without the prior written consent of Global Money List.
        </p>
        <h3>Links to Other Web Sites</h3>
        <p>
          Our Service may contain links to third party web sites or services
          that are not owned or controlled by Global Money List.
          <br />
          Global Money List has no control over, and assumes no responsibility
          for the content, privacy policies, or practices of any third-party web
          sites or services. We do not warrant the offerings of any of these
          entities/individuals or their websites.
          <br />
          You acknowledge and agree that Global Money List shall not be
          responsible or liable, directly or indirectly, for any damage or loss
          caused or alleged to be caused by or in connection with use of or
          reliance on any such content, goods or services available on or
          through any such third-party web sites or services.
          <br />
          We strongly advise you to read the terms and conditions and privacy
          policies of any third party web sites or services that you visit.
        </p>
        <h3>Termination</h3>
        <p>
          We may terminate or suspend your access to the Service immediately,
          without prior notice or liability, under our sole discretion, for any
          reason whatsoever and without limitation, including but not limited to
          a breach of the Terms.
          <br />
          We may terminate or suspend your access to the Service immediately,
          without prior notice or liability, under our sole discretion, for any
          reason whatsoever and without limitation, including but not limited to
          a breach of the Terms.
          <br />
          All provisions of the Terms which by their nature should survive
          termination shall survive termination, including, without limitation,
          ownership provisions, warranty disclaimers, indemnity and limitations
          of liability.
        </p>
        <h3>Indemnification</h3>
        <p>
          You agree to defend, indemnify and hold harmless Global Money List and
          its licensee and licensors, and their employees, contractors, agents,
          officers and directors, from and against any and all claims, damages,
          obligations, losses, liabilities, costs or debt, and expenses
          (including but not limited to attorney's fees), resulting from or
          arising out of a) your use and access of the Service, or b) a breach
          of these Terms.
        </p>
        <h3>Limitation Of Liability</h3>
        <p>
          In no event shall Global Money List, nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your access to or use of
          or inability to access or use the Service; (ii) any conduct or content
          of any third party on the Service; (iii) any content obtained from the
          Service; and (iv) unauthorized access, use or alteration of your
          transmissions or content, whether based on warranty, contract, tort
          (including negligence) or any other legal theory, whether or not we
          have been informed of the possibility of such damage, and even if a
          remedy set forth herein is found to have failed of its essential
          purpose.
        </p>
        <h3>Disclaimer</h3>
        <p>
          Your use of the Service is at your sole risk. The Service is provided
          on an "AS IS" and "AS AVAILABLE" basis. The Service is provided
          without warranties of any kind, whether express or implied, including,
          but not limited to, implied warranties of merchantability, fitness for
          a particular purpose, non-infringement or course of performance.
          <br />
          Global Money List its subsidiaries, affiliates, and its licensors do
          not warrant that a) the Service will function uninterrupted, secure or
          available at any particular time or location; b) any errors or defects
          will be corrected; c) the Service is free of viruses or other harmful
          components; or d) the results of using the Service will meet your
          requirements.
        </p>
        <h3>Exclusions</h3>
        <p>
          Some jurisdictions do not allow the exclusion of certain warranties or
          the exclusion or limitation of liability for consequential or
          incidental damages, so the limitations above may not apply to you.
        </p>
        <h3>Governing Law</h3>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of Illinois, United States, without regard to its conflict of law
          provisions.
          <br />
          Our failure to enforce any right or provision of these Terms will not
          be considered a waiver of those rights. If any provision of these
          Terms is held to be invalid or unenforceable by a court, the remaining
          provisions of these Terms will remain in effect.
          <br />
          These Terms constitute the entire agreement between us regarding our
          Service, and supersede and replace any prior agreements we might have
          had between us regarding the Service.
        </p>
        <h3>Changes</h3>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will provide at
          least 30 days’ notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole
          discretion.
          <br />
          By continuing to access or use our Service after any revisions become
          effective, you agree to be bound by the revised terms. If you do not
          agree to the new terms, you are no longer authorized to use the
          Service.
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us.
          <br />
          Terms of Use of http://globalmoneylist.com
        </p>
      </Typography>
    </Container>
  );
};

export const Terms = withStyles(styles)(TermsView);

export default Terms;
