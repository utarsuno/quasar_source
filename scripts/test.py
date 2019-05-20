# coding=utf-8

"""This file, test.py, is a temporary file."""

from libraries.python.docker.docker_abstraction import DockerAPI



'''
print('Docker imported')
client = docker.from_env()

running_containers = client.containers.list()
print(running_containers)

c0 = running_containers[0]
print(c0)
print(c0.attrs)
print(c0.attrs['Id'])
print(c0.attrs['Name'])
'''


api = DockerAPI()

#print(api)

api.print_status()