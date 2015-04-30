apt-get update > installation.log 
apt-get install build-essential -y > installation.log

echo "Installing Pip, wget .."
apt-get install python-pip -y > installation.log
apt-get install wget -y > installation.log
# Installing Java
echo "Installing Java..."
apt-get install openjdk-7-jdk -y > installation.log

#Installing leign
echo "Installing Leiningen..."
wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein > installation.log
mv lein /bin/
chmod a+x /bin/lein
env LEIN_ROOT=yes
yes | lein -version

apt-get install python-dev -y > installation.log

echo "Installing streamparse library..."
pip install streamparse > installation.log

# Install MongoDB
echo "Installing MongoDB.."
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 > installation.log
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list > installation.log
apt-get update > installation.log
apt-get install mongodb-org -y > installation.log

echo "Install Redis...."
cd ~
wget http://download.redis.io/redis-stable.tar.gz > installation.log
tar xvzf redis-stable.tar.gz > installation.log
cd redis-stable
make > installation.log
cd src
make install > installation.log
redis-server &
cd ~
sleep 1

service mongod start &
sleep 1

echo "Install all python dependencies for project.."
cd ~/tweet_analysis/
pip install -r requirements.txt > installation.log

echo "Importing data into mongodb..."
mongoimport --db twitterstream --collection cwctweets --file data/cwctweets.json


echo "Installing Nodejs.."
cd
apt-get install curl -y > installation.log
curl -sL https://deb.nodesource.com/setup | bash - > installation.log
apt-get install nodejs -y > installation.log
cd tweet_analysis/dashboard/
npm install > installation.log
