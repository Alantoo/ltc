import styles from './ThreeColumnsPicture.module.scss';
import leftColumnImg from 'assets/threeColumnImage/leftSideSnapEdit.png';
import rightColumnImg from 'assets/threeColumnImage/rightSideSnapEdit.png';
type ColumnOptions = {
  isList: boolean;
  lineContent: string;
  list: string[];
  extraClass?: string;
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
      <div className={styles.leftColumn}>
        <ul
          className={
            leftColumn.list.length === 0
              ? styles.column +
                ' ' +
                styles.withoutDisc +
                ' ' +
                leftColumn.extraClass
              : styles.column + ' ' + leftColumn.extraClass
          }
        >
          {leftColumn.isList ? (
            leftColumn.list.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>{leftColumn.lineContent}</li>
          )}
        </ul>
        <img
          src={leftColumnImg}
          alt="left column"
          width={imgWidth}
          height={imgHeight}
        />
      </div>
      <div className={styles.midColumn}>
        <img src={img} alt={imgAlt} width={imgWidth} height={imgHeight} />
      </div>
      <div className={styles.rightColumn}>
        <ul
          className={
            rightColumn.list.length === 0
              ? styles.column +
                ' ' +
                styles.withoutDisc +
                ' ' +
                rightColumn.extraClass
              : styles.column + ' ' + rightColumn.extraClass
          }
        >
          {rightColumn.isList ? (
            rightColumn.list.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>{rightColumn.lineContent}</li>
          )}
        </ul>
        <img
          src={rightColumnImg}
          alt="right column"
          width={imgWidth}
          height={imgHeight}
        />
      </div>
    </div>
  );
};
