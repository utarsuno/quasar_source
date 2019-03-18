#!/usr/bin/env bash

sudo apt update
sudo apt dist-upgrade

sudo apt-get autoremove

sudo apt install update-manager-core

# Restart server before next commands.

sudo do-release-upgrade

