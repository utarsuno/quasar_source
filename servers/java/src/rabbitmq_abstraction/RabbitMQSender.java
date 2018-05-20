package rabbitmq_abstraction;


import db_server_message.defined_messages.DBServerMessage;
import quasar_database_server.QuasarDatabaseServer;

import java.io.IOException;

public class RabbitMQSender extends RabbitMQAbstraction {

    public RabbitMQSender(String queue_name, String host_name, QuasarDatabaseServer quasar_db) {
        super(queue_name, host_name, quasar_db);
    }

    public void send_server_message(DBServerMessage server_message) throws IOException {
        System.out.println("Sent reply!");
        this.channel.basicPublish("", this.name_queue, null, server_message.get_message_response());
    }

}
