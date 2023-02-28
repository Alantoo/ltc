import styles from './ThreeColumnsPicture.module.scss';

type ColumnOptions = {
  isList: boolean;
  lineContent: string;
  list: string[];
};
type ThreeColumnsPictureProps = {
  leftColumn: ColumnOptions;
  rightColumn: ColumnOptions;
  img: string;
  imgAlt: string;
  imgWidth: number;
  imgHeight: number;
  extraClass: string;
};

export const ThreeColumnsPicture = ({
  leftColumn,
  rightColumn,
  img,
  imgAlt,
  imgHeight,
  imgWidth,
  extraClass,
}: ThreeColumnsPictureProps) => {
  return (
    <div
      className={styles.container + ' ' + extraClass}
      style={{ height: imgHeight }}
    >
      <ul
        className={
          leftColumn.list.length === 0
            ? styles.leftColumn + ' ' + styles.withoutDisc
            : styles.leftColumn
        }
      >
        {leftColumn.isList ? (
          leftColumn.list.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>{leftColumn.lineContent}</li>
        )}
      </ul>
      <img src={img} alt={imgAlt} width={imgWidth} height={imgHeight} />
      <ul className={styles.rightColumn}>
        {rightColumn.isList ? (
          rightColumn.list.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>{rightColumn.lineContent}</li>
        )}
      </ul>
    </div>
  );
};
