__author__ = 'nisarg'

import nltk
import csv


class SentimentAnalysis:

    def get_words_in_tweets(tweets, self):
            all_words = []
            for (words, sentiment) in tweets:
              all_words.extend(words)
            return all_words

    def get_word_features(wordlist, self):
            wordlist = nltk.FreqDist(wordlist)
            word_features = wordlist.keys()
            return word_features



    def extract_features(document, self):
            document_words = set(document)
            features = {}
            for word in self.word_features:
                features['contains(%s)' % word] = (word in document_words)
            return features

    def __init__(self):

        self.pos_tweets=[]
        self.neg_tweets=[]

        with open('training.csv','r') as f:
            for line in f:
                label, text = line.split('\t')
                if label=="1":
                    self.pos_tweets.append((text,'pos'))
                else:
                    self.neg_tweets.append((text,'neg'))

        # # The following list contains the positive tweets:
        # self.pos_tweets = [('I love this car', 'pos'),
        #               ('This view is amazing', 'pos'),
        #               ('I feel great this morning', 'pos'),
        #               ('I am so excited about the concert', 'pos'),
        #               ('He is my best friend', 'pos')]
        #
        # # The following list contains the negative tweets:
        # self.neg_tweets = [('I do not like this car', 'neg'),
        #               ('This view is horrible', 'neg'),
        #               ('I feel tired this morning', 'neg'),
        #               ('I am not looking forward to the concert', 'neg'),
        #               ('He is my enemy', 'neg')]
        
        self.tweets = []
        for (words, sentiment) in self.pos_tweets + self.neg_tweets:
            words_filtered = [e.lower() for e in words.split() if len(e) >= 3]
            self.tweets.append((words_filtered, sentiment))

        print(self.tweets)

        self.word_features = self.get_word_features(self.get_words_in_tweets(self.tweets))
        self.training_set = nltk.classify.apply_features(self.extract_features, self.tweets)
        self.classifier = nltk.NaiveBayesClassifier.train(self.training_set)


    def get_sentiment(self, tweet):
        sentiment = self.classifier.classify(self.extract_features(tweet.split()))
        return(sentiment)



s = SentimentAnalysis()
print(s.get_sentiment("we lost the match"))






