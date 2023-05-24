import styles from './Price.module.scss';
import { List } from '../../../dataProvider';
import React, { useCallback, useContext } from 'react';
import { rotateTimeToStr } from '../../../helpers/rotateTimeToStr';
import { countToStr } from '../../../helpers/countToStr';
import DataContext from '../../../contexts/DataContext';

const IS_DEV = window.localStorage['IS_DEV'] === 't';
export const Price = ({ offer }: { offer: List }) => {
  const { price, entryPrice, selectCount, rotateTime, id, name } = offer;
  const { dataProvider } = useContext(DataContext);
  const onPaySubmit = useCallback(
    (listId: string | number, direct?: boolean) => {
      dataProvider
        .listStart(listId, direct)
        .then((data = { url: '' }) => {
          if (data.url) {
            window.open(data.url, '_blank');
          } else {
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [dataProvider],
  );
  const onPayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPaySubmit(id);
  };
  const onPayDirectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPaySubmit(id, true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>
          {rotateTimeToStr(rotateTime)} entry into {name} <br />
          Money List for ${entryPrice.toFixed(2)} plus pay <br />{' '}
          {countToStr(selectCount)} members ${price.toFixed(2)} each in <br />{' '}
          Cryptocurrency
        </p>
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={onPayClick}>Pay Now</button>
        {IS_DEV ? (
          <button onClick={onPayDirectClick}>Pay Dev Now</button>
        ) : null}
      </div>
    </div>
  );
};
