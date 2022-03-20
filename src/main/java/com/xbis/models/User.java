package com.xbis.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "userid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userid;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "hashedpassword")
    private String hashedPassword;

    @Column(name = "salt")
    private String salt;

    @Column(name = "accesslevel")
    private int accessLevel;

    public User() {
        super();
    }

    public User(long userid, String username, String email, String hashedPassword, String salt) {
        super();
        this.userid = userid;
        this.username = username;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.salt = salt;
        this.accessLevel = 3;           //all users will get access level = 3
    }

    public long getUserid() {
        return userid;
    }

    public void setUserid(long userid) {
        this.userid = userid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public void setAccessLevel(int accessLevel) {
        this.accessLevel = accessLevel;
    }

    public int getAccessLevel() {
        return accessLevel;
    }
}
