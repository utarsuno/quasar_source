#!/usr/bin/env bash

DIR=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/script_utilities.sh


echo ${DIR}

#SUB_DIR=`echo ${DIR} | cut -f1-6 -d"/"`

#echo ${DIR}
#echo ${SUB_DIR}

#source ${SUB_DIR}/libraries/script_utilities.sh
