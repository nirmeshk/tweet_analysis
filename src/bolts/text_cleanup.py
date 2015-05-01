from __future__ import absolute_import, print_function, unicode_literals

from streamparse.bolt import Bolt
import re
import redis

class TextCleanup(Bolt):
""" This bolt takes the tweet text and removes junk characters, converts text to lowercase and transforms it into utf-8 encoding """

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)
        pass

    def process(self, tup):
        tweet = tup.values[0]
        
        # Storing tweets into redis list
        self.r.rpush("Tweets", tweet['txt'])

        txt = tweet['txt'].encode('utf-8') 
        #replace non alphanumeric characters
        txt = re.sub(r'[^A-Za-z0-9 ]', '', txt)
        #suppress multiple spaces to single space 
        txt = txt.strip()
        txt = re.sub('\s+', ' ', txt)
        tweet['txt'] = txt.lower()
        self.emit([tweet])
