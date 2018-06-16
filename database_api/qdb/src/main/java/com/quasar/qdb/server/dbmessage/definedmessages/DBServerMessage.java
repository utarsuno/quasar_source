package com.quasar.qdb.server.dbmessage.definedmessages;


import com.quasar.qdb.server.dbserver.DBInterface;

import java.util.Map;

public abstract class DBServerMessage {

    private final int MESSAGE_TYPE;

    protected Map<String,Object> map;

    public DBServerMessage(int message_type, Map<String,Object> map) {
        this.MESSAGE_TYPE = message_type;
        this.map = map;
    }

    public boolean has_response() {
        return false;
    }

    public abstract void perform_db_call(DBInterface db);

    public byte[] get_message_response() {
        return null;
    }
}