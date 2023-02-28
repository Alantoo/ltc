import styles from './MyFAQ.module.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import React, { useState } from 'react';
import closedAccordionIcon from 'assets/closedAccordion.webp';
import openedAccordionIcon from 'assets/openAccordion.webp';
type MyFAQProps = {
  title: string;
  subtitle: string;
};
export const MyFAQ = ({ title, subtitle }: MyFAQProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleFAQClick = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <Accordion
      className={styles.FAQContainer}
      expanded={isOpen}
      onClick={handleFAQClick}
    >
      <AccordionSummary
        expandIcon={
          <img
            src={isOpen ? openedAccordionIcon : closedAccordionIcon}
            alt="accordionIcon"
          />
        }
        className={styles.FAQHeaderContainer}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails className={styles.FAQContentContainer}>
        {subtitle}
      </AccordionDetails>
    </Accordion>
  );
};
