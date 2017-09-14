# TODO : Get part 1

def dna_analysis(dna_sequence):

	# Part 2a.
	print('The total length of the gene is', len(dna_sequence) / 2)

	# Part 2b.
	a = dna_sequence.count('a')
	c = dna_sequence.count('c')
	t = dna_sequence.count('t')
	g = dna_sequence.count('g')
	print('There are ' + str(a) + " A's")
	print('There are ' + str(t) + " T's")
	print('There are ' + str(g) + " G's")
	print('There are ' + str(c) + " C's")

	# Part 2c.
	a_percentage = a / len(dna_sequence)
	c_percentage = c / len(dna_sequence)
	t_percentage = t / len(dna_sequence)
	g_percentage = g / len(dna_sequence)
	print('%A = [' + str(a_percentage) + ']')
	print('%C = [' + str(c_percentage) + ']')
	print('%T = [' + str(t_percentage) + ']')
	print('%G = [' + str(g_percentage) + ']')

	# Part 2d.
	print('There are ' + str(round(len(dna_sequence) / 3)) + ' amino acids produced by the DNA sequence.')

#dna_analysis('acatcgatgcattagcgtatgcatactgacgtcatacgactacgcatactacgcagatcgatgatg')


# Append each line with '<type3> '
data = '''<func>Local
<func>LocalArray[N]
* <func>LocalPtr
<func>InitLocal = N
<func>InitLocalArray[N] = {N}
* <func>InitLocalPtr = & <func>InitLocal;'''

# Append each line with 'static <type4> '
data2 = '''<func>StaticLocal
<func>StaticLocalArray[N]
* <func>StaticLocalPtr
<func>StaticInitLocal = N
<func>StaticInitLocalArray[N] = {N}
* <func>StaticInitLocalPtr = &
<func>StaticInitLocal;'''

# Append each line with 'char '
data3 = '''<file>Hello[] = "Hello"
* <file>World = "World";'''

# Append each line with '<type1> '
data4 = '''<file>Global
<file>GlobalArray[N]
* <file>GlobalPtr
<file>InitGlobal = N
<file>InitGlobalArray[N] = {N}
* <file>InitGlobalPtr = & <file>InitGlobal;'''

# Append each line with 'static <type2> '
data5 = '''<file>StaticGlobal
<file>StaticGlobalArray[N]
* <file>StaticGlobalPtr
<file>StaticInitGlobal = N
<file>StaticInitGlobalArray[N] = {N}
* <file>StaticInitGlobalPtr = & <file>StaticInitGlobal;'''


def print_data(data, append_text, function_name, file_name):
	for l in data.split('\n'):
		if len(l) > 0:
			text = append_text + l
			text = text.replace('<type1>', 'double').replace('<type2>', 'double').replace('<type3>', 'char').replace('<type4>', 'float').replace('N', '14').replace('<func>', function_name).replace('<file>', file_name)
			if text[-1] != ';':
				text += ';'
			print(text)
	print()

'''
print_data(data3, 'char ', 'global', 'file2')
print_data(data4, '<type1> ', 'global', 'file2')
print_data(data5, 'static <type2> ', 'global', 'file2')
print_data(data3, 'extern char ', 'global', 'file1')
print_data(data4, 'extern <type1> ', 'global', 'file1')
print_data(data5, 'extern static <type2> ', 'global', 'file1')
'''


print_data(data, '\t<type3> ', 'main', 'file1')
print_data(data2, '\t<type4> ', 'main', 'file1')
