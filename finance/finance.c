// Library for standard input/output operations.
#include <stdio.h>
// #include <stdlib.h>
// Library that includes sleep().
#include <unistd.h>

int main(int argc, char * argv[]) {

	printf("%s\n", argv);

	float * nums = (float *) argv[1];

    printf("Hello World{%f}\n", nums[0]);
    printf("Hello World{%f}\n", nums[1]);
    printf("Hello World{%f}\n", nums[2]);
    printf("Hello World{%f}\n", nums[3]);

    return 0;
}
