apt-get update 

echo "Installing Pip, wget .."
apt-get install python-pip -y
apt-get install wget -y
# Installing Java
echo "Installing Java..."
apt-get install openjdk-7-jdk -y

#Installing leign
echo "Installing Leiningen..."
wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
mv lein /bin/
chmod a+x /bin/lein
env LEIN_ROOT=yes
lein -version

apt-get install python-dev -y

echo "Installing streamparse library..."
pip install streamparse

# Install MongoDB
echo "Installing MongoDB.."
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
apt-get update
apt-get install -y mongodb-org
service mongod start

echo "Install Redis...."
cd ~
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd src
make install
redis-server &
cd ~
sleep 1

service mongod start &
sleep 1

echo "Install all python dependencies for project.."
cd ~/tweet_analysis/
pip install -r requirements.txt

echo "Importing data into mongodb..."
mongoimport --db twitterstream --collection cwctweets --file data/cwctweets.json