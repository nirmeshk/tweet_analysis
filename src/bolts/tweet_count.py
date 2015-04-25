from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
from helper.cmsketch import Sketch
from helper.readproperties import ReadStopWords

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

class SplitTweetAndFilter(Bolt):
    """ This Bolt will split the sentence and remove all the stop-words"""

    def initialize(self, conf, ctx):
        sw = ReadStopWords()
        self.stop_words = sw.getStopWords()
        

    def process(self, tup):
        tweet = tup.values[0]
        txt = tweet['txt']

        #Filter stop words
        words = txt.split(' ')
        filtered_words = []

        for w in words:
            if w not in self.stop_words:
                filtered_words.append(w)
        
        words = [[word] for word in filtered_words if word]
        if not words:
            # no words to process in the sentence, fail the tuple
            self.fail(tup)
            return
        #self.log(words)
        self.emit_many(words)


class TopK(Bolt):
    """
    This bolt will update Top K words to find trending topics at a given time. 
    We use two data structures to implement topk: 
    - Using countmin sketch for maintaining the frequency of each word and finding top-k
    - Using Redis to store top-k in sorted sets
    """

    def initialize(self, conf, ctx):
        #pass
        self.r = redis.Redis(host='localhost', port=6379, db=0)
        self.k = 50 #k value for topK
        
        #Initialize count Min Sketch
        self.sketch = Sketch(10**-7, 0.005, self.k)

    def process(self, tup):
        word = tup.values[0]
        self.log("Topk: %s" % word)
        #Add the word to count min sketch sketch.
        self.sketch.update(word, 1)

        #If total words in top-k less than freq, add the word directly
        if self.r.zcount("top-k", "-inf", "+inf") < self.k:
            self.r.zadd("top-k", word, self.sketch.get(word))
        else:
            w, freq = self.r.zrange("top-k", -1, -1, withscores= True)[0]

            #If word freq is higher than least freq of top-k list
            #Replace the word by current word
            if freq and freq < self.sketch.get(word):
                self.r.zrem("top-k", w)
                self.r.zadd("top-k", word, self.sketch.get(word))