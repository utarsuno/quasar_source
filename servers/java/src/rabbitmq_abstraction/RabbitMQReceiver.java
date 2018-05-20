package rabbitmq_abstraction;


import java.io.IOException;
import java.util.concurrent.TimeoutException;

import db_server_message.*;
import quasar_database_server.QuasarDatabaseServer;

public class RabbitMQReceiver extends RabbitMQAbstraction {

    private DBServerMessageConsumer message_consumer;

    public RabbitMQReceiver(String queue_name, String host_name, QuasarDatabaseServer quasar_db) {
        super(queue_name, host_name, quasar_db);
    }

    @Override
    public void connect() throws IOException, TimeoutException {
        super.connect();

        //System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        this.message_consumer = new DBServerMessageConsumer(this.channel, this.quasar_db);
        this.channel.basicConsume(this.name_queue, true, this.message_consumer);
    }

}
