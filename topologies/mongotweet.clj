(ns mongoTweet
  (:use     [streamparse.specs])
  (:gen-class))

(defn mongoTweet [options]
   [
    ;; spout configuration
    {"mongo-spout" (python-spout-spec
          options
          "spouts.mongo_spout.MongoSpout"
          ["tweet"]
          )
    }
    
    ;; bolt configuration
    {
      "cleanup-bolt" (python-bolt-spec
          options
          {"mongo-spout" :shuffle}
          "bolts.text_cleanup.TextCleanup"
          ["tweet"])
    
      "print-bolt" (python-bolt-spec
          options
          {"cleanup-bolt" :shuffle}
          "bolts.print_mongo.PrintMongo"
          ["tweet"])

      "time-slot-bolt" (python-bolt-spec
          options
          {"print-bolt" :shuffle}
          "bolts.time_slot_creation.TimeSlotCreation"
          ["slot", "txt"])

      "tweet-count-bolt" (python-bolt-spec
          options
          {"time-slot-bolt" :shuffle}
          "bolts.tweet_count.TweetCount"
          [])

      "tweet-sentiment-bolt" (python-bolt-spec
          options
          {"time-slot-bolt"  ["slot"] }
          "bolts.sentiment.Sentiment"
          [])
    }
  ]
)
