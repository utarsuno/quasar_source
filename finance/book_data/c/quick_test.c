#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int main(int argc, char * argv[]) {

    sleep(5);
    printf("This is the output from program{%s}!\n", argv[1]);

    return 0;
}