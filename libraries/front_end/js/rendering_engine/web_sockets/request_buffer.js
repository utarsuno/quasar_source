'use strict';

const _RQ_INDEX_FREE_TO_USE = 0; // #pre-process_global_constant
const _RQ_INDEX_DATA        = 1; // #pre-process_global_constant
const _RQ_INDEX_CALLBACK    = 2; // #pre-process_global_constant

$_QE.prototype.WebsocketRequestBuffer = function() {

    this._request_buffer = [];

    this._add_to_request_buffer = function(json_data, callback) {
    	let rb;
    	for (rb = 0; rb < this._request_buffer.length; rb++) {
    		if (this._request_buffer[rb][_RQ_INDEX_FREE_TO_USE]) {
    			this._request_buffer[rb][_RQ_INDEX_FREE_TO_USE] = false;
    			json_data[_WEB_SOCKET_KEY_ID] 					= rb;
    			this._request_buffer[rb][_RQ_INDEX_DATA] 		= json_data;
    			this._request_buffer[rb][_RQ_INDEX_CALLBACK] 	= callback;
    			return json_data;
    		}
    	}
        json_data[_WEB_SOCKET_KEY_ID] = this._request_buffer.length;
        this._request_buffer.push([false, json_data, callback]);
        return json_data;
    };

    this._on_server_response = function(m) {
    	let message_id = m[_WEB_SOCKET_KEY_ID];
    	this._request_buffer[message_id][_RQ_INDEX_CALLBACK](m);
    	this._request_buffer[message_id][_RQ_INDEX_FREE_TO_USE] = true;
    };
};