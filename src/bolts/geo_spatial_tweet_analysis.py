from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
from iso3166 import countries

class FiltertMissingLocation(Bolt):
    """ This Bolt will filter out all the tweets where location is absent"""

    def initialize(self, conf, ctx):
        pass

    def process(self, tup):
        tweet = tup.values[0]

        # Emit only if country code and txt is present in tweet
        if ("c_code" in tweet) and ("txt" in tweet):
            txt = tweet['txt']
            country_code = tweet['c_code']
            self.emit([country_code, txt])


class LocationTweetCount(Bolt):
    """ This Bolt will count the number of tweets received based on country"""

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        country_code = countries.get(tup.values[0]).alpha3
        txt = tup.values[1]

        redis_hash = "country:" + country_code

        # Increment "tweet_count" field of hash
        self.r.hincrby(redis_hash, "tweet_count", 1)


        
        
        
        

