from __future__ import absolute_import, print_function, unicode_literals

from streamparse.bolt import Bolt
import re

class TextCleanup(Bolt):

    def initialize(self, conf, ctx):
        pass

    def process(self, tup):
        tweet = tup.values[0]
        txt = tweet['txt'].encode('utf-8') 
        #replace non alphanumeric characters
        txt = re.sub(r'[^A-Za-z0-9 ]', '', txt)
        #suppress multiple spaces to single space 
        txt = txt.strip()
        txt = re.sub('\s+', ' ', txt)
        tweet['txt'] = txt
        self.emit([tweet])
