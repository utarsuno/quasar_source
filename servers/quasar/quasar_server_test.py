


from servers.quasar import quasar_server as qs
from entities import base_entity as be


quasar_server = qs.QuasarServer()
quasar_server.connect()

owner_data = {be.ENTITY_PROPERTY_USERNAME: 'aaaa',
              be.ENTITY_PROPERTY_EMAIL   : 'bbbb@bbbb.com',
              be.ENTITY_PROPERTY_PASSWORD: 'cccc'}


result = quasar_server.create_entity_owner(owner_data)
print(result)

#result = quasar_server.get_all_data()
#print(result)

print('Is username{aaaa} taken?')
print(quasar_server.is_username_taken('aaaa'))
print('Is username{bbbb} taken?')
print(quasar_server.is_username_taken('bbbb'))
