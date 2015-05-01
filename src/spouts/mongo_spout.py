from __future__ import absolute_import, print_function, unicode_literals

import itertools
from streamparse.spout import Spout
from pymongo import MongoClient
from helper.readproperties import ReadProperties


class MongoSpout(Spout):

    def initialize(self, stormconf, context):
        """Method will be called once when the spout is initialized. Perform all initialization stuff inside this method"""
        client = MongoClient()
        self.db = client.twitterstream  

        #Load tweets from MongoDB in batch of batch_size
        #Get batch size from config file
        config = ReadProperties()
        self.props = config.getProperties()
        self.batch_size = int(self.props['batch_size'])
        self.batch_no = 0
        self.tweets = None
        
    def next_tuple(self): 

        #get batch_size number of tweet from mongoDb
        self.tweets = self.db.cwctweets.find( 
            projection={'_id': False, 'tweet': True},
            skip=self.batch_no*self.batch_size, 
            limit=self.batch_size, no_cursor_timeout=True)

        #Increment batch size so that whenever the method is called again, we load next batch of tweets from MongoDB.
        self.batch_no += 1

        tup = []

        for t in list(self.tweets):
            tup=[]

            #Extract the fields from Dictionary and prepare tuple ["txt", "ts", "tz", "c_code"] to emit. If field not present, append empty string
            
            if 'txt' in t['tweet']: tup.append(t['tweet']['txt'])
            else: tup.append('')
            
            if 'ts' in t['tweet']: tup.append(t['tweet']['ts'])
            else: tup.append('') 
            
            if 'tz' in t['tweet']: tup.append(t['tweet']['tz']) 
            else: tup.append('') 
            
            if 'c_code' in t['tweet']: tup.append(t['tweet']['c_code']) 
            else: tup.append('') 
            
            self.emit(tup)
           