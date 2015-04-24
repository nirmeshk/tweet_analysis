FROM ubuntu:trusty
MAINTAINER Nirmesh Khandelwal <nbkhande@ncsu.edu>
RUN apt-get update 
RUN echo Y | apt-get install python-pip

# Installing Java
RUN echo Y | apt-get install python-software-properties
RUN echo Y | apt-get install software-properties-common
RUN add-apt-repository ppa:webupd8team/java
RUN apt-get update
RUN echo Y | apt-get install oracle-java8-installer -y

#Installing leign
RUN wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
RUN mv lein /bin/
RUN chmod a+x /bin/lein
RUN lein -version

# Install virtual-env, git 
RUN apt-get install git-core -y
RUN pip install virtualenv
RUN apt-get install python-dev -y
RUN pip install streamparse

ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt