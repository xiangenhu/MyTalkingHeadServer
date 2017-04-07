<% @LANGUAGE="VBSCRIPT"%>
<%
' Sample code: classic-ASP script for reading a persisted set of variables from a Data/userid.text file.
' TODO: Create a subdirectory named Data with read/write privileges for IUSR.
userid = Request.QueryString("userid")
callback = Request.QueryString("callback")
set fso = CreateObject("Scripting.FileSystemObject")
file = Server.MapPath("Data/" & userid & ".txt")
data = "{}"
if fso.FileExists(file) then
  set ts = fso.OpenTextFile(file, 1)
  data = ts.ReadAll
  ts.Close
  data = Replace(data, "=", ":'")
  data = Replace(data, "&", "',")
  data = "{" & data & "'}"
end if
Response.Write callback & "(" & data & ")"
%>