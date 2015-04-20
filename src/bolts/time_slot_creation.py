from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import math

class TimeSlotCreation(Bolt):

    def initialize(self, conf, ctx):
        # size of slot duration
        self.duration = 5000
        # start time of slot
        self.start_ts = 1427329782738

    def process(self, tup):
        tweet = tup.values[0]
        # get time stamp value
        ts = int(tweet['ts'])
        slot = getTimeSlot(ts , self.start_ts, self.duration)
        txt = tweet['txt']
        self.emit( [slot, txt] )
        self.log( "%s: %s" % (slot, txt) )

def getTimeSlot(ts, start_ts, duration):
    return( (ts - start_ts) // duration + 1 )
        
        

