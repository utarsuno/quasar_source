// Library for standard input/output operations.
#include <stdio.h>
// #include <stdlib.h>

int main(const int argc, const char * argv[]) {
	const float * all_opens = (float *) argv[1];

    printf("Hello World{%f}\n", all_opens[0]);
    printf("Hello World{%f}\n", all_opens[1]);
    printf("Hello World{%f}\n", all_opens[2]);
    printf("Hello World{%f}\n", all_opens[3]);

    return 0;
}
