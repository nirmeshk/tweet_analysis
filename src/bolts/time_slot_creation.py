from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import math
import helper.readproperties

class TimeSlotCreation(Bolt):

    def initialize(self, conf, ctx):
        config = ReadProperties()
        prop = config.getProperties
        # size of slot duration
        #self.duration = 5000
        self.duration = prop["slot_duration"]
        # start time of slot
        #self.start_ts = 1427329782738
        self.start_ts = prop["ts_start"]

    def process(self, tup):
        tweet = tup.values[0]
        # get time stamp value
        ts = int(tweet['ts'])
        self.log( "Duration: %s" % self.duration)
        slot = getTimeSlot(ts , self.start_ts, self.duration)
        txt = tweet['txt']
        self.emit( [slot, txt] )
        self.log( "%s: %s" % (slot, txt) )

def getTimeSlot(ts, start_ts, duration):
    return( (ts - start_ts) // duration + 1 )
        
        

