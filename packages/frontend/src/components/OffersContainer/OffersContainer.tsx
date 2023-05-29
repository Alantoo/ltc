import styles from './OffersContainer.module.scss';
import { PriceBox } from '../PriceBox';
import { List } from '../../dataProvider';

type PriceBoxContainerProps = {
  offers: List[];
};

export const OffersContainer = ({ offers }: PriceBoxContainerProps) => {
  return (
    <div className={styles.container}>
      {offers.map((offer) => (
        <PriceBox offer={offer} />
      ))}
    </div>
  );
};
