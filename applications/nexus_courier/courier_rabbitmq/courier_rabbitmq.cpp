#include <courier_rabbitmq.h>

/*__        __          __
 |__) |  | |__) |    | /  `
 |    \__/ |__) |___ | \__, */

CourierRabbitMQ::CourierRabbitMQ(std::string connection_address, std::string queue_name) {
    this->connection_address = connection_address;
    this->queue_name         = queue_name;
}

void CourierRabbitMQ::set_reference_websockets(CourierWebsocket * websockets) {
    this->websockets = websockets;
}

std::thread CourierRabbitMQ::start_service() {
    return std::thread( [this] {
        this->run_rabbitmq();
    });
}

void CourierRabbitMQ::forward_message(char * message, size_t length) {
    printf("NEED TO FORWARD MESSAGE {%.*s}\n", length, message);
    this->channel->publish("exchange_nexus_server", "routing_key", message, length);
    printf("FORWARDED MESSAGE!\n");
}


/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___ */

void CourierRabbitMQ::run_rabbitmq() {
    // Access to the boost asio handler. Note: we suggest use of 2 threads - normally one is fin (we are simply demonstrating thread safety).
    boost::asio::io_service service(2);

    // Handler for libev.
    AMQP::LibBoostAsioHandler handler(service);

    // Make a connection.
    AMQP::TcpConnection connection(&handler, AMQP::Address(this->connection_address));

    // We need a channel too.
    AMQP::TcpChannel channel(&connection);

    //
    this->channel = & channel;
    //

    /*
    // create a temporary queue
    channel.declareQueue("queue_nexus_courier", AMQP::autodelete + AMQP::durable).onSuccess([&connection](const std::string &name, uint32_t messagecount, uint32_t consumercount) {

        // report the name of the temporary queue
        std::cout << "declared queue " << name << std::endl;

        // now we can close the connection
        //connection.close();
    });
    */

    channel.consume(this->queue_name, AMQP::noack)
    .onReceived([this](const AMQP::Message &msg, uint64_t tag, bool redelivered) {
            printf("The message is {%.*s}\n", (int) msg.bodySize(), msg.body());
            this->websockets->broadcast_message(msg.body(), msg.bodySize());
        }
    )
    .onError([](const char * message) {
            printf("ERROR OCCURED!! {%s}\n", message);
        }
    );

    // Run the handler. One will need SIGINT to stop. In time, should add signal handling through boost API.
    service.run();
}