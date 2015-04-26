apt-get update 
apt-get update 
echo Y | apt-get install python-pip
apt-get install wget -y
# Installing Java
apt-get install openjdk-7-jdk -y

#Installing leign
wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
mv lein /bin/
chmod a+x /bin/lein
lein -version

# Install virtual-env, git 
pip install virtualenv
apt-get install python-dev -y
pip install streamparse

# Install MongoDB
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
apt-get update
apt-get install -y mongodb-org
service mongod start

#Install Redis
cd ~
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd src
make install
redis-server &
cd ~

service mongod start &

#Install all python dependencies
#cd ~/tweet_analysis/
#pip install -r requirements.txt
#cd ~
#mongoimport --db twitterstream --collection cwctweets --file tweet_analysis/data/cwctweets.json