import styles from './CryptoCard.module.scss';
type CryptoCardProps = {
  cryptoName: string;
  img: string;
  width?: number;
  height?: number;
};
export const CryptoCard = ({
  cryptoName,
  img,
  width = 595,
  height = 397,
}: CryptoCardProps) => {
  return (
    <div className={styles.container}>
      <p>{cryptoName}</p>
      <img src={img} alt={cryptoName} width={width} height={height} />
    </div>
  );
};
