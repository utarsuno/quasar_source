# coding=utf-8

"""This module, mongodb_api.py, is a simple interface to using a MongoDB database."""

# Python library for accessing MongoDB.
import pymongo
# Needed for creating HTTP urls with special characters included.
#import urllib.parse as url
# Needed for getting authentication information.
from quasar_source_code.universal_code import path_manager as pm
from quasar_source_code.universal_code import useful_file_operations as ufo

# MongoDB Data Types and Corresponding ID number.
data_types_and_ids = {'Double'                  : 1,
                      'String'                  : 2,
                      'Object'                  : 3,
                      'Array'                   : 4,
                      'Binary data'             : 5,
                      'Object ID'               : 6,
                      'Boolean'                 : 7,
                      'Date'                    : 8,
                      'Null'                    : 9,
                      'Regular expression'      : 10,
                      'JavaScript'              : 11,
                      'Symbol'                  : 12,
                      'Javascript (with scope)' : 13,
                      '32-bit integer'          : 14,
                      'Timestamp'               : 15,
                      '64-bit integer'          : 16,
                      'Min key'                 : 255,
                      'Max key'                 : 127}

# https://docs.mongodb.com/manual/reference/default-mongodb-port/
# 27017 - Default Port for mongod and mongos instances. You can change this port with port or --port.
# 27018 - Default port when running with --shardsvr value for the clusterRole setting in a configuration file.
# 27019 - The default port when running --configsvr tunetime operation of the configscr value for the clusterRole setting in a configuration file.
# 28017 - The default port for the web status page. The web status page is always accessible at a port number that is 1000 greater than the port determined by port.
#         MongoDB comes with a built-in HTTP interface that provides you with information about the MongoDB server. (That's the 28017 port).


# Owner dictionary key mappings.
OWNER_KEY_NAME      = 'name'
OWNER_KEY_PASSWORD  = 'password'
OWNER_KEY_EMAIL     = 'email'
OWNER_KEYS_REQUIRED = [OWNER_KEY_PASSWORD, OWNER_KEY_NAME, OWNER_KEY_EMAIL]
OWNER_KEY_ID        = '_id'


class MongoCollection(object):
    """API for using MongoDB Collections."""

    def __init__(self, collection_object):
        self._collection = collection_object

    def get_all(self):
        """Returns all the entities(items) in this collection."""
        entities = []
        c = self._collection.find()
        for e in c:
            entities.append(e)
        return entities

    def insert(self, data):
        """Inserts the data into the collection."""
        self._collection.insert(data)

    def update(self, data):
        """Updates an entry in the collection."""
        data_to_set = {}
        for key in data:
            if key != OWNER_KEY_ID:
                data_to_set[key] = data[key]
        self._collection.update_one({OWNER_KEY_ID: data[OWNER_KEY_ID]}, {'$set': data_to_set}, upsert=False)

    def get_id_by_key_value_match(self, key, value):
        """Gets the _id of an element by finding a key value match."""
        c = self._collection.find()
        for e in c:
            if key in e:
                if e[key] == value:
                    return e[OWNER_KEY_ID]
        return None

    def get_largest_integer_key(self) -> int:
        """Returns the largest integer key found or -1 if none found."""
        c = self._collection.find()
        largest_key = -1
        for e in c:
            for key in e:
                if str(key).isdigit():
                    key_value = int(str(key))
                    if key_value > largest_key:
                        largest_key = key_value
        return largest_key


class MongoDBAPI(object):
    """API for using MongoDB."""

    def __init__(self):
        self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='mongodb_nexus')
        self._database_connection = pymongo.MongoClient()
        self._quasar_database     = self._database_connection['quasar']
        self._connected           = False

    def get_collection(self, collection_name) -> MongoCollection:
        """Returns a MongoCollection object for the given collection name."""
        return MongoCollection(self._quasar_database[collection_name])

    def print_database_names(self) -> None:
        """Utility function to print the names of the databases."""
        n = self._database_connection.database_names()
        print(n)

    def connect(self) -> None:
        """Connects to the database."""

        # TODO : Delete, once external connection is confirmed as no longer needed.
        #connection_uri = url.quote('mongodb://' + self._database_parameters['user'] + ':' + self._database_parameters['password'] + '@' + self._database_parameters['host'] + ':' + self._database_parameters['port'] + '/' + self._database_parameters['database'])

        # Connecting locally.
        self._database_connection = pymongo.MongoClient()
        # Database object for the 'quasar' database.
        self._quasar_database = self._database_connection['quasar']

        # Connection only gets made after a server action.
        # TODO : perform the isadmin command
        #self._connected = True

    def terminate(self) -> None:
        """Terminates the connection to the database."""
        self._database_connection.close()

    def clear_database(self, database_name):
        """Completly clears the database."""
        self._database_connection.drop_database(database_name)
