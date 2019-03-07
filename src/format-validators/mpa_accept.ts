import { MPA_ACCEPT, MPA_REFUND, MPM, PaymentDataAccept, PaymentDataBid } from '../interfaces/omp';
import { MPAction, EscrowType } from '../interfaces/omp-enums';
import { isNumber, isObject, isArray, isString, isSHA256Hash, isValidPrice, clone } from '../util';

import { FV_MPM } from './mpm';
import { FV_CRYPTO } from './crypto';
import { FV_OBJECTS } from './objects';
import { FV_MPA_ACCEPT_ESCROW_MULTISIG } from './escrow/multisig';

export class FV_MPA_ACCEPT {

    public static validate(msg: MPM): boolean {
        // validate base class
        FV_MPM.validate(msg);

        const action = <MPA_ACCEPT> msg.action;

        if (!isString(action.type)) {
            throw new Error('action.type: missing');
        }

        if (action.type !== MPAction.MPA_ACCEPT) {
            throw new Error('action.type: expecting MPA_ACCEPT got ' + action.type);
        }

        if (!isSHA256Hash(action.bid)) {
            throw new Error('action.bid: missing or not a valid hash');
        }

        if (!isObject(action.seller)) {
            throw new Error('action.seller: missing or not an object');
        }

        if (isObject(action.seller.payment)) {
            const paymentDataAccept = action.seller.payment as PaymentDataAccept;

            if (!(paymentDataAccept.escrow in EscrowType)) {
                throw new Error('action.buyer.payment.escrow: expecting escrow type, unknown value, got ' + paymentDataAccept.escrow);
            }

            // TODO: implement all validators
            switch (paymentDataAccept.escrow) {
                case EscrowType.MULTISIG:
                    FV_MPA_ACCEPT_ESCROW_MULTISIG.validate(paymentDataAccept);
                    break;
                case EscrowType.FE:
                    // TODO: not implemented
                case EscrowType.MAD:
                    // TODO: not implemented
                case EscrowType.MAD_CT:
                    // TODO: not implemented
                default:
                    throw new Error('action.seller.payment.escrow: unknown validation format, unknown value, got ' + paymentDataAccept.escrow);
            }

            if (!isValidPrice(paymentDataAccept.fee)) {
                throw new Error('action.seller.payment.fee: not a valid fee');
            }

        } else {
            throw new Error('action.seller.payment: missing or not an object');
        }

        return true;
    }

    constructor() {
        //
    }

}
