package db_server_message;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import db_server_message.defined_messages.*;
import quasar_database_server.QuasarDatabaseServer;

import java.io.IOException;

public class DBServerMessageConsumer extends DefaultConsumer {

    private DBServerMessageParser message_parser;
    private QuasarDatabaseServer quasar_db;

    public DBServerMessageConsumer(Channel c, QuasarDatabaseServer quasar_db) {
        super(c);
        this.message_parser = new DBServerMessageParser();
        this.quasar_db = quasar_db;
    }

    @Override
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
        String message = new String(body, "UTF-8");
        System.out.println(" [x] Received '" + message + "'");

        DBServerMessage server_message = this.message_parser.parse_server_message(message);
        server_message.perform_db_call(this.quasar_db.get_database_cursor());

        if (server_message.has_response()) {
            this.quasar_db.send_response(server_message);
        }
    }
}