# coding=utf-8

"""This module, nexus_db.py, defines a basic started database for the Nexus Server."""

import pika
import json
import time
from scripts.docker.wait_for_rabbit_host import WaitForRabbitMQHost
from libraries.database_abstraction.sql.sqlite import sqlite_db
from libraries.database_abstraction.sql.sqlite import table_abstraction
from libraries.database_abstraction.sql.query_abstraction import sql_query

######################################################################
db = sqlite_db.SQLiteDB('/v/db.sqlite', False, True)
todo_lists = table_abstraction.TableAbstraction('todo_lists')
todo_lists.add_column_string('table_id', nullable=False, unique=True)
todo_lists.add_column_string('px', nullable=False, unique=False)
todo_lists.add_column_string('py', nullable=False, unique=False)
todo_lists.add_column_string('pz', nullable=False, unique=False)
todo_lists.add_column_string('nx', nullable=False, unique=False)
todo_lists.add_column_string('ny', nullable=False, unique=False)
todo_lists.add_column_string('nz', nullable=False, unique=False)
todo_rows = table_abstraction.TableAbstraction('todo_rows')
todo_rows.add_column_string('table_id', nullable=False, unique=False)
todo_rows.add_column_string('row_id', nullable=False, unique=False)
todo_rows.add_column_string('description', nullable=False, unique=False)
todo_rows.add_column_string('time', nullable=False, unique=False)
todo_rows.add_column_string('difficulty', nullable=False, unique=False)
todo_rows.add_column_string('importance', nullable=False, unique=False)
todo_rows.add_column_string('completed', nullable=False, unique=False)
######################################################################


TEMP = '/Users/utarsuno/git_repos/quasar_source/generated_output/local/personal'


class NexusDatabase(object):
    """API for the Nexus Server's DB."""

    def __init__(self, path: str):
        self._db                   = sqlite_db.SQLiteDB(path, False, True)
        self._schema_users         = self._load_schema_users()
        self._schema_worlds        = self._load_schema_worlds()
        self._schema_entities_root = self._load_schema_entities_root()
        self._schema_entities_data = self._load_schema_entities_data()

    def _load_schema_users(self):
        """Loads the users table schema."""
        users = table_abstraction.TableAbstraction('user')
        users.add_column_row_id_alias()
        users.add_column_string('email', nullable=False, unique=True, indexed=True)
        users.add_column_string('password', nullable=False, unique=False, indexed=False)
        #users.add_column_string('meta_data', nullable=True, unique=False, indexed=False)
        return users

    def _load_schema_worlds(self):
        """Loads the worlds table schema."""
        worlds = table_abstraction.TableAbstraction('world')
        worlds.add_column_row_id_alias()
        #worlds.add_column_string('meta_data', nullable=True, unique=False, indexed=False)
        return worlds

    def _load_schema_entities_root(self):
        """Loads the entities root table schema."""
        entities_root = table_abstraction.TableAbstraction('entity_root')
        entities_root.add_column_row_id_alias()
        entities_root.add_column_foreign_key(self._schema_worlds.primary_key)
        return entities_root

    def _load_schema_entities_data(self):
        """Loads the entities root table schema."""
        entities_data = table_abstraction.TableAbstraction('entity_data')
        entities_data.add_column_row_id_alias()
        return entities_data
