import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  DefaultTheme,
} from '@material-ui/styles';
import top from 'assets/top.png';
import { MyTheme } from '../theme';

type ClassKey = 'root';

const styles = (theme: DefaultTheme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      position: 'fixed',
      bottom: 20,
      right: 20,
      opacity: 0,
      transition: 'opacity 0.3s ease',
      '&.showed': {
        opacity: 1,
      },
      '& a': {
        display: 'block',
        width: 48,
        height: 48,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRadius: '50%',
        boxShadow: '5px -1px 24px #332b2b59',
        textIndent: 200,
        background: `rgba(255, 255, 255, 0.5) url(${top}) no-repeat`,
        backgroundSize: 'cover',
      },
    },
  });
};

type ScrollToTopProps = WithStyles<ClassKey>;

const ScrollToTopView = ({ classes }: ScrollToTopProps) => {
  const [showed, setShowed] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    updateVisibility();
    window.addEventListener('scroll', () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        updateVisibility();
      }, 500);
    });
  }, []);

  const onScrollClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateVisibility = useCallback(() => {
    console.log(window.scrollY);
    if (window.scrollY > 400) {
      setShowed(true);
    } else {
      setShowed(false);
    }
  }, [setShowed]);

  return (
    <div className={`${classes.root} ${showed ? 'showed' : ''}`}>
      <a href="#" title="Scroll to top" onClick={onScrollClick}>
        Scroll top
      </a>
    </div>
  );
};

export const ScrollToTop = withStyles(styles)(ScrollToTopView);

export default ScrollToTop;
