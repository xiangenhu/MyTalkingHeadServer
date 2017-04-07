<% @LANGUAGE="VBSCRIPT"%>
<%
' Sample code: classic-ASP script for persisting a set of variables into a Data/userid.text file.
' TODO: Create a subdirectory named Data with read/write privileges for IUSR.
userid = Request.QueryString("userid")
callback = Request.QueryString("callback")
Data = Request.Form
if Left(Data,5) = "Data=" then Data = Request.Form("Data")
set fso = CreateObject("Scripting.FileSystemObject")
file = Server.MapPath("Data/" & userid & ".txt")
set ts = fso.CreateTextFile(file, 2)
ts.Write Data
ts.Close
Response.Write callback + "({})"
%>