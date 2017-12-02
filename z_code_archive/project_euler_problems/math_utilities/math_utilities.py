# coding=utf-8

"""This module, math_utilities.py, defines a bunch of useful math functions.
"""

# Gotten from : https://blog.dreamshire.com/project-euler-41-solution/
def is_prime(n):
    if n <= 1: return False
    if n <= 3: return True
    if n%2==0 or n%3 == 0: return False
    r = int(n**0.5)
    f = 5
    while f <= r:
        if n%f == 0 or n%(f+2) == 0: return False
        f+= 6
    return True


# Gotten from : http://stackoverflow.com/questions/15285534/isprime-function-for-python-language
def is_prime2(n):
	if n == 2 or n == 3:
		return True
	if n < 2 or n % 2 == 0:
		return False
	if n < 9:
		return True
	if n % 3 == 0:
		return False
	r = int(n ** 0.5)
	f = 5
	while f <= r:
		if n % f == 0:
			return False
		if n % (f + 2) == 0:
			return False
		f += 6
	return True


def get_primes_below_n(n):
	primes = [2]
	index = 3
	last_prime = 2
	while last_prime < n:
		if is_prime(index):
			primes.append(index)
			last_prime = index
		index += 2
	return primes[:-1]


def get_primes_below_n_as_set(n):
	prime_set = set()
	primes    = get_primes_below_n(n)
	for p in primes:
		prime_set.add(p)
	return primes


def has_no_repeating_digits(s) -> bool:
	"""Checks if the provided 's' (number of string representation of a number) has any repeating characters.
	:param s : The number of string representation of that number.
	:return  : Boolean indicating if the provided 's' has repeating digits or not."""
	return len(str(s)) == len(set(str(s)))


def is_pandigital(n) -> bool:
	"""Checks if a number uses all the digits 1 through n exactly once.
	:param n : The number to check.
	:return  : Boolean indicating if the number 'n' provided is pandigital or not."""
	values = {'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0}
	for c in str(n):
		values[c] += 1
	for v in values.values():
		if v != 1 and v != 0:
			return False
	return True


def is_palindrome(number):
	n = str(number)
	if len(n) % 2 == 0:
		return n[0:int(len(n) / 2)] == n[int(len(n) / 2):len(n)][::-1]
	else:
		return n[0:len(n) // 2] == n[len(n) // 2 + 1:len(n)]
