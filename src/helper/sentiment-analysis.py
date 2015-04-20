__author__ = 'nisarg'

import nltk

#class SentimentAnalysis:

def get_word_features(tweets):
        all_words = []
        for (words, sentiment) in tweets:
          all_words.extend(words)
        wordlist = nltk.FreqDist(all_words)
        word_features = wordlist.keys()
        return word_features

def extract_features(document):
        document_words = set(document)
        features = {}
        for word in word_features:
            features['contains(%s)' % word] = (word in document_words)
        return features



pos_tweets=[]
neg_tweets=[]

with open('training.csv','r') as f:
    for line in f:
        label, text = line.split('\t')
        if label=="1":
            pos_tweets.append((text,'pos'))
        else:
            neg_tweets.append((text,'neg'))

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

tweets = []
for (words, sentiment) in pos_tweets + neg_tweets:
    words_filtered = [e.lower() for e in words.split() if len(e) >= 3]
    tweets.append((words_filtered, sentiment))

#print(tweets)

word_features = get_word_features(tweets)
training_set = nltk.classify.apply_features(extract_features, tweets)
classifier = nltk.NaiveBayesClassifier.train(training_set)


def get_sentiment(tweet):
    sentiment = classifier.classify(extract_features(tweet.split()))
    return(sentiment)


print(get_sentiment("worse day ever"))






