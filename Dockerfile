FROM ubuntu:trusty
MAINTAINER Nirmesh Khandelwal <nbkhande@ncsu.edu>
RUN apt-get update 
RUN echo Y | apt-get install python-pip
RUN apt-get install wget -y
# Installing Java
RUN apt-get install openjdk-7-jdk -y

#Installing leign
RUN wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
RUN mv lein /bin/
RUN chmod a+x /bin/lein
RUN lein -version

ADD . /code
WORKDIR /code

# Install virtual-env, git 
RUN apt-get install git-core -y
RUN pip install virtualenv
RUN apt-get install python-dev -y
RUN pip install streamparse
RUN pip install -r requirements.txt


