from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
import math
#import helper.readproperties

class TimeSlotCreation(Bolt):

    def initialize(self, conf, ctx):
        #config = ReadProperties()
        #prop = config.getProperties
        # size of slot duration
        self.duration = 5000
        #self.duration = prop["slot_duration"]
        # start time of slot
        self.start_ts = 1427329782738
        #self.start_ts = prop["ts_start"]
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        tweet = tup.values[0]
        # get time stamp value
        ts = int(tweet['ts'])
        self.log( "Duration: %s" % self.duration)
        slot = getTimeSlot(ts , self.start_ts, self.duration)
        txt = tweet['txt']
        # prepare hash to store in redis
        redis_hash = "time_slot:" + str(slot)

        # Calculating start and time time of the slot
        end_time = self.start_ts + self.duration * slot
        start_time = self.start_ts + self.duration * (slot - 1)

        # Initialize slot number, start time, end time field of hash
        self.r.hset(redis_hash, "slot_no", slot)
        self.r.hset(redis_hash, "end_time", end_time)
        self.r.hset(redis_hash, "start_time", start_time)

        self.emit( [slot, txt] )
        self.log( "%s: %s" % (slot, txt) )

def getTimeSlot(ts, start_ts, duration):
    return( (ts - start_ts) // duration + 1 )
        
        

