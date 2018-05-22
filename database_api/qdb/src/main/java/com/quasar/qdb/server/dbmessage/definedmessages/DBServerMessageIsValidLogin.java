package com.quasar.qdb.server.dbmessage.definedmessages;


import com.quasar.qdb.server.dbserver.FakeDB;
import com.quasar.qdb.server.dbserver.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageIsValidLogin extends DBServerMessageWithResponse {

    public DBServerMessageIsValidLogin(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_02_IS_VALID_LOGIN, map);
    }

    @Override
    public void perform_db_call(FakeDB db) {
        String username = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_USERNAME);
        String password = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_PASSWORD);
        this.add_response_positive(db.is_login_valid(username, password));
    }
}