#include "utility_math_functions.h"

inline const unsigned is_even(const unsigned long n) {
    return !(n & 1);
}

inline unsigned char get_flipped_byte(unsigned char c) {
    return c ^ ((unsigned char) 255);
}

extern unsigned char get_bit_0(const unsigned char c) {
    return (c & 0x1) > 0;
}

extern unsigned char get_bit_1(const unsigned char c) {
    return (c & 0x2) > 0;
}

extern unsigned char get_bit_2(const unsigned char c) {
    return (c & 0x4) > 0;
}

extern unsigned char get_bit_3(const unsigned char c) {
    return (c & 0x8) > 0;
}

extern unsigned char get_bit_4(const unsigned char c) {
    return (c & 0x10) > 0;
}

extern unsigned char get_bit_5(const unsigned char c) {
    return (c & 0x20) > 0;
}

extern unsigned char get_bit_6(const unsigned char c) {
    return (c & 0x40)> 0;
}

extern unsigned char get_bit_7(const unsigned char c) {
    return (c & 0x80) > 0;
}
