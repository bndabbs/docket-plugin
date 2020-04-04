// package: steno
// file: stenographer.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PcapRequest extends jspb.Message {
    getUid(): string;
    setUid(value: string): void;

    getChunkSize(): number;
    setChunkSize(value: number): void;

    getMaxSize(): number;
    setMaxSize(value: number): void;

    getQuery(): string;

  setQuery(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PcapRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PcapRequest): PcapRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PcapRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PcapRequest;
    static deserializeBinaryFromReader(message: PcapRequest, reader: jspb.BinaryReader): PcapRequest;
}

export namespace PcapRequest {
    export type AsObject = {
        uid: string,
        chunkSize: number,
        maxSize: number,
        query: string,
    }
}

export class PcapResponse extends jspb.Message {
    getUid(): string;
    setUid(value: string): void;

    getPcap(): Uint8Array | string;
    getPcap_asU8(): Uint8Array;
    getPcap_asB64(): string;
    setPcap(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PcapResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PcapResponse): PcapResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PcapResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PcapResponse;
    static deserializeBinaryFromReader(message: PcapResponse, reader: jspb.BinaryReader): PcapResponse;
}

export namespace PcapResponse {
    export type AsObject = {
        uid: string,
        pcap: Uint8Array | string,
    }
}
