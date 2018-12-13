// Custom
#include "nexus_courier.h"

NexusCourier::NexusCourier(const bool debug_on) {
    this->debug_on   = debug_on;
    this->rabbitmq   = new CourierRabbitMQ("amqp://guest:guest@rabbit_manager/", "queue_nexus_courier", debug_on);
    this->websockets = new CourierWebsocket(3001, debug_on);

    this->websockets->set_reference_rabbitmq(this->rabbitmq);
    this->rabbitmq->set_reference_websockets(this->websockets);

    printf("Nexus Courier created!\n");
}

NexusCourier::~NexusCourier() {
    delete this->rabbitmq;
    delete this->websockets;
}

void NexusCourier::start() {
    printf("Creating NexusCourier!\n");
    this->thread_rabbitmq   = this->rabbitmq->start_service();
    this->thread_websockets = this->websockets->start_service();
}

void NexusCourier::wait_for_completion() {
    printf("Starting NexusCourier!\n");
    this->thread_rabbitmq.join();
    this->thread_websockets.join();
    printf("Terminating NexusCourier!\n");
}

int main(int argc, char * argv[]) {
    printf("TODO: Parse arguments for debug mode.\n");

    NexusCourier * nexus_courier = new NexusCourier(true);
    nexus_courier->start();
    nexus_courier->wait_for_completion();
    delete nexus_courier;
    return 66;
}



