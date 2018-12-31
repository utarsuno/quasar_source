// Custom
#include "nexus_courier.h"

#define NC_ARG_RABBIT_HOST    "NC_ARG_RABBIT_HOST"
#define NC_ARG_RABBIT_QUEUE   "NC_ARG_RABBIT_QUEUE"
#define NC_ARG_DEBUG_ON       "NC_ARG_DEBUG_ON"
#define NC_ARG_WEBSOCKET_PORT "NC_ARG_WEBSOCKET_PORT"

void NexusCourier::run_all_threads() {
    printf("Starting NexusCourier!\n");
    this->thread_rabbitmq   = this->rabbitmq->start_service();
    this->thread_websockets = this->websockets->start_service();
    this->thread_rabbitmq.join();
    this->thread_websockets.join();
    printf("Terminating NexusCourier!\n");
}

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |    */

NexusCourier::NexusCourier(const bool debug_on, const unsigned int websocket_port, const char * rabbitmq_host, const char * rabbitmq_queue) {
    this->debug_on   = debug_on;
    this->rabbitmq   = new CourierRabbitMQ(rabbitmq_host, rabbitmq_queue, debug_on);
    this->websockets = new CourierWebsocket(websocket_port, debug_on);

    this->websockets->set_reference_rabbitmq(this->rabbitmq);
    this->rabbitmq->set_reference_websockets(this->websockets);
}

NexusCourier::~NexusCourier() {
    delete this->rabbitmq;
    delete this->websockets;
}

/*__   __   __   __   __                 ___      ___  __
 |__) |__) /  \ / _` |__)  /\   |\/|    |__  |\ |  |  |__) \ /
 |    |  \ \__/ \__> |  \ /~~\  |  |    |___ | \|  |  |  \  | */
void fail_if_argument_not_set(const std::string arg) {
    if (std::getenv(arg.c_str()) == NULL) {
        fprintf(stderr, "Environment variable not set {%s}\n", arg.c_str());
        exit(EXIT_CODE_FAILED);
    }
}

int main(int argc, char * argv[]) {
    if (argc > 1) {
        fprintf(stderr, "Arguments should not be passed into Nexus Courier!\n");
        return EXIT_CODE_FAILED;
    } else {
        fail_if_argument_not_set(NC_ARG_WEBSOCKET_PORT);
        fail_if_argument_not_set(NC_ARG_DEBUG_ON);
        fail_if_argument_not_set(NC_ARG_RABBIT_QUEUE);
        fail_if_argument_not_set(NC_ARG_RABBIT_HOST);

        const unsigned int websocket_port = (unsigned int) atoi(std::getenv(NC_ARG_WEBSOCKET_PORT));
        const bool         debug_on       = (strcmp(std::getenv(NC_ARG_DEBUG_ON), "true")) == 0;

        //printf("The websocket to use is {%d}\n", websocket_port);
        //printf("Debug is on {%d}\n", (int) debug_on);
        //printf("THE HOST IS {%s}\n", std::getenv("NC_ARG_RABBIT_HOST"));
        //printf("THE QUEUE IS {%s}\n", std::getenv("NC_ARG_RABBIT_QUEUE"));

        NexusCourier * nexus_courier = new NexusCourier(debug_on, websocket_port, std::getenv(NC_ARG_RABBIT_HOST), std::getenv(NC_ARG_RABBIT_QUEUE));
        nexus_courier->run_all_threads();
        delete nexus_courier;
        return EXIT_CODE_SUCCESS;
    }
}
