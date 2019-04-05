import * from 'jest';
import { FV_MPA_REFUND } from '../../src/format-validators/mpa_refund';
import { hash } from '../../src/hasher/hash';
import { clone } from '../../src/util';

describe('format-validator: MPA_BID', () => {

    const validate = FV_MPA_REFUND.validate;
    const ok = JSON.parse(
        `{
            "version": "0.1.0.0",
            "action": {
                "type": "MPA_REFUND",
                "bid": "${hash('bid')}",
                "buyer": {
                  "payment": {
                    "escrow": "MULTISIG",
                    "signatures": [
                        {
                            "signature": "signature1",
                            "pubKey": "pubkey1"
                        }
                    ]
                  }
                }
            }
        }`);

    beforeAll(async () => {
        //
    });

    test('validate ok MPA_REFUND', () => {
        let fail: boolean;
        try {
            fail = !validate(ok);
        } catch (e) {
            console.log(e);
            fail = true;
        }
        expect(fail).toBe(false);
    });

    test('validate missing bid hash MPA_REFUND', () => {
        const missing_bid_hash = clone(ok);
        delete missing_bid_hash.action.bid;
        let error = '';
        try {
            validate(missing_bid_hash);
        } catch (e) {
            error = e.toString();
        }
        expect(error).toEqual(expect.stringContaining('bid: missing or not a valid hash'));
    });

    test('validate missing buyer object MPA_REFUND', () => {
        const missing_buyer = clone(ok);
        delete missing_buyer.action.buyer;
        let error = '';
        try {
            validate(missing_buyer);
        } catch (e) {
            error = e.toString();
        }
        expect(error).toEqual(expect.stringContaining('buyer: missing or not an object'));
    });

    test('validate unknown escrow type MPA_REFUND', () => {
        const missing_payment = clone(ok);
        missing_payment.action.buyer.payment = 'UNKWONSDFS';
        let error = '';
        try {
            validate(missing_payment);
        } catch (e) {
            error = e.toString();
        }
        expect(error).toEqual(expect.stringContaining('payment: missing or not an object'));
    });
});
