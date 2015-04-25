(ns tweetAnalysis
  (:use     [streamparse.specs])
  (:gen-class))

(defn tweetAnalysis [options]
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
      ;; Time series analysis bolts
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

      ;; Geo Spatial Analysis Bolts
      "location-filter-bolt" (python-bolt-spec
          options
          {"mongo-spout" :shuffle}
          "bolts.geo_spatial_tweet_analysis.FiltertMissingLocation"
          ["country_code", "txt"])

      "location-tweet-count" (python-bolt-spec
          options
          {"location-filter-bolt" ["country_code"]}
          "bolts.geo_spatial_tweet_analysis.LocationTweetCount"
          [])

      ;; Top-k Words
      "tweet-split-and-filter-bolt" (python-bolt-spec
          options
          {"time-slot-bolt" :shuffle}
          "bolts.tweet_count.SplitTweetAndFilter"
          ["word"])

      "top-k-bolt" (python-bolt-spec
          options
          {"tweet-split-and-filter-bolt" ["word"]}
          "bolts.tweet_count.TopK"
          [])
    }
  ]
)
