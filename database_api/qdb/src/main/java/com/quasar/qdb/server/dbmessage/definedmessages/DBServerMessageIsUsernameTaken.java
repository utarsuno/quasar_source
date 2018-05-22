package com.quasar.qdb.server.dbmessage.definedmessages;

import com.quasar.qdb.server.dbserver.FakeDB;
import com.quasar.qdb.server.dbserver.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageIsUsernameTaken extends DBServerMessageWithResponse {

    public DBServerMessageIsUsernameTaken(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_00_IS_USERNAME_TAKEN, map);
    }

    @Override
    public void perform_db_call(FakeDB db) {
        String username = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_USERNAME);
        this.add_response_positive(db.is_username_taken(username));
    }
}