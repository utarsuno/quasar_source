class NexusServer {
private:
    unsigned long max_client_id;
public:
       void nexus_server_on_connection(uWS::WebSocket<uWS::SERVER> *ws);

}