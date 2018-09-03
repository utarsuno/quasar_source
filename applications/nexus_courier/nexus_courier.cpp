// Custom
#include "nexus_courier.h"


CourierRabbitMQ  * rabbitmq;
CourierWebsocket * websockets;

int main() {

    rabbitmq   = new CourierRabbitMQ("amqp://guest:guest@rabbit_manager/", "queue_nexus_courier");
    websockets = new CourierWebsocket(3001);

    websockets->set_reference_rabbitmq(rabbitmq);
    rabbitmq->set_reference_websockets(websockets);

    printf("START THREAD!\n");

    std::thread t0 = rabbitmq->start_service();
    std::thread t1 = websockets->start_service();

    printf("JOIN THREADS!\n");
    t0.join();
    t1.join();

    printf("FINISH threads!\n");

    delete rabbitmq;
    delete websockets;

    return 66;
}

