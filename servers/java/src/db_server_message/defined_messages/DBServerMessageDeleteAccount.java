package db_server_message.defined_messages;

import quasar_database_server.FakeDB;
import quasar_database_server.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageDeleteAccount extends DBServerMessage {

    public DBServerMessageDeleteAccount(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_04_DELETE_ACCOUNT, map);
    }

    @Override
    public void perform_db_call(FakeDB db) {
        String username = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_USERNAME);
        db.delete_account(username);
    }
}