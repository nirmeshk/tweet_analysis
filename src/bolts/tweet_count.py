from __future__ import absolute_import, print_function, unicode_literals, division

from streamparse.bolt import Bolt
import redis
from nltk.corpus import stopwords
from helper.cmsketch import Sketch

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
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        stop_words = stopwords.words('english')

        #slot = tup.values[0]
        txt = tup.values[1]

        #Filter stop words
        filtered_words = [word for word in txt.split(' ') if not word in stop_words]
        
        #remove empty strings
        filtered_words = [word for word in filtered_words if word]

        #Emit the words
        if len(filtered_words) > 0:
            emit_many(filtered_words)


class TopK(Bolt):
    """
    This bolt will update Top K words to find trending topics at a given time. 
    We use two data structures to implement topk: 
    - Using countmin sketch for maintaining the frequency of each word and finding top-k
    - Using Redis to store top-k in sorted sets
    """

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)
        self.k = 50 #k value for topK

        #Initialize count Min Sketch
        self.sketch = Sketch(10**-7, 0.005, self.k)

    def process(self, tup):
        word = tup.values[0]

        #Add the word to count min sketch sketch.
        self.sketch.update(word, 1)
        
        #update the topk heap
        #self.sketch.update_heap(word)

        #update the redis map
        # zrange top-k -1 -1 withscores

        #ZCOUNT myzset -inf +inf

        if self.r.zcount("top-k", "-inf", "+inf") < self.k:
            self.r.zadd("top-k", word, self.sketch.get(word))
        else:
            w, freq = self.r.zrange("top-k", -1, -1, "withscores")

            if freq and freq < self.sketch.get(word):
                self.r.zrem("top-k", w)
                self.r.zadd("top-k", word, self.sketch.get(word))