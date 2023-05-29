import { OffersContainer } from '../OffersContainer';
import { List } from '../../dataProvider';
export const SingleEntryOffer = ({ offers }: { offers: List[] }) => {
  return <OffersContainer offers={offers} />;
};
