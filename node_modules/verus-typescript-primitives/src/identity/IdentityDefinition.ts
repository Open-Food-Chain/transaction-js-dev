export interface IdentityDefinition {
  version?: number;
  flags?: number;
  primaryaddresses: Array<string>;
  minimumsignatures: number;
  name: string;
  identityaddress?: string;
  parent: string;
  systemid?: string;
  contentmap?: { [key: string]: string };
  revocationauthority?: string;
  recoveryauthority?: string;
  timelock?: number;
}