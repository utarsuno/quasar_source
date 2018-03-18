# coding=utf-8

"""This module, monte_simulation_dice_game.py, runs a simulation of a specific dice game."""

from random import randint as r

import matplotlib.pyplot as plt
import numpy as np



#n0 = r(0, 99)
n0 = 0

funds      = 1000
bet_amount = 1
win_amount = .1

win_condition = 90


games_to_play = 100000
x_axis = np.arange(0, games_to_play)

scores = []
i = 0
while i < 100:
	scores.append(np.zeros(games_to_play))
	scores[i][0] = funds
	i += 1

i = 1
while i < games_to_play:

	print(i)

	n1 = r(0, 99)

	j = 0
	while j < 100:
		if (j + n1) % 100 < win_condition:
			scores[j][i] = scores[j][i - 1] + win_amount
		else:
			scores[j][i] = scores[j][i - 1] - bet_amount

		j += 1

	i += 1


p = 0
while p < 100:

	plt.plot(x_axis, scores[p])

	p += 1


plt.show()
