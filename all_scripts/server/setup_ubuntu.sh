#!/usr/bin/env bash

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

#------------------------------------------------------------------------

# Install SSH.
sudo apt-get install openssh-server;

#------------------------------------------------------------------------

# Install git.
sudo apt-get install git;

#------------------------------------------------------------------------

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib