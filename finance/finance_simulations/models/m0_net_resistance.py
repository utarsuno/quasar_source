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

	// Weight 4.
	float buy_order_price_multiplier = atof(argv[ARGUMENT_INDEX_WEIGHT_4]);
	// Weight 5.
	float sell_order_price_multiplier = atof(argv[ARGUMENT_INDEX_WEIGHT_5]);

	printf("Printing the weights\\n");

	printf("%f\\n", buy_weight);
	printf("%f\\n", sell_weight);
	printf("%f\\n", buy_threshold);
	printf("%f\\n", sell_threshold);
	printf("%f\\n", buy_order_price_multiplier);
	printf("%f\\n", sell_order_price_multiplier);
	

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

	/*__                         ___    __           __  ___       __  ___
	 /__` |  |\/| |  | |     /\   |  | /  \ |\ |    /__`  |   /\  |__)  |
	 .__/ |  |  | \__/ |___ /~~\  |  | \__/ | \|    .__/  |  /~~\ |  \  |  */

	SimulationState * simulation_state = (SimulationState *) malloc(sizeof(SimulationState));
	BookOrder * buy_orders = (BookOrder *) malloc(sizeof(BookOrder) * MAXIMUM_NUMBER_OF_BUY_ORDERS);
	BookOrder * sell_orders = (BookOrder *) malloc(sizeof(BookOrder) * MAXIMUM_NUMBER_OF_SELL_ORDERS);

	initialize_simulation_state(simulation_state, buy_orders, sell_orders);

	time_index = 0;
	float current_net_influence;
	float current_price;
	while (time_index < NUMBER_OF_TIME_INSTANCES) {
		current_net_influence = net_influence[time_index];
		current_price = prices[time_index];

		/*__        ___  __             ___                      __   __   __           __   __   __   ___  __   __      ___      ___  __       ___  ___  __
		 /  ` |__| |__  /  ` |__/    | |__      /\  |\ | \ /    |__) /  \ /  \ |__/    /  \ |__) |  \ |__  |__) /__`    |__  \_/ |__  /  ` |  |  |  |__  |  \
		 \__, |  | |___ \__, |  \    | |       /~~\ | \|  |     |__) \__/ \__/ |  \    \__/ |  \ |__/ |___ |  \ .__/    |___ / \ |___ \__, \__/  |  |___ |__/ */
		check_if_any_buy_or_sell_orders_should_be_filled(current_price, simulation_state, buy_orders, sell_orders);

		/*__        ___  __             ___          ___  ___  __     ___  __      __             __   ___          ___          __   __   __   ___  __
		 /  ` |__| |__  /  ` |__/    | |__     |\ | |__  |__  |  \     |  /  \    |__) |     /\  /  ` |__     |\ | |__  |  |    /  \ |__) |  \ |__  |__)
		 \__, |  | |___ \__, |  \    | |       | \| |___ |___ |__/     |  \__/    |    |___ /~~\ \__, |___    | \| |___ |/\|    \__/ |  \ |__/ |___ |  \ */

		// Check if it is a buy signal.
		if (current_net_influence > buy_threshold) {

			if (can_place_buy_order(simulation_state) == TRUE) {
				place_buy_order(10.0, current_price * buy_order_price_multiplier, simulation_state, buy_orders);
			}

		} else if (current_net_influence < sell_threshold) {

			if (can_place_sell_order(simulation_state) == TRUE) {
				place_sell_order(10.0, current_price * sell_order_price_multiplier, simulation_state, buy_orders);
			}

		}

		time_index += 1;
	}

	//printf("PRINTING ENDING SUMS\\n");
	printf("Current number of buy orders {%d}\\n", simulation_state->number_of_current_buy_orders);
	printf("Current number of sell orders {%d}\\n", simulation_state->number_of_current_sell_orders);
	printf("Current number of masari {%f}\\n", simulation_state->masari_capital);
	printf("Current number of btc {%f}\\n", simulation_state->btc_capital);
	printf("Number of buy orders executed {%d}\\n", simulation_state->number_of_buy_orders_executed);
	printf("Number of sell orders executed {%d}\\n", simulation_state->number_of_sell_orders_executed);

	//printf("Last price was : %f\\n", current_price);
	float btc_to_masari = simulation_state->btc_capital / current_price;

	//printf("Final score(ish) : %f\\n", simulation_state->masari_capital + btc_to_masari);
	printf("%f\\n", simulation_state->masari_capital + btc_to_masari);

	free(simulation_state);

	return 1;
}

'''



class FinanceModel_M0(FinanceModel):
	"""Represents a specific finance model."""

	def __init__(self):
		super().__init__(FINANCE_MODEL_TYPE_M0, [DATA_REQUIREMENT_FULL_BOOK_ORDER, DATA_KEY_LAST_PRICE])
		self._number_of_weights = 4

		self._c_main_code = C_MAIN_CODE

		self.add_required_define_statement('ARGUMENT_INDEX_WEIGHT_0', '1')
		self.add_required_define_statement('ARGUMENT_INDEX_WEIGHT_1', '2')
		self.add_required_define_statement('ARGUMENT_INDEX_WEIGHT_2', '3')
		self.add_required_define_statement('ARGUMENT_INDEX_WEIGHT_3', '4')
		self.add_required_define_statement('ARGUMENT_INDEX_WEIGHT_4', '5')
		self.add_required_define_statement('ARGUMENT_INDEX_WEIGHT_5', '6')

		self.add_required_library('/home/git_repos/quasar_source/finance/c_source_files/abstract/custom_constants.h')
		self.add_required_library('/home/git_repos/quasar_source/finance/c_source_files/abstract/simulation_state.h')
		self.add_required_library('<stdio.h>')
		self.add_required_library('<stdlib.h>')
		self.add_required_library('<string.h>')

'''

#define MAXIMUM_NUMBER_OF_BUY_ORDERS  10
#define MAXIMUM_NUMBER_OF_SELL_ORDERS 10

typedef struct simulation_state {
	int number_of_current_buy_orders;
	int number_of_current_sell_orders;
	float masari_capital;
	float btc_capital;
	float net_btc_profit;
} SimulationState;

typedef struct book_order {
	float order_amount;
	float order_price;
	unsigned char currently_active;
} BookOrder;

BookOrder  buy_orders[MAXIMUM_NUMBER_OF_BUY_ORDERS];
BookOrder sell_orders[MAXIMUM_NUMBER_OF_SELL_ORDERS];
SimulationState simulation_state;

void initialize_simulation_state();
int can_place_buy_order();
int can_place_sell_order();
void place_buy_order(const float order_amount, const float order_price);
void place_sell_order(const float order_amount, const float order_price);
void check_if_any_buy_or_sell_orders_should_be_filled(const float current_price);


'''