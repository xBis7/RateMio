package com.xbis.daos;

import com.xbis.models.Request;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RequestDAOImpl implements RequestDAO {

  @Autowired
  private SessionFactory sessionFactory;

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public List<Request> getAllRequests() {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT r.requestid, r.sender.userid, r.reqtype FROM Request r";
    Query query = session.createQuery(sqlQuery);
    List <Request> requestList = query.getResultList();

    return requestList;
  }

  @Override
  public List<Request> getAllAccessRequests() {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT r.requestid, r.sender.userid, r.sender.username, r.reqtype" +
        " FROM Request r WHERE r.reqtype = 'access'";
    Query query = session.createQuery(sqlQuery);
    List <Request> requestList = query.getResultList();

    return requestList;
  }

  @Override
  public List<Request> getAllSenderRequests(long senderId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT r.requestid, r.sender.userid, r.reqtype FROM Request r " +
        "WHERE r.sender.userid = :senderid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("senderid", senderId);
    List<Request> list = query.getResultList();
    return list;
  }

  @Override
  public Request getRequest(long requestId) {
    Session session = this.sessionFactory.getCurrentSession();
    Request request = (Request) session.get(Request.class, requestId);
    return request;
  }

  @Override
  public Request addRequest(Request request) {
    Session session = this.sessionFactory.getCurrentSession();
    session.persist(request);
    return request;
  }

  @Override
  public boolean deleteRequest(long requestId) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(Request.class, requestId);
    if (persistentIns != null) {
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}
