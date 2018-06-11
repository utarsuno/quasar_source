package rabbitmq_abstraction;

import com.rabbitmq.client.*;
import quasar_database_server.QuasarDatabaseServer;

import java.io.IOException;
import java.util.concurrent.TimeoutException;


class RabbitMQAbstraction {

    protected String name_queue;
    protected String name_host;

    protected Connection connection;
    protected Channel    channel;

    protected QuasarDatabaseServer quasar_db;

    public RabbitMQAbstraction(String queue_name, String host_name, QuasarDatabaseServer quasar_db) {
        this.name_queue = queue_name;
        this.name_host  = host_name;
        this.quasar_db  = quasar_db;
    }

    public void connect() throws IOException, TimeoutException {
        ConnectionFactory connectionFactory = new ConnectionFactory();
        connectionFactory.setHost(this.name_host);
        this.connection        = connectionFactory.newConnection();
        this.channel           = this.connection.createChannel();

        this.channel.queueDeclare(this.name_queue, false, false, false, null);
    }

    public void terminate() throws IOException, TimeoutException {
        this.channel.close();
        this.connection.close();
    }
}
