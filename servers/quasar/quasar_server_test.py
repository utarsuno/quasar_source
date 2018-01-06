


from servers.quasar import quasar_server as qs
from entities import base_entity as be
from universal_code import system_os as so

quasar_server = qs.QuasarServer()
quasar_server.connect()


args = so.get_all_program_arguments()
name = 'GET_NAME'
if len(args) > 0:
    name = args[1]


owner_data = {be.ENTITY_PROPERTY_USERNAME: name,
              be.ENTITY_PROPERTY_EMAIL   : 'bbbb@bbbb.com',
              be.ENTITY_PROPERTY_PASSWORD: 'pppp'}


#result = quasar_server.create_entity_owner(owner_data)
#print(result)

print('Printing all data!')
result = quasar_server.get_all_data()

print('Is username{aaaa} taken?')
print(quasar_server.is_username_taken('aaaa'))
print('Is username{bbbb} taken?')
print(quasar_server.is_username_taken('bbbb'))
