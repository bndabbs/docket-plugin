/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const steno = $root.steno = (() => {

    /**
     * Namespace steno.
     * @exports steno
     * @namespace
     */
    const steno = {};

    steno.Stenographer = (function() {

        /**
         * Constructs a new Stenographer service.
         * @memberof steno
         * @classdesc Represents a Stenographer
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Stenographer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Stenographer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Stenographer;

        /**
         * Creates new Stenographer service using the specified rpc implementation.
         * @function create
         * @memberof steno.Stenographer
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Stenographer} RPC service. Useful where requests and/or responses are streamed.
         */
        Stenographer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link steno.Stenographer#retrievePcap}.
         * @memberof steno.Stenographer
         * @typedef RetrievePcapCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {steno.PcapResponse} [response] PcapResponse
         */

        /**
         * Calls RetrievePcap.
         * @function retrievePcap
         * @memberof steno.Stenographer
         * @instance
         * @param {steno.IPcapRequest} request PcapRequest message or plain object
         * @param {steno.Stenographer.RetrievePcapCallback} callback Node-style callback called with the error, if any, and PcapResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Stenographer.prototype.retrievePcap = function retrievePcap(request, callback) {
            return this.rpcCall(retrievePcap, $root.steno.PcapRequest, $root.steno.PcapResponse, request, callback);
        }, "name", { value: "RetrievePcap" });

        /**
         * Calls RetrievePcap.
         * @function retrievePcap
         * @memberof steno.Stenographer
         * @instance
         * @param {steno.IPcapRequest} request PcapRequest message or plain object
         * @returns {Promise<steno.PcapResponse>} Promise
         * @variation 2
         */

        return Stenographer;
    })();

    steno.PcapRequest = (function() {

        /**
         * Properties of a PcapRequest.
         * @memberof steno
         * @interface IPcapRequest
         * @property {string|null} [uid] PcapRequest uid
         * @property {number|Long|null} [chunkSize] PcapRequest chunkSize
         * @property {number|Long|null} [maxSize] PcapRequest maxSize
         * @property {string|null} [query] PcapRequest query
         */

        /**
         * Constructs a new PcapRequest.
         * @memberof steno
         * @classdesc Represents a PcapRequest.
         * @implements IPcapRequest
         * @constructor
         * @param {steno.IPcapRequest=} [properties] Properties to set
         */
        function PcapRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PcapRequest uid.
         * @member {string} uid
         * @memberof steno.PcapRequest
         * @instance
         */
        PcapRequest.prototype.uid = "";

        /**
         * PcapRequest chunkSize.
         * @member {number|Long} chunkSize
         * @memberof steno.PcapRequest
         * @instance
         */
        PcapRequest.prototype.chunkSize = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PcapRequest maxSize.
         * @member {number|Long} maxSize
         * @memberof steno.PcapRequest
         * @instance
         */
        PcapRequest.prototype.maxSize = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PcapRequest query.
         * @member {string} query
         * @memberof steno.PcapRequest
         * @instance
         */
        PcapRequest.prototype.query = "";

        /**
         * Creates a new PcapRequest instance using the specified properties.
         * @function create
         * @memberof steno.PcapRequest
         * @static
         * @param {steno.IPcapRequest=} [properties] Properties to set
         * @returns {steno.PcapRequest} PcapRequest instance
         */
        PcapRequest.create = function create(properties) {
            return new PcapRequest(properties);
        };

        /**
         * Encodes the specified PcapRequest message. Does not implicitly {@link steno.PcapRequest.verify|verify} messages.
         * @function encode
         * @memberof steno.PcapRequest
         * @static
         * @param {steno.IPcapRequest} message PcapRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PcapRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.chunkSize);
            if (message.maxSize != null && message.hasOwnProperty("maxSize"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.maxSize);
            if (message.query != null && message.hasOwnProperty("query"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.query);
            return writer;
        };

        /**
         * Encodes the specified PcapRequest message, length delimited. Does not implicitly {@link steno.PcapRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof steno.PcapRequest
         * @static
         * @param {steno.IPcapRequest} message PcapRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PcapRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PcapRequest message from the specified reader or buffer.
         * @function decode
         * @memberof steno.PcapRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {steno.PcapRequest} PcapRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PcapRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.steno.PcapRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uid = reader.string();
                    break;
                case 2:
                    message.chunkSize = reader.int64();
                    break;
                case 3:
                    message.maxSize = reader.int64();
                    break;
                case 4:
                    message.query = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PcapRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof steno.PcapRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {steno.PcapRequest} PcapRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PcapRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PcapRequest message.
         * @function verify
         * @memberof steno.PcapRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PcapRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                if (!$util.isInteger(message.chunkSize) && !(message.chunkSize && $util.isInteger(message.chunkSize.low) && $util.isInteger(message.chunkSize.high)))
                    return "chunkSize: integer|Long expected";
            if (message.maxSize != null && message.hasOwnProperty("maxSize"))
                if (!$util.isInteger(message.maxSize) && !(message.maxSize && $util.isInteger(message.maxSize.low) && $util.isInteger(message.maxSize.high)))
                    return "maxSize: integer|Long expected";
            if (message.query != null && message.hasOwnProperty("query"))
                if (!$util.isString(message.query))
                    return "query: string expected";
            return null;
        };

        /**
         * Creates a PcapRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof steno.PcapRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {steno.PcapRequest} PcapRequest
         */
        PcapRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.steno.PcapRequest)
                return object;
            let message = new $root.steno.PcapRequest();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.chunkSize != null)
                if ($util.Long)
                    (message.chunkSize = $util.Long.fromValue(object.chunkSize)).unsigned = false;
                else if (typeof object.chunkSize === "string")
                    message.chunkSize = parseInt(object.chunkSize, 10);
                else if (typeof object.chunkSize === "number")
                    message.chunkSize = object.chunkSize;
                else if (typeof object.chunkSize === "object")
                    message.chunkSize = new $util.LongBits(object.chunkSize.low >>> 0, object.chunkSize.high >>> 0).toNumber();
            if (object.maxSize != null)
                if ($util.Long)
                    (message.maxSize = $util.Long.fromValue(object.maxSize)).unsigned = false;
                else if (typeof object.maxSize === "string")
                    message.maxSize = parseInt(object.maxSize, 10);
                else if (typeof object.maxSize === "number")
                    message.maxSize = object.maxSize;
                else if (typeof object.maxSize === "object")
                    message.maxSize = new $util.LongBits(object.maxSize.low >>> 0, object.maxSize.high >>> 0).toNumber();
            if (object.query != null)
                message.query = String(object.query);
            return message;
        };

        /**
         * Creates a plain object from a PcapRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof steno.PcapRequest
         * @static
         * @param {steno.PcapRequest} message PcapRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PcapRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.uid = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.chunkSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.chunkSize = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.maxSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.maxSize = options.longs === String ? "0" : 0;
                object.query = "";
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = message.uid;
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                if (typeof message.chunkSize === "number")
                    object.chunkSize = options.longs === String ? String(message.chunkSize) : message.chunkSize;
                else
                    object.chunkSize = options.longs === String ? $util.Long.prototype.toString.call(message.chunkSize) : options.longs === Number ? new $util.LongBits(message.chunkSize.low >>> 0, message.chunkSize.high >>> 0).toNumber() : message.chunkSize;
            if (message.maxSize != null && message.hasOwnProperty("maxSize"))
                if (typeof message.maxSize === "number")
                    object.maxSize = options.longs === String ? String(message.maxSize) : message.maxSize;
                else
                    object.maxSize = options.longs === String ? $util.Long.prototype.toString.call(message.maxSize) : options.longs === Number ? new $util.LongBits(message.maxSize.low >>> 0, message.maxSize.high >>> 0).toNumber() : message.maxSize;
            if (message.query != null && message.hasOwnProperty("query"))
                object.query = message.query;
            return object;
        };

        /**
         * Converts this PcapRequest to JSON.
         * @function toJSON
         * @memberof steno.PcapRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PcapRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PcapRequest;
    })();

    steno.PcapResponse = (function() {

        /**
         * Properties of a PcapResponse.
         * @memberof steno
         * @interface IPcapResponse
         * @property {string|null} [uid] PcapResponse uid
         * @property {Uint8Array|null} [pcap] PcapResponse pcap
         */

        /**
         * Constructs a new PcapResponse.
         * @memberof steno
         * @classdesc Represents a PcapResponse.
         * @implements IPcapResponse
         * @constructor
         * @param {steno.IPcapResponse=} [properties] Properties to set
         */
        function PcapResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PcapResponse uid.
         * @member {string} uid
         * @memberof steno.PcapResponse
         * @instance
         */
        PcapResponse.prototype.uid = "";

        /**
         * PcapResponse pcap.
         * @member {Uint8Array} pcap
         * @memberof steno.PcapResponse
         * @instance
         */
        PcapResponse.prototype.pcap = $util.newBuffer([]);

        /**
         * Creates a new PcapResponse instance using the specified properties.
         * @function create
         * @memberof steno.PcapResponse
         * @static
         * @param {steno.IPcapResponse=} [properties] Properties to set
         * @returns {steno.PcapResponse} PcapResponse instance
         */
        PcapResponse.create = function create(properties) {
            return new PcapResponse(properties);
        };

        /**
         * Encodes the specified PcapResponse message. Does not implicitly {@link steno.PcapResponse.verify|verify} messages.
         * @function encode
         * @memberof steno.PcapResponse
         * @static
         * @param {steno.IPcapResponse} message PcapResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PcapResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.pcap != null && message.hasOwnProperty("pcap"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.pcap);
            return writer;
        };

        /**
         * Encodes the specified PcapResponse message, length delimited. Does not implicitly {@link steno.PcapResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof steno.PcapResponse
         * @static
         * @param {steno.IPcapResponse} message PcapResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PcapResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PcapResponse message from the specified reader or buffer.
         * @function decode
         * @memberof steno.PcapResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {steno.PcapResponse} PcapResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PcapResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.steno.PcapResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uid = reader.string();
                    break;
                case 2:
                    message.pcap = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PcapResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof steno.PcapResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {steno.PcapResponse} PcapResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PcapResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PcapResponse message.
         * @function verify
         * @memberof steno.PcapResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PcapResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.pcap != null && message.hasOwnProperty("pcap"))
                if (!(message.pcap && typeof message.pcap.length === "number" || $util.isString(message.pcap)))
                    return "pcap: buffer expected";
            return null;
        };

        /**
         * Creates a PcapResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof steno.PcapResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {steno.PcapResponse} PcapResponse
         */
        PcapResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.steno.PcapResponse)
                return object;
            let message = new $root.steno.PcapResponse();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.pcap != null)
                if (typeof object.pcap === "string")
                    $util.base64.decode(object.pcap, message.pcap = $util.newBuffer($util.base64.length(object.pcap)), 0);
                else if (object.pcap.length)
                    message.pcap = object.pcap;
            return message;
        };

        /**
         * Creates a plain object from a PcapResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof steno.PcapResponse
         * @static
         * @param {steno.PcapResponse} message PcapResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PcapResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.uid = "";
                if (options.bytes === String)
                    object.pcap = "";
                else {
                    object.pcap = [];
                    if (options.bytes !== Array)
                        object.pcap = $util.newBuffer(object.pcap);
                }
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = message.uid;
            if (message.pcap != null && message.hasOwnProperty("pcap"))
                object.pcap = options.bytes === String ? $util.base64.encode(message.pcap, 0, message.pcap.length) : options.bytes === Array ? Array.prototype.slice.call(message.pcap) : message.pcap;
            return object;
        };

        /**
         * Converts this PcapResponse to JSON.
         * @function toJSON
         * @memberof steno.PcapResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PcapResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PcapResponse;
    })();

    return steno;
})();

export { $root as default };
