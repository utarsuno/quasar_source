package com.quasar.qdb.server.dbserver;

import com.quasar.qdb.server.db.MongoDb;
import com.quasar.qdb.server.dbmessage.definedmessages.DBServerMessage;
import com.quasar.qdb.server.rabbitmq.RabbitMQReceiver;
import com.quasar.qdb.server.rabbitmq.RabbitMQSender;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class QuasarDatabaseServer {

    // TODO : Sync globals with code_api.

    public static final String DB_SERVER_COMMAND_KEY_COMMAND_TYPE      = "cmd";
    public static final String DB_SERVER_COMMAND_KEY_MESSAGE_ID        = "mid";
    public static final String DB_SERVER_COMMAND_KEY_USERNAME          = "u";
    public static final String DB_SERVER_COMMAND_KEY_EMAIL             = "e";
    public static final String DB_SERVER_COMMAND_KEY_PASSWORD          = "p";
    public static final String DB_SERVER_COMMAND_KEY_RESPONSE_POSITIVE = "rp";

    public static final int DB_SERVER_COMMAND_00_IS_USERNAME_TAKEN = 0;
    public static final int DB_SERVER_COMMAND_01_IS_EMAIL_TAKEN    = 1;
    public static final int DB_SERVER_COMMAND_02_IS_VALID_LOGIN    = 2;
    public static final int DB_SERVER_COMMAND_03_CREATE_ACCOUNT    = 3;
    public static final int DB_SERVER_COMMAND_04_DELETE_ACCOUNT    = 4;

    private final static String NAME_QUEUE_DB_RECEIVE  = "entity_db_receive";
    private final static String NAME_QUEUE_DB_RESPONSE = "entity_db_response";
    private final static String NAME_HOST              = "localhost";

    // TODO : Test if server can run Hello World.
    // TODO : Make sure .gitignore has Java's output files.

    private DBInterface db;
    private RabbitMQReceiver receiver;
    private RabbitMQSender sender;

    public QuasarDatabaseServer() throws IOException {
        this.db       = new MongoDb();
        this.receiver = new RabbitMQReceiver(NAME_QUEUE_DB_RECEIVE, NAME_HOST, this);
        this.sender   = new RabbitMQSender(NAME_QUEUE_DB_RESPONSE, NAME_HOST, this);
        try {
            this.receiver.connect();
            this.sender.connect();
        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public void terminate() {
        try {
            this.receiver.terminate();
            this.sender.terminate();
        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public void send_response(DBServerMessage server_message) throws IOException {
        this.sender.send_server_message(server_message);
    }

    public DBInterface get_database_cursor() {
        return this.db;
    }

}