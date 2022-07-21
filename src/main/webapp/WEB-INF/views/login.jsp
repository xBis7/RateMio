

<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html>

<head>
	<link rel="stylesheet" type="text/css" href="resources/style.css">
	<h>RateMio</h>
</head>

<body>
	<h2>Login form</h2>

	<form action="userAuth" commandName="user">
	<table>
		<tr>
			<td>Username:</td>
		</tr>
		<tr>
			<td><input type="text" name="username" /> </td>
        </tr>
        <tr>
			<td>Password:</td>
		</tr>
		<tr>
			<td><input type="password" name="password" /> </td>
		</tr>
		<tr>
			<td><input type="submit" value="Login" /> </td>
		</tr>
	</table>
	</form>
</body>

</html>