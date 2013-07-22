<h3>JavaScript Templates</h3>
<div id="<%=emplid%>">
		<a href="#app/tabs/templates/tpl:list">Switch Template</a>
		<table style="width:80%; margin:10px auto; ">
			<thead>
				<tr>
					<th style="border-bottom: 1px solid #DDDDDD;">NUID</th>
					<th style="border-bottom: 1px solid #DDDDDD;">NAME</th>
					<th style="border-bottom: 1px solid #DDDDDD;">OFFICE</th>
					<th style="border-bottom: 1px solid #DDDDDD;">EMAIL</th>
					<th style="border-bottom: 1px solid #DDDDDD;">TITLE</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><%=emplid%></td>
					<td><%=name%></td>
					<td><%=office%></td>
					<td><%=email%></td>
					<td><%=title%></td>
				</tr>
		</table>
	</div>