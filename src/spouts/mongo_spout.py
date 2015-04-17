from __future__ import absolute_import, print_function, unicode_literals

import itertools
from streamparse.spout import Spout
from pymongo import MongoClient


class MongoSpout(Spout):

    def initialize(self, stormconf, context):
        client = MongoClient()
        db = client.twitterstream
        #initialize cursor
        self.tweets = db.cwctweets.find()

    def next_tuple(self): 
        #get tweet from mongoDb and emit it
        tweet_obj = self.tweets.next()["tweet"]
        self.emit( [tweet_obj] )
