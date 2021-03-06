from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
#from helper.sentiment-analysis import SentimentAnalysis
from textblob import TextBlob

class Sentiment(Bolt):
    """ This Bolt will calculate sentiment of tweet text in particular time slot and store it in hash data structure in Redis"""

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)
        
    def process(self, tup):
        slot = tup.values[0]
        txt = tup.values[1]

        #calculate sentiment of txt
        #sentiment = self.s.get_sentiment(txt)
    	tweet_sent = TextBlob(txt)
    	polarity = tweet_sent.sentiment.polarity
    	if polarity > 0:
    		sentiment = "pos"
    	elif polarity == 0:
    		sentiment = "neu"
    	else:
    		sentiment = "neg"
        
        # prepare hash to store in redis
        redis_hash = "time_slot:" + str(slot)

        # create field name For e.g sentiment_pos , sentiment_neg 
        field = "s_" + sentiment

        # Increment "tweet_count" field of hash
        self.r.hincrby(redis_hash, field, 1)
        
        

