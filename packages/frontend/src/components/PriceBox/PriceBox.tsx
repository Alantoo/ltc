import { Price } from './Price';
import styles from './PriceBox.module.scss';
type Price = {
  text: string;
};
const priceMock: Price[] = [
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi beatae bland',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi beatae bland',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi beatae bland',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi beatae bland',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi beatae bland',
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci animi beatae bland',
  },
];
export const PriceBox = () => {
  return (
    <div className={styles.container}>
      {priceMock.map((item) => (
        <Price text={item.text} />
      ))}
    </div>
  );
};
