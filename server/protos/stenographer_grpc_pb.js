// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var stenographer_pb = require('./stenographer_pb.js');

function serialize_steno_PcapRequest(arg) {
  if (!(arg instanceof stenographer_pb.PcapRequest)) {
    throw new Error('Expected argument of type steno.PcapRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_steno_PcapRequest(buffer_arg) {
  return stenographer_pb.PcapRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_steno_PcapResponse(arg) {
  if (!(arg instanceof stenographer_pb.PcapResponse)) {
    throw new Error('Expected argument of type steno.PcapResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_steno_PcapResponse(buffer_arg) {
  return stenographer_pb.PcapResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var StenographerService = exports.StenographerService = {
  retrievePcap: {
    path: '/steno.Stenographer/RetrievePcap',
    requestStream: false,
    responseStream: true,
    requestType: stenographer_pb.PcapRequest,
    responseType: stenographer_pb.PcapResponse,
    requestSerialize: serialize_steno_PcapRequest,
    requestDeserialize: deserialize_steno_PcapRequest,
    responseSerialize: serialize_steno_PcapResponse,
    responseDeserialize: deserialize_steno_PcapResponse,
  },
};

exports.StenographerClient = grpc.makeGenericClientConstructor(StenographerService);
