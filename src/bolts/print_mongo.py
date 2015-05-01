from __future__ import absolute_import, print_function, unicode_literals

from collections import Counter
from streamparse.bolt import Bolt


class PrintMongo(Bolt):

    def initialize(self, conf, ctx):
        self.counts = Counter()

    def process(self, tup): 
        txt = tup.values[0]
        ts = tup.values[1]
        tz = tup.values[2]
        c_code = tup.values[3]
        
        self.emit([txt, ts, tz, c_code])
        self.log( "Tweet: %s" % txt )
