'use strict';

$_QE.prototype.WebSocketManager = function(engine) {
    this.__init__(engine);

    let worker_web_socket_connection = function() {
        'use strict';

        let MessageInstance = function() {
            this.alive          = false;
            // |2 bytes     |2 bytes   |2 bytes   |2 bytes|4 bytes        |
            // |message_type|message_id|session_id|user_id|unix_time_stamp|
            this.header          = new Uint16Array(4);
            this.time_stamp      = new Uint32Array(1);
            this.data_length_max = 10;
            this.data_length     = 0;
            this.data            = new Uint8Array(this.data_length_max);
        };

        MessageInstance.prototype = {
            _set_packet_size_in_header: function(packet, packet_size) {
                let header = new Uint16Array(1);
                header[0]  = packet_size;
                packet[0]  = header.buffer[0];
                packet[1]  = header.buffer[1];
            },
            _copy_bytes_from_to: function(from, from_start, to, to_start, number_of_bytes) {
                let b;
                for (b = 0; b < number_of_bytes; b++) {
                    to[to_start + b] = from[from_start + b];
                }
            },
            add_packet_text: function(text) {
                let t           = self.encoder.encode(text).buffer;
                let packet      = new Uint8Array(2 + t.byteLength);
                this._set_packet_size_in_header(packet, t.byteLength);
                this._copy_bytes_from_to(t, 0, packet, 2, 2);
                this._add_packet(packet, 2 + t.byteLength);
            },
            _add_packet: function(buffer_data, buffer_length) {
                // TODO: Eventually optimize (no while loop too lol).
                while (this.data_length + buffer_length >= this.data_length_max) {
                    this.data_length_max *= 2;
                    let new_data = new Uint8Array(this.data_length_max);
                    this._copy_bytes_from_to(this.data, 0, new_data, 0, this.data_length);
                    this.data = new_data;
                }
                this._copy_bytes_from_to(buffer_data, 0, this.data, this.data_length, buffer_length);
                this.data_length += buffer_length;
            },
            set_type: function(type) {
                this.header[HEADER_INDEX_TYPE] = type;
            },
            set_to_alive: function() {
                this.alive = true;
            },
            kill: function() {
                this.alive = false;
            }
        };

        let MessageSendInstance = function() {
            MessageInstance.call(this);
        };

        Object.assign(
            MessageSendInstance.prototype,
            MessageInstance.prototype,
            {
                set_data: function(data) {
                    switch(this.header[HEADER_INDEX_TYPE]) {
                    case WS_TYPE_GLOBAL_CHAT:
                        this.add_packet_text(data);
                        break;
                    case WS_TYPE_GET_NUM_SESSIONS:
                        break;
                    default:
                        self.main._on_network_log('INVALID DATA TYPE{' + this.header[HEADER_INDEX_TYPE] + '}!');
                        break;
                    }
                }
            }
        );

        let MessageReceiveInstance = function() {
            MessageInstance.call(this);
        };

        Object.assign(
            MessageReceiveInstance.prototype,
            MessageInstance.prototype,
            {
                _handle_establish_session: function() {

                },

                handle_response: function(message_data_as_uint8array) {
                    this._parse_binary_packet_data(message_data_as_uint8array);

                    let message_type = this.header[HEADER_INDEX_TYPE];

                    switch (message_type) {
                    case WS_TYPE_ESTABLISH_SESSION:
                        self.main._on_network_log('TODO: Establish message!');
                        self.session_id = this.header[HEADER_INDEX_SID];
                        // TODO: Send a reply here!
                        // self._send_reply(message_type, message_id);
                        break;
                    case WS_TYPE_SERVER_MESSAGE:
                        self.main._on_network_log('TODO: Server message!');
                        this._parse_data_as_string();
                        self.main._on_network_log(this.data);
                        self.main._on_network_log(self.decoder.decode(this.data));
                        self.main._on_server_message(self.decoder.decode(this.data));
                        break;
                    default:
                        self.main._on_error('Invalid message type of {' + message_type + '}!');
                        break;
                    }
                },

                _parse_binary_packet_data: function(message_data_as_uint8array) {
                    let packet_length = message_data_as_uint8array.buffer.byteLength;
                    //if (packet_length < 2 || packet_length == 3 || packet_length == 5 || packet_length == 7 || packet_length



                    let headers                    = new Uint16Array(message_data_as_uint8array.buffer.slice(0, 8));
                    this.header[HEADER_INDEX_TYPE] = headers[0];
                    this.header[HEADER_INDEX_MID]  = headers[1];
                    this.header[HEADER_INDEX_SID]  = headers[2];
                    this.header[HEADER_INDEX_UID]  = headers[3];
                    if (message_data_as_uint8array.byteLength > 8) {
                        this.data = new Uint8Array(message_data_as_uint8array.buffer.slice(8));
                    }
                },

                _parse_data_as_string: function() {
                    // TODO: Do an error check that there are more bytes than just the headers!
                }
            }
        );

        let MessagePoolManager = function(pool_type) {
            this._pool_type = pool_type;
            this.pool       = [];
        };

        MessagePoolManager.prototype = {
            get_pool_object: function() {
                let i;
                for (i = 0; i < this.pool.length; i++) {
                    if (!this.pool[i].alive) {
                        this.pool[i].alive = true;
                        return this.pool[i];
                    }
                }
                // No empty pool slots, create a new slot.
                let slot;
                if (this._pool_type === POOL_TYPE_SENT) {
                    slot = new MessageReceiveInstance();
                } else {
                    slot = new MessageSendInstance();
                }
                slot.alive = true;
                this.pool.push(slot);
                return slot;
            },
        };

        /*__   __   ___  __       ___    __        __
         /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
         \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/*/

        this._send_message = function(message_type, content) {
            // TODO:
            let buffer_id = this._add_to_buffer(message_type);
            //
            //let message   = new Uint8Array(content.length + 4);
            let message   = new Uint16Array(content.length + 4);
            message[0]    = message_type;
            message[1]    = buffer_id;
            message[2]    = self.session_id;
            message[3]    = self.user_id;
            let b;
            for (b = 0; b < content.length; b++) {
                message[b + 4] = content[b];
            }
            this.socket.send(message.buffer);
        };

        this._send_reply = function(message_type, message_id) {
            let message = new Uint16Array(4);
            message[0] = message_type;
            message[1] = message_id;
            message[2] = self.session_id;
            message[3] = self.user_id;
            self.socket.send(message.buffer);
        };

        this.send_global_chat = function(message) {
            //self._send_message(WS_TYPE_GLOBAL_CHAT, self._create_data_packet_string(message));
            let m = self.pool_sent.get_pool_object();
            m.set_type(WS_TYPE_GLOBAL_CHAT);
            m.set_data(message);
            m.send();
        };

        /*        ___               __  ___
         | |\ | |  |  |  /\  |    |  / |__
         | | \| |  |  | /~~\ |___ | /_ |___*/
        let self               = this;
        this.session_id        = WS_ID_INVALID;
        this.user_id           = WS_ID_INVALID;
        this.encoder           = new TextEncoder();
        this.decoder           = new TextDecoder();
        this.pool_sent         = new MessagePoolManager(POOL_TYPE_SENT);
        this.pool_received     = new MessagePoolManager(POOL_TYPE_RECEIVED);
        this.socket            = new WebSocket('ws://localhost/ws/');
        this.socket.binaryType = 'arraybuffer';
        this.socket.onmessage  = function(message) {
            let m = self.pool_received.get_pool_object();
            m.handle_response(new Uint8Array(message.data));
            /*
            self.main._on_network_log('The original data is {' + original_data.toString() + '}');
            self.main._on_network_log('Got the following headers {' + headers.toString() + '}');
            self.main._on_network_log('Got the following message {' + data.toString() + '}');
            self.main._on_network_log(data);
            */
        };
        this.socket.onerror = function(error) {
            self.main._on_error(error); //this.encoder.encode(error)
        };
        this.socket.onclose = function() {
            self.main._on_close();
        };
        this.socket.onopen = function() {
            self.main._on_open();
        };

        // Solution from: https://stackoverflow.com/questions/25779831/how-to-catch-websocket-connection-to-ws-xxxnn-failed-connection-closed-be
        setTimeout(function () {
            if (self.socket.readyState !== 1) {
                self.main._on_error('Websocket did not connect to server within 3 seconds.');
            }
        }, 3000);
    };

    // Link the main thread to this worker.
    this.thread_web_socket_connection = this._engine.FactoryBridgedWorker(
        worker_web_socket_connection,
        // Main thread message to worker.
        ['send_global_chat'],
        // Worker message to main thread.
        ['_on_message', '_on_error', '_on_open', '_on_close', '_on_network_log', '_on_server_message'],
        [this._on_message.bind(this), this._on_error.bind(this), this._on_open.bind(this), this._on_close.bind(this), this._on_network_log.bind(this), this._on_server_message.bind(this)]
    );
};

$_QE.prototype.WebSocketManager.prototype = {

    __init__: function(engine) {
        this._engine = engine;
        this._engine.flag_set_off(QEFLAG_STATE_WEB_SOCKET_CONNECTED);
        if (!this._check_endian()) {
            QE.error('Client is not little endian. TODO: handle big endian!');
        }
    },

    update: function(delta) {

    },

    parse_user_input_from_hud: function(user_input) {
        l('Parsing user input {' + user_input + '}');

        QE.hud_chat.add_message('TODO{Remove duplicate}:' + user_input);

        //if (user_input == '.save()') --> QE.perform_global_save();
        //if (user_input.startsWith('>')) --> this.send_request_cmd(user_input.substring(1));
        //else --> this.send_request_chat(user_input);

        this.thread_web_socket_connection.send_global_chat(user_input);
    },

    _on_server_message: function(message) {
        this._engine.hud_chat.add_message(message);
    },

    _on_network_log: function(message) {
        l(message);
    },

    _on_message: function(message) {
        l('got the message');
        l(message);
    },

    _on_error: function(error) {
        l('Error!');
        l(error);
    },

    _on_open: function() {
        this._engine.flag_set_on(QEFLAG_STATE_WEB_SOCKET_CONNECTED);
        this._engine.hud_chat.add_message('Connected to server!');
    },

    _on_close: function() {
        this._engine.flag_set_off(QEFLAG_STATE_WEB_SOCKET_CONNECTED);
        this._engine.hud_chat.add_message_error('Connection to server closed!');
    },

    _send_message: function(json_data) {
        l('TODO: Send message');
        l(json_data);
        //this.thread_web_socket_connection.send_message(json_data);
    },

    //
    get_number_of_connected_sessions: function() {

    },
    //

    // ------------------------------------------------------------------------------------------------------
    _check_endian: function() {
        // From : https://stackoverflow.com/questions/7869752/javascript-typed-arrays-and-endianness
        let arrayBuffer = new ArrayBuffer(2);
        let uint8Array  = new Uint8Array(arrayBuffer);
        let uint16array = new Uint16Array(arrayBuffer);
        uint8Array[0]   = 0xAA; // set first byte
        uint8Array[1]   = 0xBB; // set second byte
        if (uint16array[0] === 0xBBAA) {
            return true;
        }
        if(uint16array[0] === 0xAABB) {
            return false;
        }
    }
};
