#include "binary_sequence_manager.h"
#include "file_operations.h"

/*__   ___  __        ___       __   ___      __   ___  __            ___  __
 /__` |__  /  \ |  | |__  |\ | /  ` |__      |__) |__  /__` |  | |     |  /__`
 .__/ |___ \__X \__/ |___ | \| \__, |___ ___ |  \ |___ .__/ \__/ |___  |  .__/ */
inline SequenceResult * get_new_sequence_result() {
    SequenceResult * sr = (SequenceResult *) malloc(sizeof(SequenceResult));
    sr->position = 0;
    sr->offset   = 0;
    sr->formula  = 0;
    return sr;
}

/*__   ___  __        ___       __   ___      ___            __  ___    __
 /__` |__  /  \ |  | |__  |\ | /  ` |__      |__  |  | |\ | /  `  |  | /  \ |\ |
 .__/ |___ \__X \__/ |___ | \| \__, |___ ___ |    \__/ | \| \__,  |  | \__/ | \| */
inline BinarySequenceFunction * get_new_binary_sequence_function(const unsigned long position, const unsigned long offset, const unsigned char sequence_function) {
    BinarySequenceFunction * new_sequence = (BinarySequenceFunction *) malloc(sizeof(BinarySequenceFunction));
    new_sequence->position                = position;
    new_sequence->offset                  = offset;
    new_sequence->sequence_function       = sequence_function;
    new_sequence->next                    = NULL;
    new_sequence->prev                    = NULL;
    return new_sequence;
}

/*                    __   ___  __
 |\/|  /\  |\ |  /\  / _` |__  |__)
 |  | /~~\ | \| /~~\ \__> |___ |  \ */
inline BinarySequenceManager * get_new_binary_sequence_manager(const unsigned long original_file_size) {
	BinarySequenceManager * manager        = (BinarySequenceManager *) malloc(sizeof(BinarySequenceManager));
    manager->start                         = NULL;
    manager->end                           = NULL;
    manager->original_file_size            = original_file_size;
    manager->number_of_blocks              = 0;
    manager->compressed_bytes              = 0;
    manager->compressed_bit_patterns_bytes = (unsigned long *) malloc(sizeof(unsigned long));
    *(manager->compressed_bit_patterns_bytes) = 0;
	return manager;
}

inline void binary_sequence_manager_add_compressed_chunk(const unsigned long position, const unsigned long offset, const unsigned char sequence_function, BinarySequenceManager * manager) {
    BinarySequenceFunction * new_sequence = get_new_binary_sequence_function(position, offset, sequence_function);

    manager->compressed_bytes += offset;

    if (manager->end == NULL) {
        manager->end = new_sequence;
    } else if (manager->start == NULL) {
        manager->start       = new_sequence;
        manager->start->next = manager->end;
        manager->end->prev   = manager->start;
    } else {
        BinarySequenceFunction * previous_start = manager->start;
        manager->start       = new_sequence;
        manager->start->next = previous_start;
        previous_start->prev = manager->start;
    }

    manager->number_of_blocks += 1;
}

inline void binary_sequence_manager_print_chunks(BinarySequenceManager * manager) {
    BinarySequenceFunction * start = manager->start;
    while (start != NULL) {
        printf("Position {%lu} Offset {%lu} Function {%d}\n", start->position, start->offset, start->sequence_function);
        start = start->next;
    }
}

inline void binary_sequence_manager_save_output(BinarySequenceManager * manager, const char * output_path) {


    FILE * f = fopen(output_path, WRITE_BINARY);
    //int i = 0;
    //while (i < buffer_size) {
    //    fputc(buffer[i], f);
    //    i += 1;
    //}

    BinarySequenceFunction * end = manager->end;
    while (end != NULL) {
        int i;
        for (i = 0; i < end->offset; i++) {
            fputc(end->sequence_function, f);
            //printf("Saving %c\n", start->sequence_function);
        }
        end = end->prev;
    }
    fclose(f);

}


inline void binary_sequence_manager_statistics(BinarySequenceManager * manager) {
    printf("Original file size {%lu}\n", manager->original_file_size);
    printf("Total bytes compressed {%lu}\n", manager->compressed_bytes);
    printf("Compressed ALL{%f%%}\n", ((float) manager->compressed_bytes / (float) manager->original_file_size) * 100.0);
    printf("Number of blocks{%lu}\n", manager->number_of_blocks);
    //printf("Compressed EVENS{%f%%}\n", ((float) manager->compressed_evens / (float) manager->original_file_size) * 100.0);
    //printf("Compressed ODDS{%f%%}\n", ((float) manager->compressed_odds / (float) manager->original_file_size) * 100.0);
}

// TODO : Free functions!!
