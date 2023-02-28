import styles from './MainImgWithContent.module.scss';

type MainImgWithContentProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  align?: 'center' | 'left';
};
export const MainImgWithContent = ({
  title,
  subtitle,
  children,
  align = 'center',
}: MainImgWithContentProps) => {
  return (
    <div className={styles.container}>
      <div
        className={
          align === 'center'
            ? styles.content
            : styles.content + ' ' + styles.alignLeft
        }
      >
        <h3>{title}</h3>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
};
