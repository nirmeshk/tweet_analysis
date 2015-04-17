# GeoSpatial and Time series Analysis of Tweeter data

#### Project Setup:

1. JDK 7+, which you can install with apt-get, homebrew, or an installler; and
2. lein, which you can install from the [project’s page](http://leiningen.org/)
3. Python 2.7 along with compatible pip installer.
4. sudo pip install virtualenv
5. Setup python virtualenv for project dependencies `virtualenv --python=python2.7 --no-site-packages project_env
6. Run `source project_env/bin/activate` . Now your bash prompt should begin with 
`(project_env) user@user_machine$ `
7. clone the project `git clone https://github.ncsu.edu/nbkhande/tweet_analysis_v1.git`
8. `cd tweet_analysis_v1`
9. pip install -r requirements.txt
10. Run `sparse run` in order to run the topology on local.
11. Once the project work is done, you can dissconnect from virtualenv by running `deactivate`.

References:

[1] [Stream Parse](https://github.com/Parsely/streamparse) for easy integration on Python with Storm.

[2] [Virtual Env] (https://virtualenv.pypa.io/en/latest/) tool to create isolate environment for python project.