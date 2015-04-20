from __future__ import absolute_import, print_function, unicode_literals

from collections import Counter
from streamparse.bolt import Bolt


class PrintMongo(Bolt):

    def initialize(self, conf, ctx):
        self.counts = Counter()

    def process(self, tup):
        tweet = tup.values[0] 
        self.emit([tweet])
        self.log( "Tweet: %s" % tweet['txt'] )
