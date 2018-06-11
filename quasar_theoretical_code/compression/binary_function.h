typedef struct {
    float c0;
    float c1;
    float c2;
    float s0;
    float s1;
    float s2;
} BinaryFunction;

extern BinaryFunction * get_new_binary_function(const float c0, const float c1, const float c2, const float s0, const float s1, const float s2);
extern void set_binary_function(BinaryFunction * bf, const float c0, const float c1, const float c2, const float s0, const float s1, const float s2);

extern unsigned char get_binary_value_at_position_00(unsigned long position, BinaryFunction * bf);
extern unsigned char get_binary_value_at_position_01(unsigned long position, BinaryFunction * bf);
extern unsigned char get_binary_value_at_position_02(unsigned long position, BinaryFunction * bf);
extern unsigned char get_binary_value_at_position_03(unsigned long position, BinaryFunction * bf);
extern unsigned char get_binary_value_at_position_04(unsigned long position, BinaryFunction * bf);
extern unsigned char get_binary_value_at_position_05(unsigned long position, BinaryFunction * bf);