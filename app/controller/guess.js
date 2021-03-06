sumeru.router.add(

	{
		pattern: '/guess',
		action: 'App.guess'
	}

);

//sumeru.router.setDefault('App.itworks');


App.guess = sumeru.controller.create(function(env, session){

	env.onrender = function(doRender){
		doRender("guess", ['none','z']);
		// initConfig();
	};
	var wordstring=[];
	var fathercount=4;
	var soncount=1;
	var change=0;
	var peoplecount=fathercount-soncount;
	var sonword="";
	//添加随机发言功能
	var indexcount;
	var speakturn=[];
	var speakCon;
	var wordtype="所有";
	var options = {  
            "placement" : "top", // 在链接下方显示tooltip  
            "trigger" : "focus",    // 显示方式  
            "title" : "请发言",        // tooltip中内容  
            "html" : "true"   // 如果为true，title可以为html代码  
        } ; 


	env.onready=function(){
		initGuess();
		document.getElementById('restart').addEventListener('click', restart);
		document.getElementById('setting_game').addEventListener('click', underwordsetting);
		document.getElementById('punish').addEventListener('click', punish);
		$("#alter_guess").hide();
        talktooltip(0);//发言提示
		$("#talk_turn").html("从第"+speakCon+"位开始发言")
	}	

    var talktooltip=function(flag){
     	speakCon = speakturn[Math.floor(Math.random()*indexcount+1)];
		//增加随机发言功能
        $("#under_"+speakCon).tooltip(options);
        if (flag==0) {
        	$("#under_"+speakCon).tooltip('show');
        }
        else
        {
        	for(var i=1;i<=parseInt(session.get("fathercount"));i++){
        		$("#under_"+i).tooltip('hide');

        	}
        }

    }

	var restart=function(){
		// env.close();
		var isshowlastnumber = session.get("isshowlastnumber");
		wordtype=session.get("wordtype");
		env.redirect('/fanpai',{'fathercount':fathercount,'soncount':Math.max(soncount,1),'isshowlastnumber':isshowlastnumber,'wordtype':wordtype,'change':change},true);
		initGuess();
	}

	var underwordsetting=function(){
		env.redirect('/undercover_setting',{'fathercount':fathercount,'soncount':Math.max(1,soncount)},true);
	}

	var punish=function(){
		// env.callSubController('/punish',{})
		env.redirect('/punish',{},true);
	}


	var initGuess=function(){
		initConfig();
		$("#guesscontent").html("");
		for (var i = 1; i <=wordstring.length; i++) {
			if((i-1)%3==0)
			{
				$("#guesscontent").append('<br/>');
			}
			 var temhtml="<a><button id='under_"+i+"'  type='button' class='btn btn-default' style='width:31%;margin:1%;padding:15px' onclick=''>"+i+"</button></a>"
			$("#guesscontent").append(temhtml);
			document.getElementById('under_'+i).addEventListener('click', tapindex);
		};
	}

	var initConfig=function(){
		// console.log("undercoverword"+session.get("content");
		wordstring=session.get("content").split(",");
		fathercount=wordstring.length;
		soncount=parseInt(session.get("soncount"));
		sonword=session.get("sonword");
		peoplecount=fathercount-soncount;
		change=parseInt(session.get("change"));
		console.log(peoplecount+":peoplecount");

		//添加随机发言功能
		for(var i=1;i<=fathercount;i++){
			speakturn[i]=i;
		}
		indexcount=fathercount;


	}

	var tapindex=function(){
		// initConfig();
		var index=this.id.split('_')[1];
		$("#under_"+index).attr("disabled", "disabled");
//添加随机发言功能
		speakturn[index]=speakturn[indexcount];
		indexcount--;
		console.log("tapindex");
		if(wordstring[index-1]!=sonword)
		{
			peoplecount--;
			// $("#under_"+index).html("冤死"+wordstring[index-1]);
			$("#under_"+index).html("出局");
			 talktooltip(0);//发言提示显示
			//添加随机发言功能
			$("#talk_turn").html("从第"+speakCon+"位开始发言");
						
		}else{
			soncount--;
			// $("#under_"+index).html("卧底"+wordstring[index-1]);
			$("#under_"+index).html("出局");
			 talktooltip(0);//发言提示显示
			//添加随机发言功能
			$("#talk_turn").html("从第"+speakCon+"位开始发言");

		}
        
        console.log("隐藏");
		console.log(peoplecount+":peoplecount");
		console.log(soncount+":soncount");
        //$(".btn").tooltip("destroy");
		if(peoplecount<=soncount){
			$("#alter_guess").html("卧底胜利");
			$("#alter_guess").show();
			disableallbutton();
		    talktooltip(1);//发言提示隐藏
			$("#talk_turn").hide();
		}
		else if(soncount<=0){
			$("#alter_guess").html("卧底失败");
			$("#alter_guess").show();
			disableallbutton();
			 talktooltip(1);//发言提示隐藏
			$("#talk_turn").hide();
		}

		var isshowlastnumber=session.get("isshowlastnumber");
		if(isshowlastnumber=="1")
		{
		    $("#showcount").html("平民人数:"+peoplecount+"卧底人数:"+soncount);
	    }
	}
	var disableallbutton=function(){
		// console.log(+":disable");
		for (var i=0;i<fathercount;i++)
		{
			var index=i+1;
			$("#under_"+index).attr("disabled", "disabled");
			$("#under_"+index).html(index+"号:"+wordstring[index-1]);
			console.log(index+":disable");
		}	
	}
});