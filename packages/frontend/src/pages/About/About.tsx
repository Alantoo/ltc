import { MainImgWithContent } from '../../components/MainImgWithContent';
import styles from './About.module.scss';
import { AboutContent } from './AboutContent';
const About = () => {
  return (
    <div className={styles.container}>
      <MainImgWithContent
        title="About"
        subtitle="This page will tell about us"
        align="left"
      />
      <AboutContent />
    </div>
  );
};
export default About;
