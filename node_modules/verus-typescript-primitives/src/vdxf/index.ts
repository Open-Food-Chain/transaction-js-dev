import base64url from "base64url";
import createHash = require("create-hash");
import { DEFAULT_VERSION, HASH160_BYTE_LENGTH, I_ADDR_VERSION } from '../constants/vdxf';
import { fromBase58Check, toBase58Check } from '../utils/address';
import bufferutils from '../utils/bufferutils';
import varint from '../utils/varint';
import varuint from '../utils/varuint';
import { Hash160 } from "./classes/Hash160";
import { LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY, VDXFKeyInterface } from './keys';
import { BN } from "bn.js";
export * from './keys'
export * from './scopes'

export interface VDXFObjectInterface {
  vdxfkey: string;
  toString: () => string;
  toJson: () => { [key: string]: any };
  toBuffer: () => Buffer;
  toDataBuffer: () => Buffer;
  fromDataBuffer: (buffer: Buffer, offset: number) => number;
  fromBuffer: (buffer: Buffer, offset: number) => number;
  dataByteLength: () => number;
  byteLength: () => number;
}

export interface VerusIDSignatureInterface {
  signature: string;
}

export class VDXFObject implements VDXFObjectInterface {
  vdxfkey: string;
  version: number;

  constructor(key: string = "") {
    this.vdxfkey = key;
    this.version = DEFAULT_VERSION;
  }

  toJson() {
    return {};
  }

  toString() {
    return base64url.encode(this.toBuffer())
  }

  dataByteLength() {
    return 0;
  }

  toDataBuffer() {
    return Buffer.alloc(0);
  }
  
  fromDataBuffer(buffer: Buffer, offset: number = 0) {
    return offset
  }

  fromBuffer(buffer: Buffer, offset: number = 0) {
    const reader = new bufferutils.BufferReader(buffer, offset);

    const keyHash = reader.readSlice(HASH160_BYTE_LENGTH);
    const version = reader.readVarInt();

    this.vdxfkey = toBase58Check(keyHash, I_ADDR_VERSION)
    this.version = version.toNumber();

    if (offset < buffer.length - 1) {
      reader.offset = this.fromDataBuffer(reader.buffer, reader.offset)
    }

    return reader.offset
  }

  byteLength() {
    const dataLength = this.dataByteLength();
    const keyLength = fromBase58Check(this.vdxfkey).hash.length
    const versionEncodingLength = varint.encodingLength(new BN(this.version))
    const dataEncodingLength = varuint.encodingLength(dataLength)

    return dataLength + keyLength + versionEncodingLength + dataEncodingLength;
  }

  toBuffer() {
    const key = fromBase58Check(this.vdxfkey);
    const dataLength = this.dataByteLength();
    const buffer = Buffer.alloc(this.byteLength());
    const writer = new bufferutils.BufferWriter(buffer);

    writer.writeSlice(key.hash);
    writer.writeVarInt(new BN(this.version, 10));

    if (dataLength) {      
      writer.writeVarSlice(this.toDataBuffer());
    }

    return writer.buffer;
  }

  toSha256() {
    return createHash("sha256").update(this.toBuffer()).digest();
  }
}

export class BufferDataVdxfObject extends VDXFObject {
  data: string;
  encoding: BufferEncoding = "hex";

  constructor(
    data: string = "",
    vdxfkey: string = "",
    encoding: BufferEncoding = "hex"
  ) {
    super(vdxfkey);

    this.data = data;
    this.encoding = encoding;
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return Buffer.from(this.data, this.encoding);
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    this.data = reader.readVarSlice().toString(this.encoding);

    return reader.offset;
  }

  toJson() {
    return {
      data: this.data,
      vdxfkey: this.vdxfkey,
    };
  }
}

export class Utf8DataVdxfObject extends BufferDataVdxfObject {
  constructor(data: string = "", vdxfkey: string = "") {
    super(data, vdxfkey, "utf-8");
  }
}

export class HexDataVdxfObject extends BufferDataVdxfObject {
  constructor(data: string = "", vdxfkey: string = "") {
    super(data, vdxfkey, "hex");
  }
}

export class Utf8OrBase58Object extends VDXFObject {
  data: string;

  // VDXF keys that would cause this object to be base58 instead of utf8
  base58Keys: {[key: string]: boolean} = {};

  constructor(data: string = "", vdxfkey: string = "", base58Keys: Array<string> = []) {
    super(vdxfkey);

    for (const key of base58Keys) {
      this.base58Keys[key] = true
    }

    this.data = data
  }

  isBase58(): boolean {
    return this.base58Keys[this.vdxfkey];
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return this.isBase58()
      ? (Hash160.fromAddress(this.data, false)).toBuffer()
      : Buffer.from(this.data as string, "utf-8");
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    if (this.isBase58()) {
      const _data = new Hash160();

      // varlength is set to true here because vdxf objects always have a 
      // variable length data field. This has160 object was not creted with
      // varlength true, but this is a shortcut instead of writing readVarSlice 
      // and then fromBuffer. 
      reader.offset = _data.fromBuffer(reader.buffer, true, reader.offset);
      _data.varlength = false;

      this.data = _data.toAddress();
    } else {
      this.data = reader.readVarSlice().toString('utf-8')
    }
    
    return reader.offset
  }

  toJson() {
    return {
      data: this.data,
      vdxfkey: this.vdxfkey,
    };
  }
}

export class VerusIDSignature extends VDXFObject {
  signature: string;

  constructor(
    sig: VerusIDSignatureInterface = { signature: "" },
    vdxfkey: VDXFKeyInterface = LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY
  ) {
    super(vdxfkey.vdxfid);
    this.signature = sig.signature;
  }

  dataByteLength(): number {
    return this.toDataBuffer().length;
  }

  toDataBuffer(): Buffer {
    return Buffer.from(this.signature, "base64");
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {
    const reader = new bufferutils.BufferReader(buffer, offset);

    this.signature = reader.readVarSlice().toString("base64");

    return reader.offset;
  }

  toJson() {
    return {
      vdxfkey: this.vdxfkey,
      signature: this.signature,
    };
  }
}