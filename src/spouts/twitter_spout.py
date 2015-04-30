from __future__ import absolute_import, print_function, unicode_literals

import itertools
from streamparse.spout import Spout
import twitter
import os

class RealTimeTwitterSpout(Spout):

    def initialize(self, stormconf, context):
        api = twitter.Api(consumer_key=os.environ['TWITTER_CONSUMER_KEY'],
                          consumer_secret=os.environ['TWITTER_CONSUMER_SECRET'],
                          access_token_key=os.environ['TWITTER_ACCESS_TOKEN'],
                          access_token_secret=os.environ['TWITTER_ACCESS_SECRET'])
        track_words = ["earthquake"]
        self.tweets = api.GetStreamFilter(track=track_words)


    def next_tuple(self): 
        tweet_obj = self.tweets["tweet"]
        self.emit( [tweet_obj] )
