#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

inline const float bytes_to_float(const unsigned char b0, const unsigned char b1, const unsigned char b2, const unsigned char b3) {
    float output;
    * ((unsigned char *)(& output) + 3) = b0;
    * ((unsigned char *)(& output) + 2) = b1;
    * ((unsigned char *)(& output) + 1) = b2;
    * ((unsigned char *)(& output) + 0) = b3;
    return output;
}

int main(const int argc, const char * argv[]) {

    sleep(5);
    printf("This is the output from program{%s}!\n", argv[1]);

    return 0;
}