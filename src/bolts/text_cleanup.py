from __future__ import absolute_import, print_function, unicode_literals

from streamparse.bolt import Bolt
import re

class TextCleanup(Bolt):

    def initialize(self, conf, ctx):
        pass

    def process(self, tup):
        tweet = tup.values[0]
        txt = tweet['txt'].encode('utf-8')   
        tweet['txt'] = re.sub(r'[^A-Za-z0-9 ]', '', txt)
        self.emit([tweet])
