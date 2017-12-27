// Library for standard input/output operations.
#include <stdio.h>
// #include <stdlib.h>
// Library that includes sleep().
#include <unistd.h>

#define EXIT_SUCCESS 77

int main(int argc, char * argv[]) {

    // Sleep for n seconds.
    sleep(2);

    printf("Hello World\n");

    return EXIT_SUCCESS;
}
