# coding=utf-8

"""This module, text_sender.py, contains the utility to send text messages."""

import smtplib
import sys
#import requests

import os
if '/home/git_repos/quasar_source/' not in sys.path:
    sys.path.append('/home/git_repos/quasar_source/')


# Useful file + directory operations.
from quasar_source_code.universal_code import useful_file_operations as ufo
# Contains useful paths needed.
from quasar_source_code.universal_code import path_manager as pm

# TODO : Research and look into Twilio.


def get_cell_phone_address(provider, cell_number):
    return cell_carriers_dictionary[provider].replace('number', cell_number)


cell_carriers_dictionary = {'None/Don\'t Track This' : '',
							'AT&T'             : 'number@txt.att.net',
                            'T-Mobile'         : 'number@tmomail.net',
                            'Verizon'          : 'number@vtext.com',
                            'Sprint'           : 'number@pm.sprint.com',
                            'Virgin Mobile'    : 'number@vmobl.com',
                            'Tracfone'         : 'number@mmst5.tracfone.com',
                            'Metro PCS'        : 'number@mymetropcs.com',
                            'Boost Mobile'     : 'number@myboostmobile.com',
                            'Cricket'          : 'number@mms.cricketwireless.net',
                            'Ptel'             : 'number@ptel.com',
                            'Republic Wireless': 'number@text.republicwireless.com',
                            'Google Fi'        : 'number@msg.fi.google.com',
                            'Suncom'           : 'number@tms.suncom.com',
                            'Ting'             : 'number@message.ting.com',
                            'U.S. Cellular'    : 'number@email.uscc.net',
                            'Consumer Cellular': 'number@cingularme.com',
                            'C-Spire'          : 'number@cspire1.com',
                            'Page Plus'        : 'number@vtext.com'}


class GMailAccount(object):
    """Abstraction to using the 'NexusServerEmail' email account."""

    def __init__(self):
        self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='sms_sender')
        self.email = self._database_parameters['username']
        self.password = self._database_parameters['password']

        print('LOGGING IN WITH THE EMAIL : ' + str(self.email))

        self.server = 'smtp.gmail.com'
        self.port = 587
        self.session = smtplib.SMTP(self.server, self.port)
        self.session.ehlo()
        self.session.starttls()
        self.session.ehlo()
        self.session.login(self.email, self.password)

    def send_message(self, subject, body, email_to_send_to):
        """Sends an SMS message. This could be an email or even a text message."""
        try:
            headers = ['From: ' + self.email,
                'Subject: ' + subject,
                'To: ' + email_to_send_to,
                'MIME-Version: 1.0',
                'Content-Type: text/html']
            headers = '\r\n'.join(headers)
            self.session.sendmail(
                self.email,
                email_to_send_to,
                headers + '\r\n\r\n' + body)
        except Exception as e:
            print('ERORR! : could not send the sms message! Exception was :')
            print(e)

email_sender = GMailAccount()

arguments = sys.argv[1:]

if len(arguments) == 2:
    print('Sending the text message of {' + str(arguments[0]) + '} to ' + str(arguments[1]))
    email_sender.send_message('can_you_see_this_subject', arguments[0], arguments[1])
else:
    print('Invalid arguments! They were : {' + str(arguments) + '}')

