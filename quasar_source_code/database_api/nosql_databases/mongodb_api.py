# coding=utf-8

"""This module, mongodb_api.py, is a simple interface to using a MongoDB database."""

# Python library for accessing MongoDB.
import pymongo
# Needed for creating HTTP urls with special characters included.
import urllib.parse as url
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

# MongoDB comes with a built-in HTTP interface that provides you with information about the MongoDB server. (That's the 28017 port).



class MongoDBAPI(object):
    """API for using MongoDB."""

    def __init__(self):
        self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='mongodb_nexus')
        self._database_connection = None
        self._connected = False

    def print_database_names(self) -> None:
        """Utility function to print the names of the databases."""
        n = self._database_connection.database_names()
        print(n)

    def test(self) -> None:
        """Temp"""
        #post = {"author": "Mike"}
        book = {}
        book['title'] = 'any_book'
        book['author'] = 'any_author'
        #self._database_connection['owners'].insert_one(post)
        print(self._database_connection['admin'])
        collection = self._database_connection['owners']
        #print(collection.collection_names())
        owners = collection['owners']
        print(owners)
        owners.insert(book)
        #self._database_connection['quasar_database'].create_collection('owners')

    def connect(self) -> None:
        """Connects to the database."""

        # TODO : Delete, once external connection is confirmed as no longer needed.
        #connection_uri = url.quote('mongodb://' + self._database_parameters['user'] + ':' + self._database_parameters['password'] + '@' + self._database_parameters['host'] + ':' + self._database_parameters['port'] + '/' + self._database_parameters['database'])

        # Connecting locally.
        self._database_connection = pymongo.MongoClient()

        #print(self._database_connection.admin)
        print(self._database_connection.admin.command('ismaster'))

        #client.admin.command('ismaster')
        self._connected = True

    def terminate(self) -> None:
        """Terminates the connection to the database."""
        self._database_connection.close()
        #self.server.stop()

test = MongoDBAPI()
test.connect()
#test.print_database_names()
#test.test()
test.terminate()

