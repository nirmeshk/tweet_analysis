from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis

class TweetCount(Bolt):
    """ This Bolt will count the number of tweets received in particular time slot and store it in hash data structure in Redis"""

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        slot = tup.values[0]
        
        # prepare hash to store in redis
        redis_hash = "time_slot:" + str(slot) 

        # Increment "tweet_count" field of hash
        self.r.hincrby(redis_hash, "tweet_count", 1)
        
        

