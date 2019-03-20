import docker

client = docker.APIClient(base_url='unix://var/run/docker.sock')
x_container = client.containers(filters={"name":"asset_server"})[0]

#x_ip_addr = x_container["NetworkSettings"]["Networks"]["NETWORK_NAME"]["IPAddress"]

#print(x_container)
#print(x_ip_addr)
print(x_container["NetworkSettings"]["Networks"])

