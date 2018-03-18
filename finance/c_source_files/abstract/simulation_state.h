#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/custom_constants.h"

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

void initialize_simulation_state();
int can_place_buy_order(SimulationState * simulation_state);
int can_place_sell_order(SimulationState * simulation_state);
void place_buy_order(const float order_amount, const float order_price, SimulationState * simulation_state, BookOrder * buy_orders);
void place_sell_order(const float order_amount, const float order_price, SimulationState * simulation_state, BookOrder * sell_orders);
void check_if_any_buy_or_sell_orders_should_be_filled(const float current_price, SimulationState * simulation_state, BookOrder * buy_orders, BookOrder * sell_orders);
