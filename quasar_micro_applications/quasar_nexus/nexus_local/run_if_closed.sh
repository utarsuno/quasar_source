#!/usr/bin/env bash

cd source_code/quasar_micro_applications/quasar_nexus/nexus_local;

# TODO : Check if manage.py is already running!

python manage.py runserver 0.0.0.0:1337;
