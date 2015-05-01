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
        txt = tup.values[0].encode('utf-8')
        ts = tup.values[1]
        tz = tup.values[2]
        c_code = tup.values[3]

        # Emit only if country code and txt is present in tweet
        if c_code and txt:
            self.emit([c_code, txt])
        elif tz and txt:
            try:
                c_code = self.timezone_countries[str(tz)]
                self.emit([c_code, txt])
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
        


        
        
        
        

