/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

const jspb = require('google-protobuf');
const goog = jspb;
const global = Function('return this')();

goog.exportSymbol('proto.steno.PcapRequest', null, global);
goog.exportSymbol('proto.steno.PcapResponse', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.steno.PcapRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.steno.PcapRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.steno.PcapRequest.displayName = 'proto.steno.PcapRequest';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.steno.PcapRequest.prototype.toObject = function(opt_includeInstance) {
    return proto.steno.PcapRequest.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.steno.PcapRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.steno.PcapRequest.toObject = function(includeInstance, msg) {
    let f;
    const obj = {
      uid: jspb.Message.getFieldWithDefault(msg, 1, ''),
      chunkSize: jspb.Message.getFieldWithDefault(msg, 2, 0),
      maxSize: jspb.Message.getFieldWithDefault(msg, 3, 0),
      query: jspb.Message.getFieldWithDefault(msg, 4, ''),
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.steno.PcapRequest}
 */
proto.steno.PcapRequest.deserializeBinary = function(bytes) {
  const reader = new jspb.BinaryReader(bytes);
  const msg = new proto.steno.PcapRequest();
  return proto.steno.PcapRequest.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.steno.PcapRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.steno.PcapRequest}
 */
proto.steno.PcapRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    const field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setUid(value);
        break;
      case 2:
        var value = /** @type {number} */ (reader.readInt64());
        msg.setChunkSize(value);
        break;
      case 3:
        var value = /** @type {number} */ (reader.readInt64());
        msg.setMaxSize(value);
        break;
      case 4:
        var value = /** @type {string} */ (reader.readString());
        msg.setQuery(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.steno.PcapRequest.prototype.serializeBinary = function() {
  const writer = new jspb.BinaryWriter();
  proto.steno.PcapRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.steno.PcapRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.steno.PcapRequest.serializeBinaryToWriter = function(message, writer) {
  let f = undefined;
  f = message.getUid();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getChunkSize();
  if (f !== 0) {
    writer.writeInt64(2, f);
  }
  f = message.getMaxSize();
  if (f !== 0) {
    writer.writeInt64(3, f);
  }
  f = message.getQuery();
  if (f.length > 0) {
    writer.writeString(4, f);
  }
};

/**
 * optional string uid = 1;
 * @return {string}
 */
proto.steno.PcapRequest.prototype.getUid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''));
};

/** @param {string} value */
proto.steno.PcapRequest.prototype.setUid = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional int64 chunk_size = 2;
 * @return {number}
 */
proto.steno.PcapRequest.prototype.getChunkSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};

/** @param {number} value */
proto.steno.PcapRequest.prototype.setChunkSize = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};

/**
 * optional int64 max_size = 3;
 * @return {number}
 */
proto.steno.PcapRequest.prototype.getMaxSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};

/** @param {number} value */
proto.steno.PcapRequest.prototype.setMaxSize = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};

/**
 * optional string query = 4;
 * @return {string}
 */
proto.steno.PcapRequest.prototype.getQuery = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''));
};

/** @param {string} value */
proto.steno.PcapRequest.prototype.setQuery = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.steno.PcapResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.steno.PcapResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.steno.PcapResponse.displayName = 'proto.steno.PcapResponse';
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.steno.PcapResponse.prototype.toObject = function(opt_includeInstance) {
    return proto.steno.PcapResponse.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.steno.PcapResponse} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.steno.PcapResponse.toObject = function(includeInstance, msg) {
    let f;
    const obj = {
      uid: jspb.Message.getFieldWithDefault(msg, 1, ''),
      pcap: msg.getPcap_asB64(),
    };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.steno.PcapResponse}
 */
proto.steno.PcapResponse.deserializeBinary = function(bytes) {
  const reader = new jspb.BinaryReader(bytes);
  const msg = new proto.steno.PcapResponse();
  return proto.steno.PcapResponse.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.steno.PcapResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.steno.PcapResponse}
 */
proto.steno.PcapResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    const field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setUid(value);
        break;
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes());
        msg.setPcap(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.steno.PcapResponse.prototype.serializeBinary = function() {
  const writer = new jspb.BinaryWriter();
  proto.steno.PcapResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.steno.PcapResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.steno.PcapResponse.serializeBinaryToWriter = function(message, writer) {
  let f = undefined;
  f = message.getUid();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getPcap_asU8();
  if (f.length > 0) {
    writer.writeBytes(2, f);
  }
};

/**
 * optional string uid = 1;
 * @return {string}
 */
proto.steno.PcapResponse.prototype.getUid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''));
};

/** @param {string} value */
proto.steno.PcapResponse.prototype.setUid = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional bytes pcap = 2;
 * @return {!(string|Uint8Array)}
 */
proto.steno.PcapResponse.prototype.getPcap = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ''));
};

/**
 * optional bytes pcap = 2;
 * This is a type-conversion wrapper around `getPcap()`
 * @return {string}
 */
proto.steno.PcapResponse.prototype.getPcap_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPcap()));
};

/**
 * optional bytes pcap = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPcap()`
 * @return {!Uint8Array}
 */
proto.steno.PcapResponse.prototype.getPcap_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPcap()));
};

/** @param {!(string|Uint8Array)} value */
proto.steno.PcapResponse.prototype.setPcap = function(value) {
  jspb.Message.setProto3BytesField(this, 2, value);
};

goog.object.extend(exports, proto.steno);
