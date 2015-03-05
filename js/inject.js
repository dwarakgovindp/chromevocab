//when typed via chrome address bar
var aid = setInterval(searchbar,100,"addressbar");
var allloaded,sid,ajaxid,asid;
//via search button
$('.lsb').click(function(){
		preprocess();
});

//via search bar - enter is pressed and also ajax
$('#lst-ib').keydown(function(e){
	if(ajaxid!=null)
	{
		clearInterval(ajaxid);
	}
	if(e.keyCode==13)
	{
		preprocess();		
	}
	else 
	{
		//ajax load of meaning 
		searchterm = document.getElementById("lst-ib").value;
		var res = searchterm.split(" ");
		var wordnode = document.getElementsByClassName("vk_ans")[0];
		if(wordnode!=null)
		{
			var word = wordnode.childNodes[0].innerHTML;
			if(res[0]==word)
			{
				ajaxid = setInterval(searchbar,100,"ajax");
			}	
		}
		
	}
});


function preprocess()
{
		searchterm = document.getElementById("lst-ib").value;
		var res = searchterm.split(" ");
		var data = {};
		data.typee = "check";
		data.word = res[0];
		chrome.runtime.sendMessage(data, function(response) {
 		// console.log(response.present);
 		 if(response.present===false)
 		 {
 		 	sid = setInterval(searchbar,100,"search");
 		 }
 		 });
}
function searchbar(from)
{
	//console.log("in");
	var searchterm;
	searchterm = document.getElementById("lst-ib").value;
	var res = searchterm.split(" ");
	if(from=="ajax")
	{	
		var data = {};
		data.typee = "check";
		data.word = res[0];
		chrome.runtime.sendMessage(data, function(response) {
 		// console.log(response.present);
 		 if(response.present===false)
 		 {
 		 	clearInterval(ajaxid);
			allloaded = setInterval(fetchdata,100);
 		 }
 		 });


		
	}
	else if(res[res.length-1]=="meaning")
	{
		//console.log("in if");
		if(from=="addressbar")
		{
		clearInterval(aid);	
		}
		
		else if(from=="search")
		{
		clearInterval(sid);		
		}

	
		
		allloaded = setInterval(fetchdata,100);

	}
}


function fetchdata()
{

	//console.log("in fetchdata");
	searchterm = document.getElementById("lst-ib").value;
	//for more than one parts of speech get the number of examples under them by using the lr_dct_sf_sens ol class and find the number of li under it
	var res = searchterm.split(" ");
	var wordnode = document.getElementsByClassName("vk_ans")[0];
	var posnodes = document.getElementsByClassName("lr_dct_sf_h");
	var meanodes = document.getElementsByClassName("lr_dct_sf_sen vk_txt");
	if(wordnode!=null && posnodes.length!=0 && meanodes.length!=0 && wordnode.childNodes[0].innerHTML== res[0])
	{
			clearInterval(allloaded);
	//		console.log("ready");
			/*var num = [];//if a word is noun and a verb => num[0] has number of diff meanings under noun and num[1] has number of examples under verb 
			var olist = document.getElementsByClassName("lr_dct_sf_sens");
			for(i=0;i<olist.length;i++)
			{
				num.push(olist[i].childNodes.length)
			}*/
			

			var data = {};
			data.word = wordnode.childNodes[0].innerHTML;
			var results = [];
			$('.lr_dct_sf_h').each(function(){
				var obs = {};
				var pos = $(this).find('i').text();
				if(pos=="noun"||pos=="adjective"||pos=="adverb"||pos=="verb")
				{
					obs.pos = pos;
					var desc = [];
					$(this).siblings('.lr_dct_sf_sens').find('.lr_dct_sf_sen,.vk_txt').each(function(){
						//console.log("ger");
						//console.log(this);
						 var index = this.childNodes.length;
						 var seg = this.childNodes[index-1].childNodes[0].childNodes;

						 //console.log(seg);
						 var descobj = {};
						 for(var j=0;j<seg.length;j++)
						{
							if($(seg[j]).attr('class')=="xpdxpnd")
							{
								continue;
							}
							else if($(seg[j]).attr("data-dobid"))
							{
								descobj.meaning = $(seg[j]).find('span').text();
							}
							else if($(seg[j]).hasClass('vk_gy'))
							{
								descobj.usage = $(seg[j]).find('span').text();
							}
							else if($(seg[j]).find('tr'))
							{

								//console.log("has synonyms");
								descobj.synonyms = "";
								var d = $(seg[j]).find('tr').children();
							 	$(d[d.length-1]).children().each(
								function(){
									//console.log(this);
									if($(this).children().length==0)
									{

									descobj.synonyms=descobj.synonyms+$(this).text();
									}
									else if($(this).children().length==1)
									{
										var x = $(this).children();
										
										if($(x[0]).is('a'))
										{
											
											
											descobj.synonyms=descobj.synonyms+$(x[0]).text()+",";	
										}
										
									}

								}
								);
								var a = descobj.synonyms.split(",");	
										//note for the xtra ; at end so length -1 
									//console.log(a);
									descobj.synonyms="";
									if(a.length-1>4)
									{
										a.splice(4,a.length);
									}
									else 
									{
										a.splice(a.length-1,1);
									}
									//console.log(a);
									for(var m=0;m<a.length;m++)
									{
										if(m==a.length-1)
										descobj.synonyms+=a[m]+". ";
										else
										descobj.synonyms+=a[m]+", ";
									}

								//console.log("descobj is "+descobj.synonyms);
								
								

						
							}

						}
						desc.push(descobj);

					});
					obs.desc = desc;
				}
				if(!$.isEmptyObject(obs))
				{
					//console.log(obs);
					results.push(obs);
				}
			});	
			data.results = results;



			/*search = "dwa"
			var data = {};
			data.appname = "chromevocab";
			data.word = wordnode.childNodes[0].innerHTML;
			var pos = [];
			for (i=0;i<posnodes.length;i++)
			{
				var posval = posnodes[i].childNodes[0].innerHTML;
				pos.push(posval);
			}
			data.descforpos = num;
			

			data.pos = pos;
			var desc = [];
			console.log("meannodes length is "+meanodes.length);
			for(i=0;i<meanodes.length;i++)
			{
				console.log(i);

				// some meannodes has numbered meanings so an additional childnode for the number so get the last childnode of meannode
				index = meanodes[i].childNodes.length;
				var seg = meanodes[i].childNodes[index-1].childNodes[0].childNodes;
				var descobj = {};
				*/
				/*for(j=0;j<seg.length;j++)
				{
					console.log("in");
					var nodes = $(seg[j]).find('span');
					console.log(nodes.length);
					for(k=0;k<nodes.length;k++)
					{
						if($(nodes).data())
					}
					
				}
				
				}


				
				
				
				
			data.desc = desc;
			//remove hidden info
			for(var i=0;i<data.pos.length;i++)
			{
				for(var j=i+1;j<data.pos.length;j++)
				{
					if(data.pos[j]==data.pos[i])
					{
						data.pos.splice(j,1);
						data.descforpos.splice(j,1);
						data.desc.splice(j,1);
					}
				}
			}*/
			data.typee = "allok";
			//console.log(data);
			//trim the data 
			for(var k=0;k<data.results.length;k++)
			{
				if(data.results[k].desc.length>2)
				{
					data.results[k].desc.splice(2,data.results[k].desc.length);
				}
			}
			//console.log("after trim");
			//console.log(data);
			//merge example rare .. two adj for two two rare words.
			for(var k=0;k<data.results.length;k++)
			{
				for(var l=k+1;l<data.results.length;l++)
				{
					if(data.results[k].pos==data.results[l].pos)
					{
						for(var m=0;m<data.results[l].desc.length;m++)
						{
							data.results[k].desc.push(data.results[l].desc[m]);

						}
						data.results.splice(l,1);
					}
				}
			}
	//		console.log(data);




			chrome.runtime.sendMessage(data, function(response) {
  //console.log(response.farewell);
});

	}
}


