# coding=utf-8

"""This file, docker_api.py, provides a wrapper abstraction for Docker containers (over a 3rd party abstraction)."""

from libraries.python.common_traits.trait_name   import TraitName
from libraries.python.universal_utilities.system import colored_output as L


class Container(TraitName):
    '''Represents a single container.'''

    def __init__(self, name: str, config: dict, project):
        TraitName.__init__(self, name)
        self.project           = project
        self.z_index           = int(config['z_index'])
        self.run_in_background = int(config['in_background']) == 1
        self.container         = None

    def get_name(self) -> str:
        name = ' - Container{' + self.name + '}'
        name += ' ' * (35 - len(name))
        return name

    def current_status(self) -> str:
        status = self.get_name() + ' is '
        if self.is_running():
            return status + 'running'
        return status + 'not running'

    def run(self) -> None:
        self.project.run_container(self)

    def kill(self) -> None:
        self.container.kill()

    def print_status(self) -> None:
        if not self.is_running():
            L.Green(self.get_name() + ' is being ran').p()
            self.run()
        else:
            L.Yellow(self.current_status()).p()

    def is_running(self) -> bool:
        return self.container is not None

    def set_instance(self, container) -> None:
        self.container = container

