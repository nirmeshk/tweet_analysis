__author__ = 'nisarg'

import nltk


class SentimentAnalysis:

    def __init__(self):
        tweets = []
        with open('training.csv','r') as f:
            for line in f:
                label, text = line.split('\t')
                if label=="1":
                    tweets.append((text,'pos'))
                else:
                    tweets.append((text,'neg'))

        new_tweet = []

        for (words, sentiment) in tweets:
            words_filtered = [e.lower() for e in words.split() if len(e) >= 3]
            new_tweet.append((words_filtered, sentiment))

        self.word_features = SentimentAnalysis.get_word_features(self, new_tweet)

        print(new_tweet)
        #training_set = [ print(x) for x in new_tweet ] 
        #classifier = nltk.NaiveBayesClassifier.train(training_set)

    def get_sentiment(self, tweet):
        feature = SentimentAnalysis.extract_features(tweet.split())
        sentiment = self.classifier.classify()
        return(sentiment)

    def get_word_features(self, tweets):
            all_words = []
            for (words, sentiment) in tweets:
              all_words.extend(words)
            wordlist = nltk.FreqDist(all_words)
            word_features = wordlist.keys()
            return(word_features)

    def extract_features(self, document):
            document_words = set(document)
            features = {}
            for word in self.word_features:
                features['contains(%s)' % word] = (word in document_words)
            return(features)

if __name__ == '__main__':
    s = SentimentAnalysis()
    print(s.get_sentiment("worse day ever"))