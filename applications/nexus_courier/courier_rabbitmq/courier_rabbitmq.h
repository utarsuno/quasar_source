#ifndef COURIER_RABBITMQ
#define COURIER_RABBITMQ

#include "nexus_courier.h"

// Forward declaration.
class CourierWebsocket;


class CourierRabbitMQ {
    public:
        CourierRabbitMQ(std::string connection_address, std::string queue_name);
        std::thread start_service();
        void set_reference_websockets(CourierWebsocket * websockets);

        void forward_message(char * message, size_t length);
    private:
        CourierWebsocket * websockets;
        std::string        connection_address;
        std::string        queue_name;
        AMQP::TcpChannel * channel;
        void run_rabbitmq();
};

#endif
