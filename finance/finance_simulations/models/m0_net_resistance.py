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
	float buy_threshold = atof(argv[ARGUMENT_INDEX_WEIGHT_2]);
	// Weight 3.
	float sell_threshold = atof(argv[ARGUMENT_INDEX_WEIGHT_3]);

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
			net_influence[time_index] += (all_buy_amounts[time_index][i] * all_buy_prices[time_index][i]) * (buy_weight / (current_price - all_buy_prices[time_index][i] * 20));
		}

		// Calculate the net sell influence.
		for (i = 0; i < num_orders_sell; i++) {
			// distance_from_price : current_price - all_sell_prices[time_index][i]
			// influence : sell_weight / (distance_from_price * 2)
			net_influence[time_index] += (all_sell_amounts[time_index][i] * all_sell_prices[time_index][i]) * (sell_weight / (current_price - all_sell_prices[time_index][i] * 20));
		}

		//printf("NET INFLUENCE IS : {%f}\\n", net_influence[time_index]);

		time_index += 1;
	}

	// Now run the actual simulation!
	initialize_simulation_state();

	time_index = 0;
	float current_net_influence;
	float current_price;
	while (time_index < NUMBER_OF_TIME_INSTANCES) {
		current_net_influence = net_influence[time_index];
		current_price = prices[time_index];

		check_if_any_buy_or_sell_orders_should_be_filled(current_price);

		// Check if it is a buy signal.
		if (current_net_influence > buy_threshold) {

			if (can_place_buy_order() == TRUE) {
				place_buy_order(10.0, current_price);
			}

		} else if (current_net_influence < sell_threshold) {

			if (can_place_sell_order() == TRUE) {
				place_sell_order(10.0, current_price);
			}

		}

		time_index += 1;
	}

	printf("PRINTING ENDING SUMS\\n");
	printf("Current number of buy orders {%d}\\n", simulation_state.number_of_current_buy_orders);
	printf("Current number of sell orders {%d}\\n", simulation_state.number_of_current_sell_orders);
	printf("Current number of masari {%f}\\n", simulation_state.masari_capital);
	printf("Current number of btc {%f}\\n", simulation_state.btc_capital);


	return 1;
}

'''



class FinanceModel_M0(FinanceModel):
	"""Represents a specific finance model."""

	def __init__(self):
		super().__init__(FINANCE_MODEL_TYPE_M0, [DATA_REQUIREMENT_FULL_BOOK_ORDER, DATA_KEY_LAST_PRICE])
		self._number_of_weights = 4

		self._c_main_code = C_MAIN_CODE
