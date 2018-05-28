#include "utility_math_functions.h"

inline const unsigned is_even(const unsigned long n) {
    return !(n & 1);
}

inline unsigned char get_flipped_byte(unsigned char c) {
    return c ^ ((unsigned char) 255);
}

// Base function code from user 'No Idea For Name' at : https://stackoverflow.com/questions/18327439/printing-binary-representation-of-a-char-in-c
inline const unsigned char * byte_to_binary(unsigned char x) {
    static char b[9];
    b[0] = '\0';
    int z;
    for (z = 128; z > 0; z >>= 1) {
        strcat(b, ((x & z) == z) ? "1" : "0");
    }
    return b;
}

/*__   ___  __        ___       __   ___      ___            __  ___    __        __
 /__` |__  /  \ |  | |__  |\ | /  ` |__      |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 .__/ |___ \__X \__/ |___ | \| \__, |___ ___ |    \__/ | \| \__,  |  | \__/ | \| .__/ */

inline unsigned char sf_x_squared(unsigned long position) {
    unsigned long i = 0;
    int position_hit = FALSE;
    while (position_hit == FALSE) {

    }
}