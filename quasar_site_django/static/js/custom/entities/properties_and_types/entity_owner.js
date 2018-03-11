'use strict';

// Entity types.
const ENTITY_TYPE_OWNER = 'EntityOwner';

// Entity properties.
const ENTITY_PROPERTY_PASSWORD 			 = ENTITY_PROPERTY_START_TOKEN + 'password';
const ENTITY_PROPERTY_USERNAME 			 = ENTITY_PROPERTY_START_TOKEN + 'username';
const ENTITY_PROPERTY_EMAIL    			 = ENTITY_PROPERTY_START_TOKEN + 'email';
const ENTITY_PROPERTY_PHONE_NUMBER       = ENTITY_PROPERTY_START_TOKEN + 'phone_number';
const ENTITY_PROPERTY_PHONE_CARRIER      = ENTITY_PROPERTY_START_TOKEN + 'phone_carrier';

const ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE = ENTITY_PROPERTY_START_TOKEN + 'account_type';

// Account types.
const ACCOUNT_TYPE_NOT_VERIFIED = 'not_verified';
const ACCOUNT_TYPE_INTERNAL     = 'internal';
const ACCOUNT_TYPE_DEFAULT      = 'default';
const ACCOUNT_TYPE_ADMIN        = 'admin';
const ACCOUNT_TYPE_SUDO         = 'sudo';