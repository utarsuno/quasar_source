# coding=utf-8

"""This module, entity_owner.py, holds information relating to an owner's EntityOwner entity."""

ENTITY_PROPERTY_START_TOKEN = 'ep_'

OWNER_KEY_NAME      = ENTITY_PROPERTY_START_TOKEN + 'name'
OWNER_KEY_PASSWORD  = ENTITY_PROPERTY_START_TOKEN + 'password'
OWNER_KEY_EMAIL     = ENTITY_PROPERTY_START_TOKEN + 'email'
OWNER_KEYS_REQUIRED = [OWNER_KEY_PASSWORD, OWNER_KEY_NAME, OWNER_KEY_EMAIL]
OWNER_KEY_ID        = ENTITY_PROPERTY_START_TOKEN + 'id'
