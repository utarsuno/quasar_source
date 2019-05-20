# coding=utf-8

"""This file, project.py, represents a collection of Docker containers that make up a code project."""

from libraries.python.common_traits.trait_name   import TraitName
from libraries.python.docker.container           import Container
from libraries.python.universal_utilities.system import system_utilities as SYS
from libraries.python.universal_utilities.files  import path_utilities   as PATH
from libraries.python.universal_utilities.system import colored_output   as L
import os
import subprocess


class Project(TraitName):
    '''Represents a single project (a collection of Docker containers).'''

    def __init__(self, name: str, config: dict, docker_api):
        TraitName.__init__(self, name)
        self.docker_api          = docker_api
        self.docker_compose_path = config['file']
        self.containers          = {}
        self.max_z_index         = 0
        self.build_order         = []
        self._calculate_containers(config)
        self._calculate_max_z_index()
        self._calculate_build_order()

    def run_container(self, container) -> None:
        SYS.run_docker_composer_container(PATH.get_project_base_directory() + self.docker_compose_path, container.name, container.run_in_background)

    def print_status(self) -> None:
        L.DashedLineBlue().p()
        L.Green('\t\t\t\t\t\t\t\t\tRunning project{' + self.name + '}').p()
        L.DashedLineBlue().p()
        for c in self.containers:
            self.containers[c].print_status()

    def has_container(self, container_name: str) -> bool:
        return container_name in self.containers

    def set_container_instance(self, container_name: str, container_instance) -> None:
        self.containers[container_name].set_instance(container_instance)

    def _calculate_containers(self, config: dict) -> None:
        containers = config['containers']
        for c in config['containers']:
            self.containers[c] = Container(c, containers[c], self)

    def _calculate_max_z_index(self) -> None:
        for c in self.containers:
            z_index = self.containers[c].z_index
            if z_index > self.max_z_index:
                self.max_z_index = z_index

    def _calculate_build_order(self) -> None:
        z = 0
        while z < self.max_z_index + 1:
            build_layer = []
            for c in self.containers:
                if self.containers[c].z_index == z:
                    build_layer.append(self.containers[c])
            self.build_order.append(build_layer)
            z += 1
