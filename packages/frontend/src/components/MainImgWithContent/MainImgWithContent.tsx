import styles from './MainImgWithContent.module.scss';

type MainImgWithContentProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};
export const MainImgWithContent = ({
  title,
  subtitle,
  children,
}: MainImgWithContentProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
};
