import styles from './Price.module.scss';

type PriceProps = { text: string };

export const Price = ({ text }: PriceProps) => {
  const handleFirstButtonClick = () => {
    console.log('pay now');
  };
  const handleSecondButtonClick = () => {
    console.log('pay dev now');
  };
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>{text}</p>
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={handleFirstButtonClick}>Pay Now</button>
        <button onClick={handleSecondButtonClick}>Pay Dev Now</button>
      </div>
    </div>
  );
};
