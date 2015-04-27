
class ReadProperties:

    def __init__(self):
    	self.properties = {}
        with open("helper/app-config.txt","r") as file1:
            for line in file1:
                key_value = line.split("=")
                self.properties[key_value[0]] = key_value[1]

    def getProperties(self):
        return self.properties

class ReadStopWords:
    def __init__(self):
        self.stop_words = []
        with open("helper/stop-words.txt", 'r') as f:
            for word in f:
                self.stop_words.append(word.strip().lower())

    def getStopWords(self):
        return self.stop_words