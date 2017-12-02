# coding=utf-8

"""
misc
"""

class Tier:

	def __init__(self, extra_buying_power, cost_per_month):
		self.extra_buying_power = extra_buying_power
		self.cost_per_month     = cost_per_month

	def print_stats(self):
		print('################')
		total_cost = 12 * self.cost_per_month
		print('Total cost : ' + str(total_cost))
		verizon_stock_cost = 47
		number_of_shares = int(self.extra_buying_power / verizon_stock_cost)
		dividend_return = 0.577 * 4 * number_of_shares
		print('Total return : ' + str(dividend_return))

t0 = Tier(2000, 10)
t1 = Tier(2500, 14)
t2 = Tier(3000, 15)

t0.print_stats()
t1.print_stats()
t2.print_stats()

