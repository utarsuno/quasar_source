#include "binary_compressor.h"
#include "utility_math_functions.h"

inline void check_for_new_longest_sequence(unsigned char * bit_pattern_list, const unsigned long position, SequenceResult * sr) {
    unsigned char bit_pattern;
    // Get longest distance of all bit patterns checked.
    unsigned long longest_bit_pattern_alive_for = 0;
    unsigned char bitmap_to_use;
    for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
        if (bit_pattern_list[bit_pattern] > longest_bit_pattern_alive_for) {
            longest_bit_pattern_alive_for = bit_pattern_list[bit_pattern];
            bitmap_to_use = bit_pattern;
        }
    }
    if (longest_bit_pattern_alive_for > 0) {
        sr->position = position;
        sr->offset   = longest_bit_pattern_alive_for;
        sr->formula  = bitmap_to_use;
    } else {
        sr->offset   = 0;
    }
}

inline void bit_patterns_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr) {
    unsigned char bit_pattern_list[255];
    unsigned char bit_pattern;
    for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
        bit_pattern_list[bit_pattern] = 0;
    }
    unsigned long offset;
    for (offset = 0; offset < local_max_offset; offset++) {
        unsigned char current_value = * (buffer + position + offset);
        for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
            // Only perform a check if the pattern is still alive.
            if (bit_pattern_list[bit_pattern] == offset) {
                if (bit_pattern == current_value) {
                    bit_pattern_list[bit_pattern] += 1;
                }
            }
        }
    }
    check_for_new_longest_sequence(bit_pattern_list, position, sr);
}

inline void bit_patterns_plus_one_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr) {
    unsigned char bit_pattern_list[255];
    unsigned char bit_pattern;
    for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
        bit_pattern_list[bit_pattern] = 0;
    }
    unsigned long offset;
    for (offset = 0; offset < local_max_offset; offset++) {
        unsigned char current_value = * (buffer + position + offset);
        for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
            // Only perform a check if the pattern is still alive.
            if (bit_pattern_list[bit_pattern] == offset) {
                unsigned long function_value = offset + bit_pattern;
                if (function_value == current_value) {
                    bit_pattern_list[bit_pattern] += 1;
                }
            }
        }
    }
    check_for_new_longest_sequence(bit_pattern_list, position, sr);
}

inline void bit_patterns_minus_one_formula(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr) {
    unsigned char bit_pattern_list[255];
    unsigned char bit_pattern;
    for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
        bit_pattern_list[bit_pattern] = 0;
    }
    unsigned long offset;
    for (offset = 0; offset < local_max_offset; offset++) {
        unsigned char current_value = * (buffer + position + offset);
        for (bit_pattern = 0; bit_pattern < 255; bit_pattern++) {
            // Only perform a check if the pattern is still alive.
            if (bit_pattern_list[bit_pattern] == offset) {
                unsigned long function_value = bit_pattern - offset;
                if (function_value == current_value) {
                    bit_pattern_list[bit_pattern] += 1;
                }
            }
        }
    }
    check_for_new_longest_sequence(bit_pattern_list, position, sr);
}

inline void check_for_best(SequenceResult * sr_best, SequenceResult * sr_curr) {
    if (sr_curr->offset > sr_best->offset) {
        sr_best->offset = sr_curr->offset;
        sr_best->position = sr_curr->position;
        sr_best->formula = sr_curr->formula;
    }
}

inline void check_best_result_00(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr_best, SequenceResult * sr_curr) {
    bit_patterns_formula(buffer, position, local_max_offset, sr_curr);
    check_for_best(sr_best, sr_curr);
}

inline void check_best_result_01(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr_best, SequenceResult * sr_curr) {
    bit_patterns_plus_one_formula(buffer, position, local_max_offset, sr_curr);
    check_for_best(sr_best, sr_curr);
}

inline void check_best_result_02(const unsigned char * buffer, const unsigned long position, const unsigned long local_max_offset, SequenceResult * sr_best, SequenceResult * sr_curr) {
    bit_patterns_minus_one_formula(buffer, position, local_max_offset, sr_curr);
    check_for_best(sr_best, sr_curr);
}

inline void traverse_binary_sequence(const unsigned char * buffer, const unsigned long buffer_length, BinarySequenceManager * manager) {
    unsigned long max_offset = buffer_length / MAX_BUFFER_OFFSET_DIVIDER;
    //printf("Max offset %lu\n", max_offset);exit(5);
    unsigned long position = 0;
    unsigned long offset = 0;

    SequenceResult * sequence_best = get_new_sequence_result();
    SequenceResult * sequence_curr = get_new_sequence_result();

    unsigned char current_value;
    for (position = 0; position < buffer_length; position++) {



        unsigned long distance_remaining = buffer_length - position;
        unsigned long local_max_offset = (max_offset > distance_remaining) ? distance_remaining : max_offset;
        if (local_max_offset > distance_remaining) {
            local_max_offset = distance_remaining;
        }

        check_best_result_00(buffer, position, local_max_offset, sequence_best, sequence_curr);
        check_best_result_01(buffer, position, local_max_offset, sequence_best, sequence_curr);
        check_best_result_02(buffer, position, local_max_offset, sequence_best, sequence_curr);

        binary_sequence_manager_add_compressed_chunk(sequence_best->position, sequence_best->offset, sequence_best->formula, manager);
        //printf("Adding this much position {%lu}\n", sequence_best->offset);
        position += sequence_best->offset - 1;


        sequence_best->offset = 0;
    }

    free(sequence_best);
    free(sequence_curr);

    //exit(4);

    binary_sequence_manager_print_chunks(manager);
    binary_sequence_manager_statistics(manager);
}



// 2524956
// 2461709
// 2312790

// 631358


