#!/usr/bin/env bash

# NOTE : This file isn't actually meant to be run (yet), it's currently just a form of documentation.

#------------------------------------------------------------------------

# Downloads indexes of latest available packages specified in /etc/apt/sources.list
sudo apt-get update;

# Installs latest packages, installed packages are not removed, install conflicts avoided.
#sudo apt-get -y upgrade;

# Same as above but intelligently handles changing conflict resolution system and will attempt to keep most important packages.
#sudo apt-get -y dist-upgrade;

# Same as above but can also remove installed packages if needed for install during a package conflict.
sudo apt-get -y full-upgrade;

#------------------------------------------------------------------------

# Install Python3
sudo apt-get install -y python3-pip;
sudo apt-get install build-essential libssl-dev libffi-dev python3-dev;

# Install Django
sudo pip3 install django;

# Needed for Django : install Channels.
sudo pip3 install channels;

# Needed to access the PostgreSQL database with Python.
sudo -H pip3 install psyopg2;

# Install Dill, used for Python object serialization.
sudo -H pip3 install dill;

# TODO : document, install asgi_redis.
sudo -H pip3 install asgi_redis;

#------------------------------------------------------------------------

# Install SSH.
sudo apt-get install openssh-server;

#------------------------------------------------------------------------

# Install git.
sudo apt-get install git;

#------------------------------------------------------------------------

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

##

# sudo pip install dill

#----
# Needed for Django websockets
sudo pip3 install -U 'Twisted[tls,http2]'

# other django needs
sudo pip3 install lazyme

#---


##
sudo apt install npm
sudo npm install -g bower




# Redis server?
# sudo apt-get install redis-server
# sudo service redis-server