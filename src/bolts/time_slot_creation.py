from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
import math
from helper.readproperties import ReadProperties

class TimeSlotCreation(Bolt):
    """ This bolt generates time slots for the tweets ans stores the hash into the redis store"""
    def initialize(self, conf, ctx):
        # Getting the prperties file as a dictionary
        config = ReadProperties()
        self.props = config.getProperties()
        # size of slot duration
        self.duration = int(self.props['slot_duration'])
        # start time of slot
        self.start_ts = int(self.props['ts_start'])
        # Initialize redis client
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        txt = tup.values[0]
        ts = int(tup.values[1])
        tz = tup.values[2]
        c_code = tup.values[3]

        slot = getTimeSlot(ts , self.start_ts, self.duration)

        # Creating a list of all timeslots and storing into redis store
        redis_list = "cricinfo"

        # prepare hash to store in redis
        redis_hash = "time_slot:" + str(slot)

        # All the timeslot to the list, delete if already exists and add again
        self.r.lrem(redis_list, -1, redis_hash)
        self.r.lpush(redis_list, redis_hash)

        # Calculating start and time time of the slot
        end_time = self.start_ts + self.duration * slot
        start_time = self.start_ts + self.duration * (slot - 1)

        # Initialize slot number, start time, end time field of hash
        self.r.hset(redis_hash, "slot_no", slot)
        self.r.hset(redis_hash, "end_ts", end_time)
        self.r.hset(redis_hash, "str_ts", start_time)
        #self.r.hset(redis_hash, "t_count", 0)

        self.emit( [slot, txt] )
        self.log( "%s: %s" % (slot, txt) )

def getTimeSlot(ts, start_ts, duration):
    # Generates a slot number based on the timestamp and duration
    return( (ts - start_ts) // duration + 1 )