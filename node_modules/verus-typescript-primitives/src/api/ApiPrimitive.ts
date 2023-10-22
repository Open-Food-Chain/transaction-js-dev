import { BlockInfo } from "../block/BlockInfo";
import { IdentityDefinition } from "../identity/IdentityDefinition";
import { OfferForMaking } from "../offers/OfferForMaking";
import { ListedOffer } from "../offers/OfferList";
import { RawTransaction } from "../transaction/RawTransaction";

export type ApiPrimitive =
  | string
  | number
  | boolean
  | null
  | OfferForMaking
  | ApiPrimitiveJson
  | ListedOffer
  | Array<ApiPrimitive>
  | IdentityDefinition
  | BlockInfo
  | RawTransaction;

export type ApiPrimitiveJson = { [key: string]: ApiPrimitive | undefined };

export type RequestParams = Array<ApiPrimitive>