package com.quasar.qdb.server.rabbitmq;


import com.quasar.qdb.server.dbmessage.DBServerMessageConsumer;
import com.quasar.qdb.server.dbserver.QuasarDatabaseServer;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

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
