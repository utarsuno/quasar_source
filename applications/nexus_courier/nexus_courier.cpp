// Custom
#include "nexus_courier.h"

NexusCourier::NexusCourier() {
    this->rabbitmq   = new CourierRabbitMQ("amqp://guest:guest@rabbit_manager/", "queue_nexus_courier");
    this->websockets = new CourierWebsocket(3001);

    this->websockets->set_reference_rabbitmq(this->rabbitmq);
    this->rabbitmq->set_reference_websockets(this->websockets);

    printf("Nexus Courier created!\n");
}

void NexusCourier::start() {
    printf("START THREAD!\n");
    this->thread_rabbitmq   = this->rabbitmq->start_service();
    this->thread_websockets = this->websockets->start_service();
}

void NexusCourier::wait_for_completion() {
    printf("JOIN THREADS!\n");
    this->thread_rabbitmq.join();
    this->thread_websockets.join();
    printf("FINISH threads!\n");
    delete this->rabbitmq;
    delete this->websockets;
}

int main() {
    NexusCourier * nexus_courier = new NexusCourier();
    nexus_courier->start();
    nexus_courier->wait_for_completion();
    return 66;
}



