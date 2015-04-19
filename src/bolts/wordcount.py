from __future__ import absolute_import, print_function, unicode_literals

from collections import Counter
from streamparse.bolt import Bolt
import redis


class WordCounter(Bolt):

    def initialize(self, conf, ctx):
        self.counts = Counter()
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        tweet = tup.values[0]
        for word in tweet['txt'].split(' '): 
            self.counts[word] += 1
            #persist the data into redis server.
            self.r.zincrby('word-freq', word, 1.0)

        
        

