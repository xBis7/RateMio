package com.xbis.services;

import com.xbis.models.Request;

import java.util.List;

public interface RequestService {

  public List<Request> getAllRequests();

  public List<Request> getAllUserRequests(long userId);

  public Request getRequest(long requestId);

  public Request addRequest(Request request);

  public boolean deleteRequest(long requestId);
}
