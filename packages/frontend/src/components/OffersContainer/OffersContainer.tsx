import styles from './OffersContainer.module.scss';
import { PriceBox } from '../PriceBox';

type PriceBoxContainerProps = {
  offers: string[];
};

export const OffersContainer = ({ offers }: PriceBoxContainerProps) => {
  return (
    <div className={styles.container}>
      {offers.map((item) => (
        <PriceBox text={item} />
      ))}
    </div>
  );
};
