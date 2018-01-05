


from servers.quasar import quasar_server as qs
from entities import base_entity as be


quasar_server = qs.QuasarServer()
quasar_server.connect()

owner_data = {be.ENTITY_PROPERTY_USERNAME: 'aaaa',
              be.ENTITY_PROPERTY_EMAIL   : 'bbbb@bbbb.com',
              be.ENTITY_PROPERTY_PASSWORD: 'cccc'}


SERVER_COMMAND_REQUEST_ALL_DATA = 'a'


result = quasar_server.create_entity_owner(owner_data)
print(result)

#result = quasar_server.get_all_data()
#print(result)
