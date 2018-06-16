package com.quasar.qdb.server.dbmessage.definedmessages;

import com.quasar.qdb.server.dbserver.DBInterface;
import com.quasar.qdb.server.dbserver.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageDeleteAccount extends DBServerMessage {

    public DBServerMessageDeleteAccount(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_04_DELETE_ACCOUNT, map);
    }

    @Override
    public void perform_db_call(DBInterface db) {
        String username = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_USERNAME);
        db.delete_account(username);
    }
}