import React, { useContext } from 'react';
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
export type ClassKey = 'root' | 'introSlide' | 'simpleSlide' | 'bgSlide';
import { getMainPageContent } from 'helpers/getMainPageContent';
const styles = (theme: Theme) => {
  const myTheme = theme as MyTheme;
  return createStyles({
    root: {
      paddingBottom: '50px',
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
  });
};

type HomeProps = WithStyles<ClassKey>;

const HomeView = ({ classes }: HomeProps) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }
  return (
    <div className={classes.root}>
      <MainImgWithContent
        title="global money list"
        subtitle="The greatest Residual Income System Ever! Earn hundreds of dollars in bitcoin daily"
        align="center"
      >
        <button className="buttonInImg">Join Now</button>
      </MainImgWithContent>
      {getMainPageContent(user)}
    </div>
  );
};

export const Home = withStyles(styles)(HomeView);

export default Home;
