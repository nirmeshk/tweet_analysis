sudo apt-get update 
sudo echo Y | apt-get install python-pip

# Installing Java
sudo echo Y | apt-get install python-software-properties
sudo echo Y | apt-get install software-properties-common
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo echo Y | apt-get install oracle-java8-installer -y

#Installing leign
sudo wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
sudo mv lein /bin/
sudo chmod a+x /bin/lein
sudo lein -version

# Install virtual-env, git 
sudo apt-get install git-core -y
sudo pip install virtualenv
sudo apt-get install python-dev -y
sudo pip install streamparse

# Install MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

#Install Redis
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd src
sudo make install

sudo service mongod start
mongoimport --db twitterstream --collection cwctweets --file data/cwctweets.json