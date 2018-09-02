# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""



from libraries.universal_code.system_abstraction.system_functions import get_system_environment as get_env
from applications.code_manager.layer_domain.domains.db_domain_nexus_local import DBDomainNexusLocal


print('HELLO WORLD, NEXUS_LOCAL BUILDER!')


db = DBDomainNexusLocal(get_env('CODE_BUILDER_DB_PATH'), get_env('DB_DEBUG'))
db.load()
db.run_needed_build_processes()
