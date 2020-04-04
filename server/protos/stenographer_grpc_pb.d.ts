// package: steno
// file: stenographer.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as stenographer_pb from "./stenographer_pb";

interface IStenographerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    retrievePcap: IStenographerService_IRetrievePcap;
}

interface IStenographerService_IRetrievePcap extends grpc.MethodDefinition<stenographer_pb.PcapRequest, stenographer_pb.PcapResponse> {
    path: string; // "/steno.Stenographer/RetrievePcap"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<stenographer_pb.PcapRequest>;
    requestDeserialize: grpc.deserialize<stenographer_pb.PcapRequest>;
    responseSerialize: grpc.serialize<stenographer_pb.PcapResponse>;
    responseDeserialize: grpc.deserialize<stenographer_pb.PcapResponse>;
}

export const StenographerService: IStenographerService;

export interface IStenographerServer {
    retrievePcap: grpc.handleServerStreamingCall<stenographer_pb.PcapRequest, stenographer_pb.PcapResponse>;
}

export interface IStenographerClient {
    retrievePcap(request: stenographer_pb.PcapRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stenographer_pb.PcapResponse>;
    retrievePcap(request: stenographer_pb.PcapRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stenographer_pb.PcapResponse>;
}

export class StenographerClient extends grpc.Client implements IStenographerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public retrievePcap(request: stenographer_pb.PcapRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stenographer_pb.PcapResponse>;
    public retrievePcap(request: stenographer_pb.PcapRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stenographer_pb.PcapResponse>;
}
