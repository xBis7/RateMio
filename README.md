# RateMio
Platform for reviewing teammates and collaborators.

## Functionality

People often find themselves working in teams or collaborating with others 
whether that's in a working environment or in a school or during a game or sport.

Many times people rate this collaboration with the goal to make it as productive as it should be.

RateMio is a full stack web app created to facilitate this process. 

There are three types of users. There is only one admin, who controls everything. 
There are superusers which represent team leaders, who can create activities and control all operations related to them.
Finally, there are simple users whose only ability is to review others.

Every new user registered to the system has same access level as a simple user. That new user can request more access 
privileges from the admin. After the admin grants the access privileges, then this user can create a new activity, 
add other users to it and then split them into teams. Following, he can request all members of every team to review 
their teammates. The activity owner can also submit the reviews himself, in place of the users. 
Once all reviews are submitted, either by the activity owner or the users, then the activity owner can request 
new team suggestions from the system. The system gets all the reviews, processes the 
data and prints the new team suggestions.

Currently, the app supports only 2 teams of 2 members each.

## Development Env & Tech Stack
```
OS:             Ubuntu 22.04 
Java IDE:       Intellij IDE
Code editor:    VSCode
```

### Back-End

Tech Stack: Java, Maven, Spring MVC, Hibernate, JPA

### Front-End

Tech Stack: ReactJs, Axios

### Database

PostgreSQL

```
    users
    -------
    userid                      id
    username                    unique username
    email                       email
    password                    hashed password
    salt                        unique salt used to create password hash
    accesslevel                 1, 2, 3


user access levels

    3 -> user 
    
    2 -> super user

    1 -> admin
    
    all users start by default by level 3, we will manually add an admin 
    and then using admin we will assign level 2 privileges to other users

==========================================================================================

    activity_members
    -----
    userid                      
    activityid
    
==========================================================================================
    
    activities
    -----
    activityid                  id
    ownerid                     id of superuser that created the activity
    activityname                unique name
    membernum                   number of users in the activity
    teamnum                     number of teams (not used for now)

==========================================================================================

    reviews
    -----
    reviewid                    id
    reviewerid                  id of the user providing the review 
    reviewedid                  id of the user getting reviewed
    activityid                  id of the activity the users belong
    quality                     1-5
    collaboration               1-5
    preference                  'yes', 'no', 'neutral'

==========================================================================================

    requests
    -----
    requestid
    receiverid                  id of the user getting the request
    senderid                    id of the user creating the request
    type                        right now only 'access', keeping it like that for future proof

some more details about requests

    receiverid      |     senderid
    -----           |     -----
    admin           |     wants access

==========================================================================================

    pending_reviews
    -----
    reviewid
    reviewerid                  id of the user that needs to file a review
    reviewedid                  id of the user that needs to be reviewed
    activityid                  id of the activity they belong
    unique (receiverid, senderid, activityid)
```

Connect to the database using ratemio user

```
psql -h localhost -p 5432 -U ratemiouser ratemiodb
    prompts for ratemiouser's password
\conninfo
    ...current db and user info
```

if something goes wrong with the database,
restart the service and then initialize the db

```
sudo systemctl restart postgresql.service
sudo -u postgres psql
postgres=# \i <path to>/initDB.sql
```

## Installation guide

These instructions refer to installing the project and testing it locally. 
In order to recreate a similar project, you will need some extra steps that are missing from this guide.
<br/>

The development OS was Ubuntu 22.04. The IDE used for Java development was Intellij 
and the code editor used for ReactJs development was VSCode. 
Optionally, providing instructions to install Intellij and VSCode but any other IDE and code editor will do just fine.
The below commands will work for Debian based distros and with a few mods, for any Unix system.


* Git
```
$ sudo apt install git
```

* Java
```
$ java -version
$ sudo apt install openjdk-11-jre-headless
$ javac -version
$ sudo apt install openjdk-11-jdk-headless
```

* Java path
```
$ sudo nano /etc/environment
$ source /etc/environment
$ echo $JAVA_HOME
```

* Maven
```
$ sudo apt install maven
$ mvn -version
```

* config Git for your terminal
```
$ git config --list
$ git config --global user.name "username"
$ git config --global user.email "your email"
```

* PostgreSQL
```
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ sudo apt-get update
$ sudo apt-get -y install postgresql
```

* Intellij IDE
```
$ sudo snap install intellij-idea-community –classic
```

* VSCode
<br/>

Get the .deb package from site
```
$ sudo apt install ./codeXXX.deb
```

* Apache Tomcat
<br/>

[Get binaries code tar](https://tomcat.apache.org/download-90.cgi) and then extract it

```
$ sudo mv <apache dir name> /opt
```

* Initialize the database
```
$ sudo -u postgres psql
$=# \i <path to initDb.sql>
$=# \q
```

* Intellij run configuration
  * File -> Settings… -> Plugins -> Smart Tomcat -> install -> Apply
  * Run -> Edit Configurations… -> Add New Configuration (+) -> Smart Tomcat -> Tomcat server, Configure… -> select tomcat dir -> configure ports -> OK
  * Run the server


* NodeJs npm
```
$ sudo apt install nodejs npm
```

* VSCode config
delete package-lock.json
in frontend root
```
$ npm install
```

You might have to install npm locally, repeat the above command inside `/frontend`

* run client
```
$ npm start
```

* Gurobi optimizer
<br/>

Install gurobi optimizer and extract it under `/opt`
```
$ sudo nano /etc/profile
export GUROBI_HOME="/opt/gurobi952/linux64"
export PATH="${PATH}:${GUROBI_HOME}/bin"
export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${GUROBI_HOME}/lib"
```

Get a license, enter the license on terminal
