#!/usr/bin/env python3
########################################################################
# Filename    : butterfly.py
# Description : Check for unread love notes and control a mechanical butterfly
# Author      : JFining
########################################################################
import RPi.GPIO as GPIO
from time import sleep
import requests
import json

butterflyPin = 11    # define the GPIO pin that controls the transistor
API_GW_URL = "https://2mc31vw11c.execute-api.us-east-1.amazonaws.com/prod/"

def setup():
        print ('Program is starting...')
        GPIO.setmode(GPIO.BOARD)       # Numbers GPIOs by physical location
        GPIO.setup(butterflyPin, GPIO.OUT)   # Set transistor control pin mode to output

def butterfly_high(duration):
        GPIO.output(butterflyPin, GPIO.HIGH)
        sleep(duration)

def butterfly_low(duration):
        GPIO.output(butterflyPin, GPIO.LOW)
        sleep(duration)

def pulse_to_on(total_time_on):
        current_duration = 0
        on_time = .0002
        off_time = .00035
        decay_factor = 2
        on_decayed = on_time
        off_decayed = off_time
        while current_duration < total_time_on:
                butterfly_high(on_decayed)
                butterfly_low(off_decayed)
                current_duration += on_decayed + off_decayed
                on_decayed = on_time * (decay_factor ** (-1.2 * current_duration))
                off_decayed = off_time * (decay_factor ** current_duration)

def flap_n_times(n):
        flap_count = 0
        while flap_count < n:
                pulse_to_on(2)
                butterfly_low(8)
                flap_count += 1

def un_dynamo_note(note):
        new_obj = {}
        for key in note:
                new_obj[key] = note[key]['S']
        return new_obj

def get_all_notes():
        response = requests.request("GET", API_GW_URL)
        items = json.loads(response.text)["Items"]
        notes = []
        for item in items:
                notes.append(un_dynamo_note(item))
        return notes

def find_unread(notes):
        for note in notes:
                # Return True if we find a note that is not acknowledged
                if note["ack"] == 'false':
                        return True
        return False

def destroy():
        print("Destroying resources, stopping script.")
        GPIO.output(butterflyPin, GPIO.LOW)     # butterfly off
        GPIO.cleanup()                     # Release resource

if __name__ == '__main__':
        setup()
        try:
                while(True):
                        notes = get_all_notes()
                        if (find_unread(notes)):
                                flap_n_times(5)
                        sleep(60)
        except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, destroy() will clean up
                destroy()
        except Exception as e: # Just in case anything goes wrong unexpectedly, turn off!
                print(e)
                destroy()

