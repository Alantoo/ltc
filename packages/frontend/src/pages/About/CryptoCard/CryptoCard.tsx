import styles from './CryptoCard.module.scss';
type CryptoCardProps = {
  cryptoName: string;
  img: string;
};
export const CryptoCard = ({ cryptoName, img }: CryptoCardProps) => {
  return (
    <div className={styles.container}>
      <p>{cryptoName}</p>
      <img src={img} alt={cryptoName} />
    </div>
  );
};
