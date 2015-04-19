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
sudo apt-get install redis-server