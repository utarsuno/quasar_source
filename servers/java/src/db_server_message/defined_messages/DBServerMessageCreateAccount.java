package db_server_message.defined_messages;

import quasar_database_server.FakeDB;
import quasar_database_server.QuasarDatabaseServer;

import java.util.Map;

public class DBServerMessageCreateAccount extends DBServerMessage {

    public DBServerMessageCreateAccount(Map<String,Object> map) {
        super(QuasarDatabaseServer.DB_SERVER_COMMAND_03_CREATE_ACCOUNT, map);
    }

    @Override
    public void perform_db_call(FakeDB db) {
        // TODO : This call later
        //boolean result = db.is_username_taken("TODO!!!:!:!:!:!:!:!FEOJFOAJSFRV(JQ@#(RVJQ#(RJ");
    }
}