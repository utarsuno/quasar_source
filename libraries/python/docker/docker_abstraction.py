# coding=utf-8

"""This file, docker_api.py, provides abstracted utilites for common Docker operations."""

import docker
from libraries.python.docker.project            import Project
from libraries.python.universal_utilities.files import file_utilities as FILE


class DockerAPI(object):
    '''Provides abstraction to Docker operations.'''

    def __init__(self):
        self.api      = docker.from_env()
        self.projects = []
        self._calculate_projects(FILE.get_project_config())

    def print_status(self) -> None:
        for p in self.projects:
            p.print_status()

    def _calculate_projects(self, config: dict) -> None:
        config_docker = config['docker']
        for project in config_docker:
            self.projects.append(Project(project, config_docker[project], self))

        containers = self.api.containers.list()
        for c in containers:
            name = c.attrs['Name'].replace('/', '')

            for p in self.projects:
                if p.has_container(name):
                    p.set_container_instance(name, c)
                    break

