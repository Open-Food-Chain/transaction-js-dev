// import { LOGIN_CONSENT_OIDC_REQUEST_VDXF_KEY, VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../..";
// import { LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY } from "../../keys";
// import { OidcChallenge, OidcChallengeInterface } from "./OidcChallenge";
// export interface OidcRequestInterface {
//   chain_id: string;
//   signing_id: string;
//   signature: VerusIDSignatureInterface;
//   challenge: OidcChallengeInterface;
// }
// export class OidcRequest extends VDXFObject {
//   chain_id: string;
//   signing_id: string;
//   signature: VerusIDSignature;
//   challenge: OidcChallenge;
//   constructor(request: OidcRequestInterface) {
//     super(LOGIN_CONSENT_OIDC_REQUEST_VDXF_KEY.vdxfid);
//     this.chain_id = request.chain_id;
//     this.signing_id = request.signing_id;
//     this.signature = new VerusIDSignature(request.signature, LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY);
//     this.challenge = new OidcChallenge(request.challenge);
//   }
//   getSignedData() {
//     return this.challenge.toString();
//   }
//   toJson() {
//     return {
//       vdxfkey: this.vdxfkey,
//       chain_id: this.chain_id,
//       signing_id: this.signing_id,
//       signature: this.signature.toJson(),
//       challenge: this.challenge.toJson(),
//     };
//   }
// }
