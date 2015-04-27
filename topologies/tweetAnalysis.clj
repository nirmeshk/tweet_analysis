(ns tweetAnalysis
  (:use     [streamparse.specs])
  (:gen-class))

(defn tweetAnalysis [options]
   [
    ;; spout configuration
    {"mongo-spout" (python-spout-spec
          options
          ;;Fully classified class Name of the Spout
          "spouts.mongo_spout.MongoSpout"
          ;;Output tuple emited by spout
          ;;what named fields will this spout emit
          ["tweet"]
          )
    }
    
    ;; bolt configuration
    {

      ;;;;;;;;;; Time series analysis bolts

      ;;This bolt will perform basic text cleanup of tweet text
      "cleanup-bolt" (python-bolt-spec
          options
          ;;Input specification
          ;;This bolt will receive ip from "mongo-spout" defined above
          ;;Stream grouping is shuffle
          {"mongo-spout" :shuffle}
          ;;class Name of Bolt
          "bolts.text_cleanup.TextCleanup"
          ;;Output field name emitted by this tuple.
          ["tweet"])
    
      ;; Simple bolt that prints tweet txt on stdout
      "print-bolt" (python-bolt-spec
          options
          {"cleanup-bolt" :shuffle}
          "bolts.print_mongo.PrintMongo"
          ["tweet"])

      ;; This Bolt performs binning operation on time. It creates time slots.
      "time-slot-bolt" (python-bolt-spec
          options
          {"print-bolt" :shuffle}
          "bolts.time_slot_creation.TimeSlotCreation"
          ["slot", "txt"])

      ;; Count Number of tweets received in particular time slot
      "tweet-count-bolt" (python-bolt-spec
          options
          {"time-slot-bolt" :shuffle}
          "bolts.tweet_count.TweetCount"
          [])

      ;; Bolt will identify sentiment of tweet text
      "tweet-sentiment-bolt" (python-bolt-spec
          options
          {"time-slot-bolt"  ["slot"] }
          "bolts.sentiment.Sentiment"
          [])



      ;;;;;;;; Geo Spatial Analysis Bolts. 

      ;; Filters tweeets based on location
      "location-filter-bolt" (python-bolt-spec
          options
          {"mongo-spout" :shuffle}
          "bolts.geo_spatial_tweet_analysis.FiltertMissingLocation"
          ["country_code", "txt"])
      
      ;;Aggreagates tweet count based on location
      "location-tweet-count" (python-bolt-spec
          options
          {"location-filter-bolt" ["country_code"]}
          "bolts.geo_spatial_tweet_analysis.LocationTweetCount"
          [])
      
      ;;Identify Sentiment of tweets based on location
      "location-tweet-sentiment-count" (python-bolt-spec
          options
          {"location-filter-bolt" ["country_code"]}
          "bolts.geo_spatial_tweet_analysis.LocationTweetSentimentCount"
          [])

      
      
      ;;;;;;;; Top-k Analysis Bolts

      ;;Split the sentence into words and remove stop-words
      "tweet-split-and-filter-bolt" (python-bolt-spec
          options
          {"cleanup-bolt" :shuffle}
          "bolts.tweet_count.SplitTweetAndFilter" 
          ["words"])
      
      ;;Use Bloom filter and redis to maintain Top-k words
      "top-k-bolt" (python-bolt-spec
          options
          {"tweet-split-and-filter-bolt" ["words"]}
          "bolts.tweet_count.TopK"
          [])
    }
  ]
)
