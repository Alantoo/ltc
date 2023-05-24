import { Price } from './Price';
import styles from './PriceBox.module.scss';
import { List } from '../../dataProvider';
type PriceBoxProps = {
  offer: List;
};
export const PriceBox = ({ offer }: PriceBoxProps) => {
  return (
    <div className={styles.container}>
      <Price offer={offer} />
    </div>
  );
};
