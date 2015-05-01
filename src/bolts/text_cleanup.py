from __future__ import absolute_import, print_function, unicode_literals

from streamparse.bolt import Bolt
import re
import redis

class TextCleanup(Bolt):

    def initialize(self, conf, ctx):
        self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def process(self, tup):
        #["txt", "ts", "tz", "c_code"]
        txt = tup.values[0].encode('utf-8')
        ts = tup.values[1]
        tz = tup.values[2]
        c_code = tup.values[3]

        #Storing tweets into redis list
        self.r.rpush("Tweets", txt)
        #replace non alphanumeric characters
        txt = re.sub(r'[^A-Za-z0-9 ]', '', txt)
        ###suppress multiple spaces to single space 
        txt = txt.strip()
        txt = re.sub('\s+', ' ', txt)
        txt = txt.lower()
        #Remove links and url from the tweet text
        txt = re.sub('(http)\w+', '', txt)
        txt = re.sub('(www)\w+', '', txt)

        self.emit([txt, ts, tz, c_code])