package com.quasar.qdb.server.dbmessage.definedmessages;

import com.quasar.qdb.server.dbserver.DBInterface;
import com.quasar.qdb.server.dbserver.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageCreateAccount extends DBServerMessage {

    public DBServerMessageCreateAccount(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_03_CREATE_ACCOUNT, map);
    }

    @Override
    public void perform_db_call(DBInterface db) {
        String email = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_EMAIL);
        String username = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_USERNAME);
        String password = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_PASSWORD);
        db.create_account(username, email, password);
    }
}