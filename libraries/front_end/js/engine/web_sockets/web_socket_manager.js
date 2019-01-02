'use strict';

$_QE.prototype.WebSocketManager = function(engine) {
    this._engine = engine;
    this._engine.flag_set_off(QEFLAG_STATE_WEB_SOCKET_CONNECTED);

    // TODO: Organize/optimize
    this.check_endian = function() {
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
    };

    if (!this.check_endian()) {
        QE.log_error('Client is not little endian. TODO: handle big endian!');
    }

    let worker_web_socket_connection = function() {
        'use strict';

        let self            = this;
        //this.session_values = new Uint8Array(2);

        this.session_id     = 1337;
        this.user_id        = 1337;
        this.buffer         = [];
        this.encoder        = new TextEncoder();
        this.decoder        = new TextDecoder();


        /*    ___          ___    ___  __
         |  |  |  | |    |  |  | |__  /__`
         \__/  |  | |___ |  |  | |___ .__/ */

        /* utf.js - UTF-8 <=> UTF-16 convertion
         *
         * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
         * Version: 1.0
         * LastModified: Dec 25 1999
         * This library is free.  You can redistribute it and/or modify it.
         */
        this.Utf8ArrayToStr = function(array) {
            var out, i, len, c;
            var char2, char3;

            out = '';
            len = array.length;
            i = 0;
            while (i < len) {
                c = array[i++];
                switch (c >> 4)
                {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                                           ((char2 & 0x3F) << 6) |
                                           ((char3 & 0x3F) << 0));
                    break;
                }
            }
            return out;
        };

        this._set_outbound_buffer_type_and_id = function(buf, type, mID) {
            buf[0] = type;
            buf[1] = (mID >> 24) & 255;
            buf[2] = (mID >> 16) & 255;
            buf[3] = (mID >> 8)  & 255;
            buf[4] = mID         & 255;
            return buf;
        };

        this._append_data_header = function(data_type, content) {
            let offset = 0;
            let buf;
            if (data_type == WS_DATA_KEY_TEXT) {
                // Reserve 32 bits to identify length of the content.
                // Additional 8 bits for data type header.
                buf     = new Uint8Array(content.length + 4 + 1);
                let len = content.length;
                buf[0]  = data_type;
                buf[1]  = (len >> 24) & 255;
                buf[2]  = (len >> 16) & 255;
                buf[3]  = (len >> 8) & 255;
                buf[4]  = len & 255;
                offset  = 5;
            }
            let p;
            for (p = 0; p < content.length; p++) {
                buf[p + offset] = content[p];
            }
            return buf;
        };

        /*
        this._add_to_buffer = function(message_type) {
            let b;
            let buf;
            for (b = 0; b < this.buffer.length; b++) {
                buf = this.buffer[b];
                // Is buffer dead? (available to be allocated)
                if (buf[0] == 0) {
                    buf[0] = 1;
                    buf[2] = message_type;
                    // Return the buffer ID.
                    return buf[1];
                }
            }
            // Add new buffer slot.
            buf    = new Uint8Array(3);
            buf[0] = 1;
            buf[1] = this.buffer.length - 1;
            buf[2] = message_type;
            this.buffer.push(buf);
            return this.buffer.length - 1;
        };*/

        this._add_to_buffer = function(message_type) {
            let b;
            let buf;
            for (b = 0; b < this.buffer.length; b++) {
                buf = this.buffer[b];
                // Is buffer dead? (available to be allocated)
                if (buf[0] == 0) {
                    buf[0] = 1;
                    buf[2] = message_type;
                    // Return the buffer ID.
                    return buf[1];
                }
            }
            // Add new buffer slot.
            buf    = new Uint16Array(3);
            buf[0] = 1;
            buf[1] = this.buffer.length - 1;
            buf[2] = message_type;
            this.buffer.push(buf);
            return this.buffer.length - 1;
        };

        this._create_data_packet_string = function(text) {
            //return this._append_data_header(WS_DATA_KEY_TEXT, this.encoder.encode(text));
            //return this.encoder.encode(text);

            return new Uint16Array(this.encoder.encode(text).buffer);

            /*
            let offset = 0;
            let buf;
            // Reserve 32 bits to identify length of the content.
            // Additional 8 bits for data type header.
            buf     = new Uint8Array(content.length + 4 + 1);
            let len = content.length;
            buf[0]  = data_type;
            buf[1]  = (len >> 24) & 255;
            buf[2]  = (len >> 16) & 255;
            buf[3]  = (len >> 8) & 255;
            buf[4]  = len & 255;
            offset  = 5;
            */
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
            //self.socket.send(JSON.stringify(json_data));
            self._send_message(WS_TYPE_GLOBAL_CHAT, self._create_data_packet_string(message));
        };


        /*        ___               __  ___
         | |\ | |  |  |  /\  |    |  / |__
         | | \| |  |  | /~~\ |___ | /_ |___*/
        this.socket            = new WebSocket('ws://localhost/ws/');
        this.socket.binaryType = 'arraybuffer';
        this.socket.onmessage  = function(message) {
            /*
            let m = JSON.parse(message.data);
            if (m != null) {
                self.main._on_message(m);
            }
            */

            /*
            let data         = new DataView(message.data);
            let message_type = data.getInt16(0);
            let message_id   = data.getInt16(1);
            let session_id   = data.getInt16(2);
            let user_id      = data.getInt16(3);
            */

            // TODO:
            let headers = new Uint8Array(message.data.slice(0, 8));
            //let data_raw = new

            let data         = new Uint16Array(message.data);
            let message_type = data[0];
            let message_id   = data[1];
            let session_id   = data[2];
            let user_id      = data[3];

            self.main._on_network_log('Got the following message {' + data.toString() + '}');
            self.main._on_network_log(data);

            if (message_type == WS_TYPE_ESTABLISH_SESSION) {
                self.session_id = session_id;
                self._send_reply(message_type, message_id);
            } else if (message_type == WS_TYPE_SERVER_MESSAGE) {
                let buffer = data.slice(4);
                self.main._on_network_log(buffer);
                self.main._on_network_log(self.decoder.decode(buffer));
                self.main._on_server_message(self.decoder.decode(buffer));
            }

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
            if (self.socket.readyState != 1) {
                self.main._on_error('Websocket did not connect to server within 3 seconds.');
            }
        }, 3000);
    };

    this.thread_web_socket_connection = this._engine.FactoryBridgedWorker(
        worker_web_socket_connection,
        ['send_global_chat'],
        ['_on_message', '_on_error', '_on_open', '_on_close', '_on_network_log', '_on_server_message'],
        [this._on_message.bind(this), this._on_error.bind(this), this._on_open.bind(this), this._on_close.bind(this), this._on_network_log.bind(this), this._on_server_message.bind(this)]
    );
};

$_QE.prototype.WebSocketManager.prototype = {

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
        l('TODO: SEnd message');
        l(json_data);
        //this.thread_web_socket_connection.send_message(json_data);
    },

    //
    get_number_of_connected_sessions: function() {

    },
    //
};
