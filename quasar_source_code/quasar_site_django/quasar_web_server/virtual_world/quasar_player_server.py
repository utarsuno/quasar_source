# coding=utf-8

"""This module, quasar_world_server.py, defines the class and operations for running the QuasarWorldServer."""

from channels import Group
from channels.sessions import channel_session


WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS                 = '|A|'
WEB_SOCKET_MESSAGE_TYPE_CONNECTION                  = '|C|'
WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED                = '|D|'
WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|'
WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|'

SERVER_USER_ID = 'server'


def send_message_to_all_users_in_group(message, group_name):
    """Sends a message to all users in the specified group."""
    Group(group_name).send({'text': message})


def send_chat_message_to_all_logged_in_users(chat_message):
    """Sends a global server message to everyone currently logged in."""
    Group('users').send({'text': SERVER_USER_ID + WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE + chat_message})


class QuasarPlayer(object):
    """Represents a single logged in user."""

    def __init__(self, reply_channel_key):
        self._reply_channel_key = reply_channel_key
        self._player_name       = None
        self._last_position     = None
        self._last_look_at      = None

    def set_last_position(self, position):
        """Sets the last known position of this player."""
        self._last_position = position

    def set_last_look_at(self, look_at):
        """Sets the last known look at of this player."""
        self._last_look_at = look_at

    @property
    def web_socket_key(self):
        """Returns the unique web socket key that this player currently has."""
        return self._reply_channel_key

    @property
    def player_name(self):
        """Returns the name of the player."""
        return self._player_name

    @player_name.setter
    def player_name(self, val):
        """Sets the player name for this object."""
        self._player_name = val

    def get_name_and_last_position(self):
        """Returns the name and last position of this player."""
        if str(self._last_position) == 'None':
            self._last_position = '0,0,0'
        if str(self._last_look_at) == 'None':
            self._last_look_at = '0,0,0'
        return self._player_name + '!' + str(self._last_position) + '!' + str(self._last_look_at)


class QuasarPlayerServer(object):
    """Handles the multi-player logic."""

    # TODO : Need to add a tick rate for sending out messages.
    # Currently every time a user sends a message all other users will get notifications as well, immediately.
    # Adding a tick rate will better ensure smooth performance as number of con-current users grow.

    def __init__(self):
        self._clients = []

    def get_all_players_data(self):
        """Returns the names and last position of all currently logged in players."""
        all_data = ''
        for p in self._clients:
            all_data += p.get_name_and_last_position() + '@'
        return all_data

    def get_specific_player(self, player_name):
        """Gets the specific player object."""
        for p in self._clients:
            if p.player_name == player_name:
                return p
        print('ERROR, specific player not found!!!!')
        return None

    def parse_message(self, user, command, data, reply_channel_key):
        """Parses the message passed in and performs the needed operations."""
        for p in self._clients:
            print(str(p.player_name) + '\t' + str(user) + '\t' + str(p.player_name == user))

        if command == WEB_SOCKET_MESSAGE_TYPE_CONNECTION:
            self.player_logged_in(reply_channel_key, data)
            reply_channel_key.send({'text': SERVER_USER_ID + WEB_SOCKET_MESSAGE_TYPE_ALL_PLAYERS + self.get_all_players_data()})
        elif command == WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE:
            player = self.get_specific_player(user)
            if player is not None:
                player.set_last_position(data)
            send_message_to_all_users_in_group(user + command + data, 'users')
        elif command == WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE:
            player = self.get_specific_player(user)
            if player is not None:
                player.set_last_look_at(data)
            send_message_to_all_users_in_group(user + command + data, 'users')
        elif command == WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE:
            player = self.get_specific_player(user)
            if player is not None:
                split_data = data.split('!')
                position = split_data[0]
                look_at  = split_data[1]
                player.set_last_position(position)
                player.set_last_look_at(look_at)
            send_message_to_all_users_in_group(user + command + data, 'users')
        else:
            Group('users').send({
                'text': str(user) + str(command) + str(data),
            })

    def add_web_socket_connection(self, reply_channel_key):
        """Adds an initial web socket connection."""
        self._clients.append(QuasarPlayer(reply_channel_key))

    def player_logged_in(self, reply_channel_key, player_name):
        """This message gets sent after the web socket connection."""
        player_match_found = False

        for c in self._clients:
            if str(c.web_socket_key) == str(reply_channel_key):
                print(player_name + ' is now logged in!')
                c.player_name = player_name
                #send_message_to_all_users_in_group()
                send_chat_message_to_all_logged_in_users(player_name + ' has logged in!')
                player_match_found = True

        if not player_match_found:
            print('Did not find a player match for : ' + player_name + ' - ' + str(reply_channel_key))
            for c in self._clients:
                print(c.web_socket_key)

    def remove_web_socket_connection(self, reply_channel_key):
        """Removes a web socket connection."""
        object_to_remove = None
        for c in self._clients:
            if str(c.web_socket_key) == str(reply_channel_key):
                object_to_remove = c
        if object_to_remove is not None:
            send_message_to_all_users_in_group(object_to_remove.player_name + WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED + 'no_data', 'users')
            self._clients.remove(object_to_remove)
        else:
            print('Did not find a player match for : ' + reply_channel_key)
            for c in self._clients:
                print(c.web_socket_key)
