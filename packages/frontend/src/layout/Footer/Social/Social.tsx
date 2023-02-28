import styles from './Social.module.scss';
type SocialProps = {
  img: string;
  imgAlt: string;
  imgWidth: number;
  imgHeight: number;
  linkTo: string;
};
export const Social = ({
  img,
  imgAlt,
  imgHeight,
  imgWidth,
  linkTo,
}: SocialProps) => {
  return (
    <a href={linkTo} className={styles.container}>
      <img src={img} alt={imgAlt} width={imgWidth} height={imgHeight} />
    </a>
  );
};
