<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<div id="welcomeTitle"><h>Welcome to MovieRama!</h></div>
</head>
<body>
	<div id="welcome">
		<button id="loginButton" type="button"><a href="login">Login</a></button>
		<br/>
		<br/>
		or
		<br/>
		<br/>
		<button id="registerButton" type="button"><a href="register">Register</a></button>
	</div>

</body>
</html>