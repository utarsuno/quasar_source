package db_server_message.defined_messages;

import quasar_database_server.QuasarDatabaseServer;

import java.util.ArrayList;
import java.util.Map;

public abstract class DBServerMessageWithResponse extends DBServerMessage {

    private ArrayList<String> keys;
    private ArrayList<Object> values;

    public DBServerMessageWithResponse(int message_type, Map<String, Object> map) {
        super(message_type, map);
        this.keys = new ArrayList<>();
        this.values = new ArrayList<>();
    }

    private void add_response(String key, String value) {
        this.keys.add(key);
        this.values.add(value);
    }

    public void add_response_positive(Boolean positive) {
        if (positive) {
            this.add_response(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_RESPONSE_POSITIVE, "true");
        } else {
            this.add_response(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_RESPONSE_POSITIVE, "false");
        }
    }

    @Override
    public final boolean has_response() {
        return true;
    }

    @Override
    public byte[] get_message_response() {
        String message_id = Integer.toString((int) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_MESSAGE_ID));
        this.add_response(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_MESSAGE_ID, message_id);

        String response = "{";
        for (int i = 0; i < this.keys.size(); i++) {
            response += "\"" + this.keys.get(i) + "\":" + this.values.get(i) + ",";
        }
        response = response.subSequence(0, response.length() - 1) + "}";

        return response.getBytes();
    }
}