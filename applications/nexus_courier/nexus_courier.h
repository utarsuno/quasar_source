#ifndef NEXUS_COURIER
#define NEXUS_COURIER

// C++
#include <thread>
#include <stdio.h>
#include <stdlib.h> // Needed for atoi.
#include <cstdlib>  // Needed for getenv
//#include <sstream>
#include <string>
#include <string.h>
#include <iostream>
#include <chrono>
#include <cstdint>
// RabbitMQ
#include <amqpcpp.h>
#include <boost/asio/io_service.hpp>
#include <boost/asio/strand.hpp>
#include <boost/asio/deadline_timer.hpp>
#include <amqpcpp/libboostasio.h>
// Websockets
#include "/quasar_source/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"

// Global.
#define EXIT_CODE_SUCCESS                13
#define EXIT_CODE_FAILED                 199
#define EXIT_CODE_PORT_ERROR             198
#define EXIT_CODE_INVALID_MESSAGE_HEADER 197
#define EXIT_CODE_REALLOC_FAILED         196
//
#define WS_ID_INVALID 1337
//
#define NETWORK_MESSAGE_HEADER_SIZE                   8
#define MEMORY_DEFAULT_ALLOCATION_SIZE_MESSAGE_BUFFER 32
//
// Current message sizes.
// message_type --> 2 bytes
// message_id   --> 2 bytes
// session_id   --> 2 bytes
// user_id      --> 2 bytes
// data_header  --> 2 bytes
// data         --> n bytes
//

// Server to client.
#define WS_TYPE_ESTABLISH_SESSION 2
#define WS_TYPE_SERVER_MESSAGE    4
// Client to server.
#define WS_TYPE_GLOBAL_CHAT       1
#define WS_TYPE_GET_NUM_SESSIONS  3
// Keys.
#define WS_DATA_KEY_INT           0
#define WS_DATA_KEY_TEXT          1

class MemoryPoolObject {
public:
    // OOP
    MemoryPoolObject() {
        this->alive     = false;
        this->completed = false;
    }

    // Events.
    virtual void on_born() = 0;
    virtual void on_killed() = 0;
    virtual void on_completion() = 0;

    // Functionality
    void set_to_alive() {
        this->alive     = true;
        this->completed = false;
        this->on_born();
    }

    // TODO: Change naming to kill
    void kill() {
        this->alive     = false;
        this->completed = false;
        this->on_killed();
    }

    void complete() {
        this->completed = true;
        this->on_completion();
        this->kill();
    }

    // Getters
    bool is_alive() {
        return this->alive;
    }

    bool is_completed() {
        return this->completed;
    }
private:
    bool alive;
    bool completed;
};
//

//
class MemoryPool {
public:
    // OOP
    MemoryPool() {
        this->number_alive = 0;
        this->pool_size    = 0;
    }

    ~MemoryPool() {
        this->pool_delete();
    }

    // Functionality
    void * get_pool_entity() {
        // Check if any entity is alive.
        if (this->pool.size() > this->number_alive) {
            int pool_size = this->pool.size();
            for (int e = 0; e < pool_size; e++) {
                if (!this->pool[e]->is_alive()) {
                    this->pool[e]->set_to_alive();
                    this->number_alive++;
                    return this->pool[e];
                }
            }
        }

        // If this point is reached, then allocate memory for a new entity.
        MemoryPoolObject * entity = (MemoryPoolObject *) this->get_and_create_new_entity_object();
        entity->set_to_alive();
        this->number_alive++;
        this->pool_size++;
        this->pool.push_back(entity);
        return entity;
    }

    void pool_clear_entity(void * entity) {
        this->number_alive--;
        ((MemoryPoolObject *) entity)->kill();
    }

    void pool_complete_entity(void * entity) {
        this->number_alive--;
        ((MemoryPoolObject *) entity)->complete();
    }

    void pool_clear_all() {
        this->number_alive = 0;
        if (this->pool_size > 0) {
            for (int e = 0; e < this->pool_size; e++) {
                if (this->pool[e]->is_alive()) {
                    this->pool[e]->kill();
                }
            }
        }
    }

    void pool_delete() {
        this->pool_clear_all();
        this->pool_size = 0;
        // Clear will take the following two steps:
        // 1) Call de-constructor for each entity.
        // 2) Set vector length to 0.
        this->pool.clear();
        // Just a suggestion to help run-time memory.
        this->pool.shrink_to_fit();
    }

    // Getters
    virtual void * get_and_create_new_entity_object() = 0;

    unsigned int get_pool_size_active() {
        return this->number_alive;
    }

    unsigned int get_pool_size() {
        //return (unsigned int) this->pool.size();
        return this->pool_size;
    }

    std::vector<MemoryPoolObject *> pool;
private:
    unsigned int number_alive;
    unsigned int pool_size;

};

// Custom

//
#include "message_instance.h"
#include "session_instance.h"
#include "user_instance.h"
#include "courier_rabbitmq.h"
#include "courier_websocket.h"


class NexusCourier {
public:
    //NexusCourier(const bool debug_on);
    NexusCourier(const bool debug_on, const unsigned int websocket_port, const char * rabbitmq_host, const char * rabbitmq_queue);
    ~NexusCourier();
    void run_all_threads();
private:
    bool               debug_on;
    CourierRabbitMQ  * rabbitmq;
    CourierWebsocket * websockets;
    std::thread        thread_rabbitmq;
    std::thread        thread_websockets;
};

#endif
