package db_server_message.defined_messages;

import quasar_database_server.FakeDB;
import quasar_database_server.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageIsEmailTaken extends DBServerMessageWithResponse {

    public DBServerMessageIsEmailTaken(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_01_IS_EMAIL_TAKEN, map);
    }

    @Override
    public void perform_db_call(FakeDB db) {
        String email = (String) this.map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_EMAIL);
        this.add_response_positive(db.is_email_taken(email));
    }
}