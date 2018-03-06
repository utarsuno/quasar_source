#include <stdio.h>

#define SUCCESS 0
#define ERROR   -1

int main(int argc, char * argv[]) {

    printf("Got %d arguments\n", argc);

    FILE * fp = fopen("data2.data", "ab+");

    float num;
    if (scanf("%f", & num) != ERROR) {
        //fprintf(fp, "%f", num);
        fwrite(& num, 1, sizeof(num), fp);
    }

    fclose(fp);

    return SUCCESS;
}