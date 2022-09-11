drop database if exists ratemiodb;
create database ratemiodb;
create user ratemiouser with encrypted password 'postgres' superuser;
grant all privileges on database ratemiodb to ratemiouser;
\c ratemiodb postgres;

create table users (
    userid bigint generated by default as identity,
    username varchar(255) not null unique,
    email varchar(255) not null,
    hashedpassword varchar(255) not null,
    salt varchar(1024),
    accesslevel int default 3,
    primary key (userid)
);

create table requests (
    requestid bigint generated by default as identity,
    receiverid bigint,
    senderid bigint,
    reqtype varchar(255) not null,
    primary key (requestid),
    foreign key (receiverid) references users(userid),
    foreign key (senderid) references users(userid)
);

create table activities (
    activityid bigint generated by default as identity,
    ownerid bigint,
    activityname varchar(255) not null unique,
    membernum int default 0,
    teamnum int default 0,
    primary key (activityid),
    foreign key (ownerid) references users(userid)
);

create table activity_members (
    memberid bigint generated by default as identity,
    userid bigint NOT NULL,
    activityid bigint NOT NULL,
    primary key (memberid),
    foreign key (userid) references users(userid),
    foreign key (activityid) references activities(activityid),
    unique (userid, activityid)
);

create table pending_reviews (
    reviewid bigint generated by default as identity,
    reviewerid bigint,
    reviewedid bigint,
    activityid bigint,
    primary key (reviewid),
    foreign key (reviewerid) references users(userid),
    foreign key (reviewedid) references users(userid),
    foreign key (activityid) references activities(activityid),
    unique (reviewerid, reviewedid, activityid)
);

create table reviews (
    reviewid bigint generated by default as identity,
    reviewerid bigint,
    reviewedid bigint,
    activityid bigint,
    quality int default 3,
    collaboration int default 3,
    preference varchar(255) default 'neutral',
    primary key (reviewid),
    foreign key (reviewerid) references users(userid),
    foreign key (reviewedid) references users(userid),
    foreign key (activityid) references activities(activityid),
    unique (reviewerid, reviewedid, activityid)
);
