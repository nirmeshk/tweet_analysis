apt-get update > installation.log 
apt-get install build-essential -y > installation.log

echo "[INFO] Installing Pip, wget..."
apt-get install python-pip -y > installation.log
apt-get install wget -y > installation.log
# Installing Java
echo "[INFO] Installing Java..."
apt-get install openjdk-7-jdk -y > installation.log

#Installing leign
echo "[INFO] Installing Leiningen..."
wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein > installation.log
mv lein /bin/
chmod a+x /bin/lein
export LEIN_ROOT="yes"
echo yes | lein -version > installation.log

apt-get install python-dev -y > installation.log

echo "[INFO] Installing streamparse library..."
pip install streamparse > installation.log

# Install MongoDB
echo "[INFO] Installing MongoDB..."
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 > installation.log
echo "[INFO] deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list > installation.log
apt-get update > installation.log
apt-get install mongodb-org -y > installation.log

echo "[INFO] Install Redis...."
cd ~
wget http://download.redis.io/redis-stable.tar.gz > installation.log
tar xvzf redis-stable.tar.gz > installation.log
cd redis-stable
make > installation.log
cd src
make install > installation.log
redis-server & > installation.log
cd ~
sleep 1

service mongod start & > installation.log
sleep 1

echo "[INFO] Install all python dependencies for project..."
cd ~/tweet_analysis/
pip install -r requirements.txt > installation.log

echo "[INFO] Downloading data from our public repository"
wget https://dl.dropboxusercontent.com/u/25947865/cwcTweets.json
mv cwcTweets.json data/

echo "[INFO] Data Downloaded Successfully "
sleep 1

echo "[INFO] Importing data into mongodb..."
mongoimport --db twitterstream --collection cwctweets --file data/cwctweets.json


echo "[INFO] Installing Nodejs.."
cd
apt-get install curl -y > installation.log
curl -sL https://deb.nodesource.com/setup | bash - > installation.log
apt-get install nodejs -y > installation.log
cd tweet_analysis/dashboard/
npm install > installation.log
