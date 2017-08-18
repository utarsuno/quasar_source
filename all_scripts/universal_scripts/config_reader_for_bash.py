# coding=utf-8

"""This module, config_reader_for_bash.py, is an utility script to be called by bash scripts to read configuration values from .ini files."""

# Original source code from user 4dummies at https://stackoverflow.com/questions/6318809/how-do-i-grab-an-ini-value-within-a-shell-script

import configparser
import argparse

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description='A program that Bash can call to parse an .ini file')
	parser.add_argument('inifile', help='name of the .ini file')
	parser.add_argument('section', help='name of the section in the .ini file')
	parser.add_argument('itemname', help='name of the desired value')
	args = parser.parse_args()

	config = configparser.ConfigParser()
	config.read(args.inifile)
	print(config.get(args.section, args.itemname))

# Example usage : value=$(python3 config_reader_for_bash.py config.ini section_name value_name)
