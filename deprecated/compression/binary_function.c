#include <stdlib.h>
#include <math.h>
#include "binary_function.h"

inline BinaryFunction * get_new_binary_function(const float c0, const float c1, const float c2, const float s0, const float s1, const float s2) {
    BinaryFunction * bf = (BinaryFunction *) malloc(sizeof(BinaryFunction));
    bf->c0 = c0;
    bf->c1 = c1;
    bf->c2 = c2;
    bf->s0 = s0;
    bf->s1 = s1;
    bf->s2 = s2;
    return bf;
}

inline void set_binary_function(BinaryFunction * bf, const float c0, const float c1, const float c2, const float s0, const float s1, const float s2) {
    bf->c0 = c0;
    bf->c1 = c1;
    bf->c2 = c2;
    bf->s0 = s0;
    bf->s1 = s1;
    bf->s2 = s2;
}

inline unsigned char get_binary_value_at_position_00(unsigned long position, BinaryFunction * bf) {
    //return 0;
    //return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);

    float e0 = bf->c0 * (cos(bf->c1 + bf->c2 * (float) position));
    float e1 = bf->s0 * (cos(bf->s1 + bf->s2 * (float) position));
    float v = e0 + e1 * e1;
    return (unsigned char) (v < 0.01 && v > -0.01);
    //return return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);
}

inline unsigned char get_binary_value_at_position_01(unsigned long position, BinaryFunction * bf) {
    //return 0;
    //return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);

    float e0 = bf->c0 * (sin(bf->c1 + bf->c2 * (float) position));
    float e1 = bf->s0 * (sin(bf->s1 + bf->s2 * (float) position));
    float v = e0 + e1 * e1;
    return !((unsigned char) (v < 0.01 && v > -0.01));
    //return return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);
}

inline unsigned char get_binary_value_at_position_02(unsigned long position, BinaryFunction * bf) {
    //return 0;
    //return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);

    float e0 = bf->c0 * (sin(bf->c1 + bf->c2 * (float) position));
    float e1 = bf->s0 * (sin(bf->s1 + bf->s2 * (float) position));
    float e2 = bf->s0 * (cos(bf->s1 + bf->s2 * (float) position));
    float v = e0 + e1 * e1 + e2 * e2 * e2;
    return (unsigned char) (v < 0.01 && v > -0.01);
    //return return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);
}

inline unsigned char get_binary_value_at_position_03(unsigned long position, BinaryFunction * bf) {
    //return 0;
    //return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);

    float e0 = bf->c0 * (cos(bf->c1 + bf->c2 * (float) position));
    float e1 = bf->s0 * (cos(bf->s1 + bf->s2 * (float) position));
    float e2 = bf->s0 * (sin(bf->s1 + bf->s2 * (float) position));
    float v = e0 + e1 * e1 + e2 * e2 * e2;
    return (unsigned char) (v < 0.01 && v > -0.01);
    //return return (unsigned char) ((bf->c0 * (cos(bf->c1 + bf->c2 * (float) position))) + (bf->s0 * (cos(bf->s1 + bf->s2 * (float) position))) > .01);
}

inline unsigned char get_binary_value_at_position_04(unsigned long position, BinaryFunction * bf) {
    //return (unsigned char) (bf->c0) > .01;
    return (unsigned char) 0;
}

inline unsigned char get_binary_value_at_position_05(unsigned long position, BinaryFunction * bf) {
    //return (unsigned char) (bf->c0) > .01;
    return (unsigned char) 1;
}