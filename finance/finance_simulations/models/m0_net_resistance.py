# coding=utf-8

"""This module, m0_net_resistance.py, represents the M0 trading model."""

from finance.finance_simulations.c_generator.data.data_instance import *
from finance.finance_simulations.models.trading_model import *



C_MAIN_CODE = '''
float net_influence[NUMBER_OF_TIME_INSTANCES];

int main(int argc, char * argv[]) {
	// Weight 0.
	float buy_weight = atof(argv[ARGUMENT_INDEX_WEIGHT_0]);
	// Weight 1.
	float sell_weight = atof(argv[ARGUMENT_INDEX_WEIGHT_1]);
	// Weight 2.
	float weight_2 = atof(argv[ARGUMENT_INDEX_WEIGHT_2]);
	// Weight 3.
	float weight_3 = atof(argv[ARGUMENT_INDEX_WEIGHT_3]);

	int time_index = 0;
	while (time_index < NUMBER_OF_TIME_INSTANCES) {
		int num_orders_buy = number_of_buy_orders[time_index];
		int num_orders_sell = number_of_sell_orders[time_index];
		float current_price = prices[time_index];
		int i;

		// Calculate the net buy influence.
		for (i = 0; i < num_orders_buy; i++) {
			// distance_from_price : current_price - all_buy_prices[time_index][i]
			// influence : buy_weight / (distance_from_price * 2)
			net_influence[time_index] += (all_buy_amounts[time_index][i] * all_buy_prices[time_index][i]) * (buy_weight / (current_price - all_buy_prices[time_index][i] * 2));
		}

		// Calculate the net sell influence.
		for (i = 0; i < num_orders_sell; i++) {
			// distance_from_price : current_price - all_sell_prices[time_index][i]
			// influence : sell_weight / (distance_from_price * 2)
			net_influence[time_index] += (all_sell_amounts[time_index][i] * all_sell_prices[time_index][i]) * (sell_weight / (current_price - all_sell_prices[time_index][i] * 2));
		}

		printf("NET INFLUENCE IS : {%f}\\n", net_influence[time_index]);

		time_index += 1;
	}

	return 1;
}

'''



class FinanceModel_M0(FinanceModel):
	"""Represents a specific finance model."""

	def __init__(self):
		super().__init__(FINANCE_MODEL_TYPE_M0, [DATA_REQUIREMENT_FULL_BOOK_ORDER, DATA_KEY_LAST_PRICE])
		self._number_of_weights = 4

		self._c_main_code = C_MAIN_CODE




