package com.xbis.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @Column(name = "reviewid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long reviewId;

    @ManyToOne
    @JoinColumn(name = "reviewerid")
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    @Column(name = "communication")
    private int communication;

    @Column(name = "productivity")
    private int productivity;

    @Column(name = "efficiency")
    private int efficiency;

    @Column(name = "openess")
    private int openess;

    @Column(name = "balance")
    private int balance;

    public Review() {
        super();
    }

    public Review(long reviewId, User reviewer, User user, int communication, int efficiency, int openess, int balance) {
        super();
        this.reviewId = reviewId;
        this.reviewer = reviewer;
        this.user = user;
        this.communication = communication;
        this.efficiency = efficiency;
        this.openess = openess;
        this.balance = balance;
    }

    public long getReviewId() {
        return reviewId;
    }

    public void setReviewId(long reviewId) {
        this.reviewId = reviewId;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getCommunication() {
        return communication;
    }

    public void setCommunication(int communication) {
        this.communication = communication;
    }

    public int getProductivity() {
        return productivity;
    }

    public void setProductivity(int productivity) {
        this.productivity = productivity;
    }

    public int getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(int efficiency) {
        this.efficiency = efficiency;
    }

    public int getOpeness() {
        return openess;
    }

    public void setOpeness(int openess) {
        this.openess = openess;
    }

    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }
}
