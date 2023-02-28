import styles from './Paragraph.module.scss';

type ParagraphProps = {
  title: string;
  subtitle: string;
  subtitleTopMargin: number;
  subtitleLineHeight: string;
  containerMargin: string;
};
export const Paragraph = ({
  title,
  subtitleTopMargin,
  subtitle,
  subtitleLineHeight,
  containerMargin,
}: ParagraphProps) => {
  return (
    <div style={{ margin: containerMargin }} className={styles.container}>
      <p>{title}</p>
      <span
        style={{ marginTop: subtitleTopMargin, lineHeight: subtitleLineHeight }}
      >
        {subtitle}
      </span>
    </div>
  );
};
