#include <stdio.h>

#define SUCCESS 0
#define ERROR   -1

int main(int argc, char * argv[]) {

    printf("Got %d arguments\n", argc);

    FILE * fp = fopen("data.data", "ab+");

    float num;
    if (scanf("%f", & num) != ERROR) {
        fprintf(fp, "%f", num);
    }

    fclose(fp);

    return SUCCESS;
}