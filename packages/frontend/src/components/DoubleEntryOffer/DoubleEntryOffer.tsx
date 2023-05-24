import { OffersContainer } from '../OffersContainer';
import { List } from '../../dataProvider';

export const DoubleEntryOffer = ({ offers }: { offers: List[] }) => {
  return <OffersContainer offers={offers} />;
};
