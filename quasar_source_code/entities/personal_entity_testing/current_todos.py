# coding=utf-8

"""Temporary module until this kind of functionality can be done on the website."""

# SOON GOAL : have the network also transfer other player's camera direction
# SOON GOAL : create the entity database layer.

# Finish studying on Django channels.
# https://channels.readthedocs.io/en/stable/binding.html

# Add 2d chat/text capabilities. Use enter to toggle chat view and typing.

# Implement double jump activiating fly mode.

# Implement fly mode.

# Fix the current movement system.

# Future goal : add client/server interpolation of player movements.




# Need to do lots of linear algebra studying before doing the above.

x = 1.0
y = -1.0
while x < 2.2:

	dy_dx = 0.1 * (1/(x * x) - y/x - (y * y))
	y += dy_dx

	print(str(y) + '\t' + str(dy_dx))

	x += 0.1


print()