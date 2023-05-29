import { OffersContainer } from '../OffersContainer';

const offers = [
  '2 60-day entry into $100.00 Money List for $39.95 plus pay two members $100.00 each in cryptocurrency',
  '2 60-day entry into $50.00 Money List for $29.95 plus pay three members $50.00 each in cryptocurrency',
  '2 60-day entry into $20.00 Money List for $14.95 plus pay four members $20.00 each in cryptocurrency',
  ' 2 60-day entry into $10.00 Money List for $9.95 plus pay five members $10.00 each in cryptocurrency',
  ' 2 60-day entry into $5.00 Money List for $5.95 plus pay six members $5.00 each in cryptocurrency',
  '2 60-day entry into $1.00 Money List for $1.49 plus pay seven members $1.00 each in cryptocurrency',
];

export const DoubleEntryOffer = () => {
  return <OffersContainer offers={offers} />;
};
