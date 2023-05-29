import { Price } from './Price';
import styles from './PriceBox.module.scss';
type PriceBoxProps = {
  text: string;
};
export const PriceBox = ({ text }: PriceBoxProps) => {
  return (
    <div className={styles.container}>
      <Price text={text} />
    </div>
  );
};
