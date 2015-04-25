from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
from iso3166 import countries
from textblob import TextBlob

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
        self.r.hincrby(redis_hash, "t_count", 1)
        self.r.hset(redis_hash, "c_code", country_code)
        self.r.hset(redis_hash, "s_pos", 0)
        self.r.hset(redis_hash, "s_neg", 0)
        self.r.hset(redis_hash, "s_neu", 0)

class LocationTweetSentimentCount(Bolt):
    """ This Bolt will count the number of positive/neagtive/neutral sentiment tweets received based on country"""

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        country_code = countries.get(tup.values[0]).alpha3
        txt = tup.values[1]

        redis_hash = "country:" + country_code

        tweet_sent = TextBlob(txt)
        polarity = tweet_sent.sentiment.polarity
        if polarity > 0:
            sentiment = "pos"
        elif polarity == 0:
            sentiment = "neu"
        else:
            sentiment = "neg"

        # create field name For e.g sentiment_pos , sentiment_neg 
        field = "s_" + sentiment

        # Increment "tweet_count" field of hash
        self.r.hincrby(redis_hash, field, 1)
        


        
        
        
        

