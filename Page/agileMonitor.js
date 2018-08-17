//敏捷监控页面相关的代码

//敏捷监控模块moduleOne需要定义的变量与函数
var usedRows=0;//已使用过的行数
var defaultGap=3;//全局默认发送间隔，单位为秒
//变量obj*表示对应行的控制变量封装成的对象
var obj1={
	"sql": "",
	"interval1": -1,
	"interval2": -1,
	"gap": defaultGap,
	"id": -1
};
//connection表示存储联系的对象
var connection={};

//某条语句（某行）对应的邮件处理程序，item为表示某行的字符串
function mailHandle(item) {
	if (document.getElementById("check"+item+"1").checked && connection[item]["sql"]!="") {
		clearInterval(connection[item]["interval1"]);
		connection[item]["interval1"]=setInterval(function () {
			//异步发送邮件
			/*var json='json1={"sql":"'+connection[item]["sql"]+'"}';
			$.ajax({
				type: "POST",
				url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseQueryServlet",
				data: json,
				dataType: "json",
				success: function(data){
					var cD=new Date();
					if (data["status"]==2) {
						console.log("于"+cD.toLocaleString()+",成功查询到了数据并发送了一封邮件。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					} 
					else if (data["status"]==1) {
						console.log("于"+cD.toLocaleString()+",查询到了数据但发送邮件失败。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
					else {
						console.log("于"+cD.toLocaleString()+",未查询到任何数据。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
				},
				error: function(XMLHttpRequest,textStatus,errorThrown){
					alert(textStatus + errorThrown);
				}
			});*/
			var cD=new Date();
			console.log("于"+cD.toLocaleString()+",异步发送了一封邮件。\n");
			console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
		},connection[item]["gap"]*1000);
	} else {
		clearInterval(connection[item]["interval1"]);
	}
}

//某条语句（某行）对应的短信处理程序，item为表示某行的字符串
function noteHandle(item) {
	if (document.getElementById("check"+item+"2").checked && connection[item]["sql"]!="") {
		clearInterval(connection[item]["interval2"]);
		connection[item]["interval2"]=setInterval(function () {
			//异步发送短信
			/*var json='json1={"sql":"'+connection[item]["sql"]+'"}';
			$.ajax({
				type: "POST",
				url: "url",
				data: json,
				dataType: "json",
				success: function(data){
					var cD=new Date();
					if (data["status"]==2) {
						console.log("于"+cD.toLocaleString()+",成功查询到了数据并发送了一条短信。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					} 
					else if (data["status"]==1) {
						console.log("于"+cD.toLocaleString()+",查询到了数据但发送短信失败。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
					else {
						console.log("于"+cD.toLocaleString()+",未查询到任何数据。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
				},
				error: function(XMLHttpRequest,textStatus,errorThrown){
					alert(textStatus + errorThrown);
				}
			});*/
			var cD=new Date();
			console.log("于"+cD.toLocaleString()+",异步发送了一条短信。\n");
			console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
		},connection[item]["gap"]*1000);
	} else {
		clearInterval(connection[item]["interval2"]);
	}	
}

//某条语句（某行）对应的可用处理程序，item为表示某行的字符串
function usedHandle(item) {
	document.getElementById("row"+item+"1").disabled=false;
	document.getElementById("row"+item+"2").disabled=false;
	document.getElementById("row"+item+"4").disabled=false;
	document.getElementById("row"+item+"5").disabled=false;
}

//某条语句（某行）对应的禁用处理程序，item为表示某行的字符串
function unusedHandle(item) {
	document.getElementById("row"+item+"1").disabled=true;
	document.getElementById("row"+item+"2").disabled=true;
	document.getElementById("row"+item+"4").disabled=true;
	document.getElementById("row"+item+"5").disabled=true;
}

//某条语句（某行）对应的删除处理程序，item为表示某行的字符串
function deleteHandle(item) {
	//判断是否需要后台删除
	if (connection[item]["id"]!=-1) {
		//同步后台删除
		/*var json='json1={"tag":"4","id":"'+connection[item]["id"]+'"}';
		$.ajax({
			type: "POST",
			url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
			data: json,
			dataType: "json",
			async: false,
			success: function(data){
				var cD=new Date();
				if (data["status"]==1) {
					console.log("于"+cD.toLocaleString()+",成功删除了一条sql语句。\n");
					console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
				}
				else {
					console.log("于"+cD.toLocaleString()+",删除sql语句失败。\n");
					console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				alert(textStatus + errorThrown);
			}
		});*/
		console.log("同步删除");
		console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
	}
	clearInterval(connection[item]["interval1"]);
	clearInterval(connection[item]["interval2"]);
	connection[item]=null;
	$("body").append('<script id="script'+item+'delete">obj'+item+'=null;</script>');
	$("#script"+item).remove();
	$("#script"+item+"delete").remove();
	$("#table"+item).remove();
}

//判断某个变量是否为正确的gap(大于0的数)
function isGap(argument) {
	if (isNaN(argument)==false && argument>0) {
		return true;
	} else {
		return false;
	}
}

//某条语句（某行）对应的修改处理程序，item为表示某行的字符串
//newSql表示新的语句，newGap表示新的间隔，id表示在数据库中的id
function alterHandle(item) {
	var newSql=$("#row"+item+"1").val();
	if (newSql.length<15) {
		alert("输入语句有误，请重新进行操作！");
		$("#row"+item+"1").val(connection[item]["sql"]);
		$("#row"+item+"2").val(connection[item]["gap"]);
		return;
	}
	var operation=newSql[0]+newSql[1]+newSql[2]+newSql[3]+newSql[4]+newSql[5];
	if (operation!="select") {
		alert("输入语句有误，请重新进行操作！");
		$("#row"+item+"1").val(connection[item]["sql"]);
		$("#row"+item+"2").val(connection[item]["gap"]);
		return;
	}
	var newGap=$("#row"+item+"2").val();
	var id=connection[item]["id"];
	if (id==-1) {
		//在数据库中无记录，需要新增
		if (newSql=="") {
			//新语句为空
			if (isGap(newGap)) {
				//新间隔无误
				connection[item]["gap"]=newGap;
			} else {
				$("#row"+item+"2").val(connection[item]["gap"]);
			}
		} else {
			//新语句非空
			//处理间隔
			if (isGap(newGap)) {
				//新间隔无误
				connection[item]["gap"]=newGap;
			} else {
				$("#row"+item+"2").val(connection[item]["gap"]);
			}
			//处理语句
			connection[item]["sql"]=newSql;
			//同步后台新增
			/*var json='json1={"tag":"3","sql_str":"'+connection[item]["sql"]+'","interval_time":"'
			+connection[item]["gap"]+'"}';
			$.ajax({
				type: "POST",
				url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
				data: json,
				dataType: "json",
				async: false,
				success: function(data){
					var cD=new Date();
					if (data["status"]==1) {
						//更新id
						connection[item]["id"]=data["id"];
						mailHandle(item);
						noteHandle(item);
						console.log("于"+cD.toLocaleString()+",成功新增了一条sql语句。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
					else {
						console.log("于"+cD.toLocaleString()+",新增sql语句失败。\n");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
				},
				error: function(XMLHttpRequest,textStatus,errorThrown){
					alert(textStatus + errorThrown);
				}
			});*/
			//更新id
			connection[item]["id"]=100;
			mailHandle(item);
			noteHandle(item);
			console.log("同步新增");
			console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
		}
	} else {
		//在数据库中有记录，需要修改
		var tag1=(newSql==connection[item]["sql"]);//语句改变标记
		var tag2=(newGap==connection[item]["gap"]);//间隔改变标记
		if (tag1==false || tag2==false) {
			//语句改变或间隔改变，否则无需处理
			if (tag1==false && tag2) {
				//语句改变，间隔不变
				if (newSql=="") {
					//新语句为空，重置语句
					$("#row"+item+"1").val(connection[item]["sql"]);
				} else {
					connection[item]["sql"]=newSql;
					//同步后台修改
					/*var json='json1={"tag":"2","id":"'+connection[item]["id"]+'","sql_str":"'
					+connection[item]["sql"]+'","interval_time":"'+connection[item]["gap"]+'"}';
					$.ajax({
						type: "POST",
						url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
						data: json,
						dataType: "json",
						async: false,
						success: function(data){
							var cD=new Date();
							if (data["status"]==1) {
								mailHandle(item);
								noteHandle(item);
								console.log("于"+cD.toLocaleString()+",成功修改了一条sql语句。\n");
								console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
							}
							else {
								console.log("于"+cD.toLocaleString()+",修改sql语句失败。\n");
								console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
							}
						},
						error: function(XMLHttpRequest,textStatus,errorThrown){
							alert(textStatus + errorThrown);
						}
					});*/
					mailHandle(item);
					noteHandle(item);
					console.log("同步修改");
					console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
				}
			}
			if (tag1 && tag2==false) {
				//语句不变，间隔改变
				if (isGap(newGap)) {
					//新间隔无误
					connection[item]["gap"]=newGap;
					//同步后台修改
					/*var json='json1={"tag":"2","id":"'+connection[item]["id"]+'","sql_str":"'
					+connection[item]["sql"]+'","interval_time":"'+connection[item]["gap"]+'"}';
					$.ajax({
						type: "POST",
						url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
						data: json,
						dataType: "json",
						async: false,
						success: function(data){
							var cD=new Date();
							if (data["status"]==1) {
								mailHandle(item);
								noteHandle(item);
								console.log("于"+cD.toLocaleString()+",成功修改了一条sql语句。\n");
								console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
							}
							else {
								console.log("于"+cD.toLocaleString()+",修改sql语句失败。\n");
								console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
							}
						},
						error: function(XMLHttpRequest,textStatus,errorThrown){
							alert(textStatus + errorThrown);
						}
					});*/
					mailHandle(item);
					noteHandle(item);
					console.log("同步修改");
					console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");	
				} else {
					$("#row"+item+"2").val(connection[item]["gap"]);
				}
			}
			if (tag1==false && tag2==false) {
				if (isGap(newGap)) {
					//新间隔无误
					connection[item]["gap"]=newGap;
					if (newSql=="") {
						$("#row"+item+"1").val(connection[item]["sql"]);
					} else {
						connection[item]["sql"]=newSql;
					}
					//同步后台修改
					/*var json='json1={"tag":"2","id":"'+connection[item]["id"]+'","sql_str":"'
					+connection[item]["sql"]+'","interval_time":"'+connection[item]["gap"]+'"}';
					$.ajax({
						type: "POST",
						url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
						data: json,
						dataType: "json",
						async: false,
						success: function(data){
							var cD=new Date();
							if (data["status"]==1) {
								mailHandle(item);
								noteHandle(item);
								console.log("于"+cD.toLocaleString()+",成功修改了一条sql语句。\n");
								console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
							}
							else {
								console.log("于"+cD.toLocaleString()+",修改sql语句失败。\n");
								console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
							}
						},
						error: function(XMLHttpRequest,textStatus,errorThrown){
							alert(textStatus + errorThrown);
						}
					});*/
					mailHandle(item);
					noteHandle(item);
					console.log("同步修改");
					console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
				} else{
					$("#row"+item+"2").val(connection[item]["gap"]);
					if (newSql=="") {
						$("#row"+item+"1").val(connection[item]["sql"]);
					} else {
						connection[item]["sql"]=newSql;
						//同步后台修改
						/*var json='json1={"tag":"2","id":"'+connection[item]["id"]+'","sql_str":"'
						+connection[item]["sql"]+'","interval_time":"'+connection[item]["gap"]+'"}';
						$.ajax({
							type: "POST",
							url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
							data: json,
							dataType: "json",
							async: false,
							success: function(data){
								var cD=new Date();
								if (data["status"]==1) {
									mailHandle(item);
									noteHandle(item);
									console.log("于"+cD.toLocaleString()+",成功修改了一条sql语句。\n");
									console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
								}
								else {
									console.log("于"+cD.toLocaleString()+",修改sql语句失败。\n");
									console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
								}
							},
							error: function(XMLHttpRequest,textStatus,errorThrown){
								alert(textStatus + errorThrown);
							}
						});*/
						mailHandle(item);
						noteHandle(item);
						console.log("同步修改");
						console.log("对应的sql语句为："+connection[item]["sql"]+"。\n\n");
					}
				}
			}
		}
	}
}

//某条语句（某行）对应的操作处理程序，item为表示某行的字符串
function operationHandle(item) {
	$("#check"+item+"1").click(function () {
		mailHandle(item);
	});
	$("#check"+item+"2").click(function () {
		noteHandle(item);
	});
	$("#row"+item+"3").click(function () {
		usedHandle(item);
	});
	$("#row"+item+"4").click(function () {
		alterHandle(item);
		unusedHandle(item);
	});
	$("#row"+item+"5").click(function () {
		$("#row"+item+"1").val(connection[item]["sql"]);
		$("#row"+item+"2").val(connection[item]["gap"]);
		unusedHandle(item);
	});
	$("#row"+item+"6").click(function () {
		deleteHandle(item);
	});
}

//数据库中已有的可用敏捷监控记录的显示程序，item为表示分配给它的行对应的字符串
function priorHandle(record) {
	usedRows++;
	var currentRow=usedRows.toString();
	var newTr=newElement(currentRow);
	var newCode=newHandle(currentRow);
	$("#oneTableBody").append(newTr);
	$("#row"+currentRow+"1").val(record["sql_str"]);
	$("#row"+currentRow+"2").val(record["interval_time"]);
	$("body").append(newCode);
	connection[currentRow]["sql"]=record["sql_str"];
	connection[currentRow]["gap"]=record["interval_time"];
	connection[currentRow]["id"]=record["id"];
	$("#table"+currentRow).show();
}

//根据item(字符串)生成新敏捷监控HTML元素，返回一个表示新敏捷监控HTML元素的字符串
function newElement(item) {
	var result='<tr id="table'+item+'" style="display: none;">';
	result=result+'<td style="width: 40%">';
	result=result+'<input type="text" class="form-control" disabled="';
	result=result+'disabled" id="row'+item+'1" value=""/></td><td>';
	result=result+'<input type="text" class="form-control" disabled="';
	result=result+'disabled" id="row'+item+'2" value="3"/></td>';
	result=result+'<td style="width: 12%;padding: 10px 0">';
	result=result+'<i class="fa fa-envelope fa-fw"></i>';
	result=result+'&nbsp;<input type="checkbox" name="check'+item+'" id="check'+item+'1">';
	result=result+'&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-commenting fa-fw"></i>&nbsp;';
	result=result+'<input type="checkbox" name="check'+item+'" id="check'+item+'2">';
	result=result+'</td><td>';
	result=result+'<div style="vertical-align: center;">';
	result=result+'<div class="btn-group btn-group-xs">';
	result=result+'<button type="button" class="btn btn-default" id="row'+item+'3">';
	result=result+'<i class="fa fa-edit fa-fw"></i>修改</button>';
	result=result+'<button type="button" class="btn btn-default" id="row'+item+'4" disabled="disabled">';
	result=result+'<i class="fa fa-check-circle fa-fw"></i>确认</button>';
	result=result+'<button type="button" class="btn btn-default" id="row'+item+'5" disabled="disabled">';
	result=result+'<i class="fa fa-times-circle fa-fw"></i>取消</button>';
	result=result+'<button type="button" class="btn btn-default" id="row'+item+'6">';
	result=result+'<i class="fa fa-trash fa-fw"></i>删除</button>';
	result=result+'</div></div></td></tr>';
	return result;
}

//根据item(字符串)生成新敏捷监控HTML元素相关的操作代码，返回一个表示该操作代码的字符串
function newHandle(item) {
	var result='<script id="script'+item+'">';
	result=result+'var obj'+item+'={"sql": "",';
	result=result+'"interval1": -1,"interval2": -1,';
	result=result+'"gap": defaultGap,"id": -1};';
	result=result+'connection["'+item+'"]=obj'+item+';';
	result=result+'operationHandle("'+item+'");';
	result=result+'</script>';
	return result;
}


//文档完全加载完之后执行的代码
$(document).ready(function(){

	//敏捷监控模块moduleOne相关的操作
	$("#oneMin").click(function(){
		$("#oneBody").toggle();
	});
	$("#oneClose").click(function(){
		$("#oneCard").hide();		
	});
	//从数据库中读取已有的可用敏捷监控记录显示到页面中
	//同步初始化
	/*var json='json1={"tag":"1"}';
	$.ajax({
		type: "POST",
		url: "http://10.2.17.211:8080/QuickMonitor/servlet/DatabaseMonitorServlet",
		data: json,
		dataType: "json",
		async: false,
		success: function(data){
			var cD=new Date();
			if (data["status"]==1) {
				var priorNum=data["value"].length;
				for (var i = 0; i < priorNum; i++) {
					priorHandle(data["value"][i]);
				}
				console.log("于"+cD.toLocaleString()+",成功初始化。\n");
			}
			else {
				console.log("于"+cD.toLocaleString()+",初始化失败。\n");
			}
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert(textStatus + errorThrown);
		}
	});*/
	var data='{"status":"1","value":[{"id":"1","sql_str":"select * from tableA","interval_time":"6"},'
	+'{"id":"2","sql_str":"select * from tableB","interval_time":"8"}]}';
	data=JSON.parse(data);
	if (data["status"]==1) {
		var priorNum=data["value"].length;
		for (var i = 0; i < priorNum; i++) {
			priorHandle(data["value"][i]);
		}
	}
	console.log("同步初始化");
	//增加敏捷监控记录对应的操作
	$("#add").click(function(){
		usedRows++;
		var currentRow=usedRows.toString();
		var newTr=newElement(currentRow);
		var newCode=newHandle(currentRow);
		$("#oneTableBody").append(newTr);
		$("body").append(newCode);
		$("#table"+currentRow).show();
	});

	//操作说明模块moduleTwo相关的操作
	$("#twoMin").click(function(){
		$("#twoBody").toggle();
	});
	$("#twoClose").click(function(){
		$("#twoCard").hide();		
	});
});