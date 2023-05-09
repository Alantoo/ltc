import {OffersContainer} from "../OffersContainer";
const offers = ['1 60-day entry into $100.00 Money List - just pay two members $100.00 each in cryptocurrency',
    '1 60-day entry into $50.00 Money List - just pay three members $50.00 each in cryptocurrency',
    '1 60-day entry into $20.00 Money List - just pay four members $20.00 each in cryptocurrency',
    '1 60-day entry into $10.00 Money List – just pay five members $10.00 each in cryptocurrency',
    '1 60-day entry into $5.00 Money List - just pay six members $5.00 each in cryptocurrency',
    '1 60-day entry into $1.00 Money List - just pay seven members $1.00 each in cryptocurrency']

export const SingleEntryOffer = () => {
    return <OffersContainer offers={offers}/>
}