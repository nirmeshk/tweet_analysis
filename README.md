# GeoSpatial and Time series Analysis of Twitter data

#### Development Enviornment
OS: Ubuntu 14.04.1 LTS (Codename: trusty) on 64-bit machine 


#### Data Format for redis storage

##### Time Series
- Using (hash)[http://redis.io/commands/hincrby] data structure of redis. 
- Hash key will be of format `time_slot:12` , `time_slot:27` ; where 12 and 27 and bin numbers.
- A hash has multiple "fields" which we will use to store summary for particular bin.
  - `tweet_count`: count of tweets received in this particular slot
  - `sentiment_pos` : positive sentiment count in this bin 
  - `sentiment_neg` : negative sentiment count in this bin 



#### Project Setup:

1. JDK 7+, which you can install with apt-get, homebrew, or an installler; and
2. lein, which you can install from the [project’s page](http://leiningen.org/)
   ```
   a) wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
   b) sudo mv lein /bin/
   c) chmod a+x /bin/lein
   d) lein -version
   ```
   It should print `Leiningen 2.5.1 on Java 1.7.0_65 OpenJDK 64-Bit Server VM` once successfully installed.

3. Python 2.7 along with compatible pip installer. If incompatible run following command to upgrade pip.  
  ```
    sudo apt-get install python-pip
  ```
4. Install Virtual Env
   ```
   sudo pip install virtualenv
   ```
5. Setup python virtualenv for project dependencies:
 ```
    virtualenv --python=python2.7 --no-site-packages project_env
 ```
 
6. Run `source project_env/bin/activate` . Now your bash prompt should begin with 
`(project_env) user@user_machine$ `
7. clone the project `git clone https://github.ncsu.edu/nbkhande/tweet_analysis_v1.git`
8. `cd tweet_analysis_v1`
9. sudo pip install -r requirements.txt
10. Make sure your mongoDB server is up and running
11. Run `sparse run` in order to run the topology on local.
12. Once the project work is done, you can dissconnect from virtualenv by running `deactivate`.

13. Install redis server 
  ```
  sudo apt-get install redis-server
  ```

References:

[1] [Stream Parse](https://github.com/Parsely/streamparse) for easy integration on Python with Storm.

[2] [Virtual Env] (https://virtualenv.pypa.io/en/latest/) tool to create isolate environment for python project.
