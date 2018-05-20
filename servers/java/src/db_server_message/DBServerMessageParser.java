package db_server_message;

import db_server_message.defined_messages.*;
import org.codehaus.jackson.map.ObjectMapper;
import quasar_database_server.QuasarDatabaseServer;

import java.io.IOException;
import java.util.Map;

public class DBServerMessageParser {
    public DBServerMessageParser() {}

    DBServerMessage parse_server_message(String m) throws IOException {
        int message_type;

        ObjectMapper mapper = new ObjectMapper();
        Map<String,Object> map = mapper.readValue(m, Map.class);

        message_type = (int) map.get(QuasarDatabaseServer.DB_SERVER_COMMAND_KEY_COMMAND_TYPE);

        switch (message_type) {
            case QuasarDatabaseServer.DB_SERVER_COMMAND_00_IS_USERNAME_TAKEN:
                return new DBServerMessageIsUsernameTaken(map);
            case QuasarDatabaseServer.DB_SERVER_COMMAND_01_IS_EMAIL_TAKEN:
                return new DBServerMessageIsEmailTaken(map);
            case QuasarDatabaseServer.DB_SERVER_COMMAND_02_IS_VALID_LOGIN:
                return new DBServerMessageIsUsernameTaken(map);
            case QuasarDatabaseServer.DB_SERVER_COMMAND_03_CREATE_ACCOUNT:
                return new DBServerMessageIsUsernameTaken(map);
            default:
                return null;
        }
    }

}
