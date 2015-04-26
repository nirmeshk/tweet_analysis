# GeoSpatial and Time series Analysis of Twitter data

#### Development Enviornment
OS: Ubuntu 14.04.1 LTS (Codename: trusty) on 64-bit machine 

####Project Setup:

- Because of the large number of dependencies, the easiest way to setup this project is to load a fresh `Ubuntu 14.04 Base` image in virtual machine. We have tested the setup on VCL (Ncsu virtual computing Lab) Ubuntu 14.04 Base image. Once your VCL instance is ready:
  -Download the tweet_analysis/ project folder inside $HOME.
  -Run `sudo sh setup.sh` inside project folder.
This will install all the required programs for running the project. 

-Now we need to start storm topology and submit the job. Run `sparse run -t 200` inside project folder. This will automatically start storm instance and submit the topology to storm. `-t` option is used for specifying the run time for topology. So the above command will ensure that topology runs for 200 seconds. 

- Now start the dashboard by running `cd dashboard/ && node app.js`. The live dashboard can be seen at `http://<VCL instance ip>:3000`

####Individual Installation instructions(In case you want to manually install all the dependencies):

- JDK 7+, which you can install with apt-get, homebrew, or an installler; and
- lein, which you can install from the [project’s page](http://leiningen.org/)
   ```
   a) wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
   b) sudo mv lein /bin/
   c) chmod a+x /bin/lein
   d) lein -version
   ```
   It should print `Leiningen 2.5.1 on Java 1.7.0_65 OpenJDK 64-Bit Server VM` once successfully installed.

- Python 2.7 along with compatible pip installer. If incompatible run following command to upgrade pip.  
  ```
    sudo apt-get install python-pip
  ```
- Install Python-dev and Virtual Env
   ```
   sudo pip install -y python-dev virtualenv
   ```
- Install Redis server according according to instruction [here](http://redis.io/topics/quickstart)

- Install MongoDB according to instruction [here](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)

- Clone the project `git clone git@github.com:nirmeshKhandelwal/tweet_analysis.git`

- Install dependencies of Python
  ```
  $ cd tweet_analysis_v1`
  $ sudo pip install -r requirements.txt
  $python2 -m textblob.download_corpora 
  ```

- Make sure your mongoDB server and Redis server is up and running.

- Run `$ sparse run` in order to run the topology on local.


#### Data Format for Redis storage

##### Time Series
- Using [hash](http://redis.io/commands/hincrby) data structure of redis. 
- Hash key will be of format `time_slot:12` , `time_slot:27` ; where 12 and 27 and bin numbers.
- A hash has multiple "fields" which we will use to store summary for particular bin.
  - `tweet_count`: count of tweets received in this particular slot
  - `sentiment_pos` : positive sentiment count in this bin 
  - `sentiment_neg` : negative sentiment count in this bin 

References:

[1] [Stream Parse](https://github.com/Parsely/streamparse) for easy integration on Python with Storm.

[2] [Virtual Env] (https://virtualenv.pypa.io/en/latest/) tool to create isolate environment for python project.