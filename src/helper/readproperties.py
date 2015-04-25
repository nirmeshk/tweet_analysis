
class ReadProperties:

    def __init__(self):
    	self.prop = {}
        f = open("app-config.txt","r+")
        for line in f:
            key_value = line.split("=")
            self.prop[key_value[0]] = key_value[1]

    def getProperties(self):
        return self.prop

class ReadStopWords:
    def __init__(self):
        self.stop_words = []
        with open("helper/stop-words.txt", 'r') as f:
            for word in f:
                self.stop_words.append(word.strip().lower())

    def getStopWords(self):
        return self.stop_words