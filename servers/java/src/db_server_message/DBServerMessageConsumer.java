package db_server_message;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import db_server_message.defined_messages.*;
import org.codehaus.jackson.map.ObjectMapper;
import quasar_database_server.QuasarDatabaseServer;

import java.io.IOException;
import java.util.Map;

public class DBServerMessageConsumer extends DefaultConsumer {

    private QuasarDatabaseServer quasar_db;

    public DBServerMessageConsumer(Channel c, QuasarDatabaseServer quasar_db) {
        super(c);
        this.quasar_db = quasar_db;
    }

    private DBServerMessage parse_server_message(String m) throws IOException {
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
                return new DBServerMessageIsValidLogin(map);
            case QuasarDatabaseServer.DB_SERVER_COMMAND_03_CREATE_ACCOUNT:
                return new DBServerMessageCreateAccount(map);
            case QuasarDatabaseServer.DB_SERVER_COMMAND_04_DELETE_ACCOUNT:
                return new DBServerMessageDeleteAccount(map);
            default:
                return null;
        }
    }

    @Override
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
        String message = new String(body, "UTF-8");
        //System.out.println(" [x] Received '" + message + "'");

        DBServerMessage server_message = this.parse_server_message(message);
        server_message.perform_db_call(this.quasar_db.get_database_cursor());

        if (server_message.has_response()) {
            this.quasar_db.send_response(server_message);
        }
    }
}