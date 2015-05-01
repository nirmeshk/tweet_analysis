from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
from iso3166 import countries
from textblob import TextBlob
from pytz import country_timezones

class FiltertMissingLocation(Bolt):
    """ This Bolt will filter out all the tweets where location is absent"""

    def initialize(self, conf, ctx):
        # Generating a reverse mapping of the timezone to country
        self.timezone_countries = {str(timezone).split('/')[1]: str(country)
                          for country, timezones in country_timezones.iteritems()
                          for timezone in timezones}
        pass

    def process(self, tup):
        tweet = tup.values[0]

        # Emit only if country code and txt is present in tweet
        if ("c_code" in tweet) and ("txt" in tweet):
            txt = tweet['txt']
            country_code = tweet['c_code']
            self.emit([country_code, txt])
        elif ("tz" in tweet) and ("txt" in tweet):
            try:
                txt = tweet['txt']
                # Getting the country corresponding to the time zone in the tweet object
                timezone = tweet['tz']
                country_code = self.timezone_countries[str(timezone)]
                self.emit([country_code, txt])
            except KeyError:
                pass


class LocationTweetCount(Bolt):
    """ This Bolt will count the number of tweets received based on country"""

    def initialize(self, conf, ctx):
        # Initialize redis client
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        # Converting alpha-2 country codes to alpha-3 
        country_code = countries.get(tup.values[0]).alpha3
        txt = tup.values[1]

        redis_hash = "country:" + country_code

        # Increment "tweet_count" field of hash
        self.r.hincrby(redis_hash, "t_count", 1)
        self.r.hset(redis_hash, "c_code", country_code)


class LocationTweetSentimentCount(Bolt):
    """ This Bolt will count the number of positive/neagtive/neutral sentiment tweets received based on country"""

    def initialize(self, conf, ctx):
        # Initialize redis client
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        # Converting alpha-2 country codes to alpha-3 
        country_code = countries.get(tup.values[0]).alpha3
        txt = tup.values[1]

        redis_hash = "country:" + country_code

        # Getting the polarity of the tweet text
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
        


        
        
        
        

