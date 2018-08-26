# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""

from applications.code_builder.layer_applications import nexus_local_builder as nlb


builder = nlb.NexusLocalBuilder()
builder.build()
