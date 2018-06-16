package com.quasar.qdb.server.dbmessage.definedmessages;

import com.quasar.qdb.server.dbserver.DBInterface;
import com.quasar.qdb.server.dbserver.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageIsEmailTaken extends DBServerMessageWithResponse {

    public DBServerMessageIsEmailTaken(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_01_IS_EMAIL_TAKEN, map);
    }

    @Override
    public void perform_db_call(DBInterface db) {
        String email = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_EMAIL);
        this.add_response_positive(db.is_email_taken(email));
    }
}