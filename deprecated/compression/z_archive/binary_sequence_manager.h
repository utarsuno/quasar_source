#include <stdio.h>
#include <stdlib.h>

#define MAX_BUFFER_OFFSET_DIVIDER 524288

typedef struct {
    unsigned long position;
    unsigned long offset;
    unsigned short formula;
} SequenceResult;

typedef struct binary_sequence_function {
    unsigned long position;
    unsigned long offset;
    unsigned short sequence_function;
    struct binary_sequence_function * next;
    struct binary_sequence_function * prev;
} BinarySequenceFunction;

typedef struct {
    BinarySequenceFunction * start;
    BinarySequenceFunction * end;

    unsigned long number_of_blocks;

    unsigned long original_file_size;
    unsigned long compressed_bytes;

    unsigned long * compressed_bit_patterns_bytes;
} BinarySequenceManager;

/*__   ___  __        ___       __   ___      __   ___  __            ___  __
 /__` |__  /  \ |  | |__  |\ | /  ` |__      |__) |__  /__` |  | |     |  /__`
 .__/ |___ \__X \__/ |___ | \| \__, |___ ___ |  \ |___ .__/ \__/ |___  |  .__/ */
extern void check_for_new_longest_sequence(unsigned char * bit_pattern_list, const unsigned long position, SequenceResult * sr);
extern void bit_patterns_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr);
extern void bit_patterns_plus_one_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr);
extern void bit_patterns_minus_one_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr);
extern void check_for_best(SequenceResult * sr_best, SequenceResult * sr_curr);
extern void check_best_result_00(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr_best, SequenceResult * sr_curr);
extern void check_best_result_01(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr_best, SequenceResult * sr_curr);
extern void check_best_result_02(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr_best, SequenceResult * sr_curr);
//extern SequenceResult * bit_patterns_plus_one_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset);
//extern SequenceResult * bit_patterns_minus_one_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset);
extern SequenceResult * get_new_sequence_result();
/*__   ___  __        ___       __   ___      ___            __  ___    __
 /__` |__  /  \ |  | |__  |\ | /  ` |__      |__  |  | |\ | /  `  |  | /  \ |\ |
 .__/ |___ \__X \__/ |___ | \| \__, |___ ___ |    \__/ | \| \__,  |  | \__/ | \| */
extern BinarySequenceFunction * get_new_binary_sequence_function(const unsigned long position, const unsigned long offset, const unsigned char sequence_function);
/*                    __   ___  __
 |\/|  /\  |\ |  /\  / _` |__  |__)
 |  | /~~\ | \| /~~\ \__> |___ |  \ */
extern void binary_sequence_manager_add_compressed_chunk(const unsigned long position, const unsigned long offset, const unsigned char sequence_function, BinarySequenceManager * manager);
extern void binary_sequence_manager_print_chunks(BinarySequenceManager * manager);
extern BinarySequenceManager * get_new_binary_sequence_manager(const unsigned long original_file_size);
extern void binary_sequence_manager_statistics(BinarySequenceManager * manager);
extern void binary_sequence_manager_save_output(BinarySequenceManager * manager, const char * output_path);