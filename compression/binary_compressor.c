#include <stdlib.h>
#include <stdio.h>
#include "binary_compressor.h"
#include "binary_function.h"
#include "utility_math_functions.h"

typedef struct {
    unsigned char b0;
    unsigned char b1;
    unsigned char b2;
    unsigned char b3;
    unsigned char b4;
    unsigned char b5;
    unsigned char b6;
    unsigned char b7;
} EightBits;

void _traverse_binary_sequence(const unsigned char * buffer, const unsigned long buffer_length, BinaryFunction * bf) {
    unsigned long position = 0;
    unsigned long number_of_matches = 0;

    unsigned long m0 = 0;
    unsigned long m1 = 0;
    unsigned long m2 = 0;
    unsigned long m3 = 0;
    unsigned long m4 = 0;
    unsigned long m5 = 0;

    unsigned char b0;

    EightBits * bits = (EightBits *) malloc(sizeof(EightBits));

    unsigned char current_value;
    for (position = 0; position < buffer_length; position++) {

        current_value = * (buffer + position);
        bits->b0 = get_bit_0(current_value);
        bits->b1 = get_bit_1(current_value);
        bits->b2 = get_bit_2(current_value);
        bits->b3 = get_bit_3(current_value);
        bits->b4 = get_bit_4(current_value);
        bits->b5 = get_bit_5(current_value);
        bits->b6 = get_bit_6(current_value);
        bits->b7 = get_bit_7(current_value);

        //printf("%d\n", (int) current_value);


        m0 += get_binary_value_at_position_00(position * 8 + 0, bf) == bits->b0;
        m0 += get_binary_value_at_position_00(position * 8 + 1, bf) == bits->b1;
        m0 += get_binary_value_at_position_00(position * 8 + 2, bf) == bits->b2;
        m0 += get_binary_value_at_position_00(position * 8 + 3, bf) == bits->b3;
        m0 += get_binary_value_at_position_00(position * 8 + 4, bf) == bits->b4;
        m0 += get_binary_value_at_position_00(position * 8 + 5, bf) == bits->b5;
        m0 += get_binary_value_at_position_00(position * 8 + 6, bf) == bits->b6;
        m0 += get_binary_value_at_position_00(position * 8 + 7, bf) == bits->b7;

        m1 += get_binary_value_at_position_01(position * 8 + 0, bf) == bits->b0;
        m1 += get_binary_value_at_position_01(position * 8 + 1, bf) == bits->b1;
        m1 += get_binary_value_at_position_01(position * 8 + 2, bf) == bits->b2;
        m1 += get_binary_value_at_position_01(position * 8 + 3, bf) == bits->b3;
        m1 += get_binary_value_at_position_01(position * 8 + 4, bf) == bits->b4;
        m1 += get_binary_value_at_position_01(position * 8 + 5, bf) == bits->b5;
        m1 += get_binary_value_at_position_01(position * 8 + 6, bf) == bits->b6;
        m1 += get_binary_value_at_position_01(position * 8 + 7, bf) == bits->b7;

        m2 += get_binary_value_at_position_02(position * 8 + 0, bf) == bits->b0;
        m2 += get_binary_value_at_position_02(position * 8 + 1, bf) == bits->b1;
        m2 += get_binary_value_at_position_02(position * 8 + 2, bf) == bits->b2;
        m2 += get_binary_value_at_position_02(position * 8 + 3, bf) == bits->b3;
        m2 += get_binary_value_at_position_02(position * 8 + 4, bf) == bits->b4;
        m2 += get_binary_value_at_position_02(position * 8 + 5, bf) == bits->b5;
        m2 += get_binary_value_at_position_02(position * 8 + 6, bf) == bits->b6;
        m2 += get_binary_value_at_position_02(position * 8 + 7, bf) == bits->b7;

        m3 += get_binary_value_at_position_03(position * 8 + 0, bf) == bits->b0;
        m3 += get_binary_value_at_position_03(position * 8 + 1, bf) == bits->b1;
        m3 += get_binary_value_at_position_03(position * 8 + 2, bf) == bits->b2;
        m3 += get_binary_value_at_position_03(position * 8 + 3, bf) == bits->b3;
        m3 += get_binary_value_at_position_03(position * 8 + 4, bf) == bits->b4;
        m3 += get_binary_value_at_position_03(position * 8 + 5, bf) == bits->b5;
        m3 += get_binary_value_at_position_03(position * 8 + 6, bf) == bits->b6;
        m3 += get_binary_value_at_position_03(position * 8 + 7, bf) == bits->b7;

        m4 += get_binary_value_at_position_04(position * 8 + 0, bf) == bits->b0;
        m4 += get_binary_value_at_position_04(position * 8 + 1, bf) == bits->b1;
        m4 += get_binary_value_at_position_04(position * 8 + 2, bf) == bits->b2;
        m4 += get_binary_value_at_position_04(position * 8 + 3, bf) == bits->b3;
        m4 += get_binary_value_at_position_04(position * 8 + 4, bf) == bits->b4;
        m4 += get_binary_value_at_position_04(position * 8 + 5, bf) == bits->b5;
        m4 += get_binary_value_at_position_04(position * 8 + 6, bf) == bits->b6;
        m4 += get_binary_value_at_position_04(position * 8 + 7, bf) == bits->b7;

        m5 += get_binary_value_at_position_05(position * 8 + 0, bf) == bits->b0;
        m5 += get_binary_value_at_position_05(position * 8 + 1, bf) == bits->b1;
        m5 += get_binary_value_at_position_05(position * 8 + 2, bf) == bits->b2;
        m5 += get_binary_value_at_position_05(position * 8 + 3, bf) == bits->b3;
        m5 += get_binary_value_at_position_05(position * 8 + 4, bf) == bits->b4;
        m5 += get_binary_value_at_position_05(position * 8 + 5, bf) == bits->b5;
        m5 += get_binary_value_at_position_05(position * 8 + 6, bf) == bits->b6;
        m5 += get_binary_value_at_position_05(position * 8 + 7, bf) == bits->b7;


        /*
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 0, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 1, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 2, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 3, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 4, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 5, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 6, bf));
        printf("%d\n", (int) get_binary_value_at_position(position * 8 + 7, bf));

        printf("%d\n", (int) get_bit_0(current_value));
        printf("%d\n", (int) get_bit_1(current_value));
        printf("%d\n", (int) get_bit_2(current_value));
        printf("%d\n", (int) get_bit_3(current_value));
        printf("%d\n", (int) get_bit_4(current_value));
        printf("%d\n", (int) get_bit_5(current_value));
        printf("%d\n", (int) get_bit_6(current_value));
        printf("%d\n", (int) get_bit_7(current_value));
        */

        //printf("Number of matches : %lu\n", number_of_matches);

        //exit(5);

        //printf("%d\n", (int) get_binary_value_at_position(position, bf));
    }

    //printf("Total : %lu\n", buffer_length * 8);
    //printf("Number of matches : %lu\n", number_of_matches);

    float mm0 = ((float) (m0) / (float) (buffer_length * 8)) * 100.0;
    float mm1 = ((float) (m1) / (float) (buffer_length * 8)) * 100.0;
    float mm2 = ((float) (m2) / (float) (buffer_length * 8)) * 100.0;
    float mm3 = ((float) (m3) / (float) (buffer_length * 8)) * 100.0;
    float mm4 = ((float) (m4) / (float) (buffer_length * 8)) * 100.0;
    float mm5 = ((float) (m5) / (float) (buffer_length * 8)) * 100.0;

    printf("%% matched : %f, %f, %f, %f, %f, %f\n", mm0, mm1, mm2, mm3, mm4, mm5);

}

inline void traverse_binary_sequence(const unsigned char * buffer, const unsigned long buffer_length) {
    float c0 = 1.0;
    float c1 = 1.0;
    float c2 = 1.0;
    float s0 = 1.0;
    float s1 = 1.0;
    float s2 = 1.0;
    BinaryFunction * bf = get_new_binary_function(c0, c1, c2, s0, s1, s2);

    //set_binary_function(bf, c0, c1, c2, s0, s1, s2);
    //_traverse_binary_sequence(buffer, buffer_length, bf);
    //exit(5);

    int i;
    for (i = 0; i < 100; i++) {
        //c0 += 0.15;
        //s0 += 1;

        // printf("%f\n", ((float)rand()/(float)(RAND_MAX)) * a);

        int positive;
        if ((float)rand()/(float)(RAND_MAX) * 10 > 5.0) {
            positive = 2;
        }

        float r = ((float)rand()/(float)(RAND_MAX) * 10) / 10000.0;

        if (positive == 2) {
            c0 += ((float)rand()/(float)(RAND_MAX)) * r;
            c1 += ((float)rand()/(float)(RAND_MAX)) * r;
            c2 += ((float)rand()/(float)(RAND_MAX)) * r;
            s0 += ((float)rand()/(float)(RAND_MAX)) * r;
            s1 += ((float)rand()/(float)(RAND_MAX)) * r;
            s2 += ((float)rand()/(float)(RAND_MAX)) * r;
        } else {
            c0 -= ((float)rand()/(float)(RAND_MAX)) * r;
            c1 -= ((float)rand()/(float)(RAND_MAX)) * r;
            c2 -= ((float)rand()/(float)(RAND_MAX)) * r;
            s0 -= ((float)rand()/(float)(RAND_MAX)) * r;
            s1 -= ((float)rand()/(float)(RAND_MAX)) * r;
            s2 -= ((float)rand()/(float)(RAND_MAX)) * r;
        }


        set_binary_function(bf, c0, c1, c2, s0, s1, s2);
        _traverse_binary_sequence(buffer, buffer_length, bf);
    }

    free(bf);
}



// 2524956
// 2461709
// 2312790

// 631358


