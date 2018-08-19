#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"

typedef struct ClientInstance {
    unsigned int client_id;
} ClientInstance;

ClientInstance * get_new_client_instance(const unsigned int client_id);
void free_client_instance(ClientInstance * client);
unsigned int get_client_id_from_websocket(uWS::WebSocket<uWS::SERVER> * ws);