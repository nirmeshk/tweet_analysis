
class ReadProperties:
""" This class read the properties file and generates a dictionary from the key value pairs """

    def __init__(self):
        # Initialize an empty dictionary and read the properties file
    	self.properties = {}
        with open("helper/app-config.txt","r") as file1:
            for line in file1:
                key_value = line.split("=")
                self.properties[key_value[0]] = key_value[1]

    def getProperties(self):
        return self.properties

class ReadStopWords:
""" This class read a stop-words file and appends them into a list """
    def __init__(self):
        self.stop_words = []
        with open("helper/stop-words.txt", 'r') as f:
            for word in f:
                self.stop_words.append(word.strip().lower())

    def getStopWords(self):
        return self.stop_words