var rootnode = null;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   
    
      //console.log(request);
      if(request.typee=="allok")
      {
      
      var availsize = (5*1024*1024) - JSON.stringify(localStorage).length;
      var entrysize = 1000 + JSON.stringify(request).length;
      if(availsize > entrysize)
      {
      	//console.log("all set");
      	localStorage.setItem(request.word, JSON.stringify(request));	
      	sendResponse({farewell: "goodbye"});
      }
      if(JSON.stringify(localStorage).length>(5*1000*1000))
      {
     
      	$('#memoryfull').css({"visibility":"visible"});
      }

      
      }
      else if(request.typee=="check")
      {
      var res = localStorage.getItem(request.word);
      if(res!=null)
      {
      sendResponse({"present":true});	
      }
      else
      {
      sendResponse({"present":false});	
      }
      
      }
  });
function removeondelete(word)
{
	var all = $('.searchresults');
	for(var i=0;i<all.length;i++)
	{
		if($(all[i]).text()==word)
			{
				//console.log("yup");
				$(all[i]).remove();
				break;
			}
	};
}
function delchilds(id)
{
	//console.log(id);
	var rangeObj = new Range();
	// Select all of theParent's children
	rangeObj.selectNodeContents(document.getElementById(id));
	// Delete everything that is selected
	rangeObj.deleteContents();
}
function init()
{
	var welcome = document.createElement("span");
	welcome.className = "welcome";
	word.appendChild(welcome);
	$('.welcome').html("Hey! Start searching for words' meaning in Google and i will take care of them <br/> <span id=\"instruction\">Type <span id = \"straight\">&ltyour_word&gt meaning</span> in searchbox in Google page or Google search address bar so that i can get it or else if Google's results are not up to your vocabulary standards add your words </span>");
}
function generate()
{
//console.log("in generate");
//console.log(localStorage.length);
var ll = localStorage.length;
if(ll==0)
{
	
	if($('#word').text()=="")
	{
		init();
	}
	else if($('#results').children())
	{
		$('#word').text("");
		
		delchilds("word");
		delchilds("results");
		init();
	}

	
}
else
{	
		if($('.welcome'))
		{
			delchilds("word");	
		}
		delchilds("results");
		var index = Math.floor((Math.random()*ll));
	//	console.log(index);
		var key = localStorage.key(index);
		//console.log(key);
		$('#word').text(key);
		var res = JSON.parse(localStorage.getItem(localStorage.key(index)));
		var resarr = res.results;
		for(var i=0;i<resarr.length;i++)
		{
			var poscontainer = document.createElement("div");
			poscontainer.className = "poscontainer";
			var posvalue = document.createElement("div");
			posvalue.className = "posvalue";
			posvalue.innerHTML = resarr[i].pos;
			var poswrapper = document.createElement("div");
			poswrapper.className = "poswrapper";
			for(var j=0;j<resarr[i].desc.length;j++)
			{
				if(resarr[i].desc[j].meaning)
				{
					var meaning = document.createElement("div");
					meaning.className="meaning";
					meaning.innerHTML = "<span class=\"bullet\"></span>"+resarr[i].desc[j].meaning;
					poswrapper.appendChild(meaning);
				}
				if(resarr[i].desc[j].usage)
				{
					var usage = document.createElement("div");
					usage.className = "usage";
					usage.innerHTML = "\""+resarr[i].desc[j].usage+"\"";
					poswrapper.appendChild(usage);
				}
				if(resarr[i].desc[j].synonyms)
				{
					var synonyms = document.createElement("div");
					synonyms.className="synonyms";
					synonyms.innerHTML = "<span class=\"subs\">synonyms -</span>"+resarr[i].desc[j].synonyms;
					poswrapper.appendChild(synonyms);	
				}

			}
			poscontainer.appendChild(posvalue);
			poscontainer.appendChild(poswrapper);
			document.getElementById("results").appendChild(poscontainer);
		}
}

}



function wordexpanding(){
	var mfc = $('#messageforclick').css("display");
	var addform = $('#ingest').css("display");
	$('#deleteword,#deletetooltip').css({"display":"inline-block"});
	if(mfc=="block")
	{
		$('#messageforclick').css({"display":"none"});
	
	}
	if(addform=="block")
	{
		$('#ingest').css({"display":"none"});
	}
	$('#wordexpand').css({"display":"block"});
  //console.log("ya");
   delchilds("weresults");
   var word = $.trim($(this).text());
   $('#wewordvalue').text(word);
   //console.log(localStorage.getItem(word));
   var res = JSON.parse(localStorage.getItem(word));
		var resarr = res.results;
		for(var i=0;i<resarr.length;i++)
		{
			var weposcontainer = document.createElement("div");
			weposcontainer.className = "poscontainer";
			var weposvalue = document.createElement("div");
			weposvalue.className = "posvalue";
			weposvalue.innerHTML = resarr[i].pos;
			var weposwrapper = document.createElement("div");
			weposwrapper.className = "poswrapper";
			for(var j=0;j<resarr[i].desc.length;j++)
			{
				if(resarr[i].desc[j].meaning)
				{
					var wemeaning = document.createElement("div");
					wemeaning.className="meaning";
					wemeaning.innerHTML = "<span class=\"bullet\"></span>"+resarr[i].desc[j].meaning;
					weposwrapper.appendChild(wemeaning);
				}
				if(resarr[i].desc[j].usage)
				{
					var weusage = document.createElement("div");
					weusage.className = "usage";
					weusage.innerHTML = "\""+resarr[i].desc[j].usage+"\"";
					weposwrapper.appendChild(weusage);
				}
				if(resarr[i].desc[j].synonyms)
				{
					var wesynonyms = document.createElement("div");
					wesynonyms.className="synonyms";
					wesynonyms.innerHTML = "<span class=\"subs\">synonyms -</span>"+resarr[i].desc[j].synonyms;
					weposwrapper.appendChild(wesynonyms);	
				}

			}
			weposcontainer.appendChild(weposvalue);
			weposcontainer.appendChild(weposwrapper);
			document.getElementById("weresults").appendChild(weposcontainer);
		}


}

function fillresults(results)
{
	var searchwrapper = document.getElementById("searchresultswrapper");
	var newresult = document.createElement("div");
	newresult.className = "searchresults";
	newresult.innerHTML = results;
	newresult.onClick = wordexpanding;
	searchwrapper.appendChild(newresult);
}

function node(char,eos,left,eq,right)
	{
		this.data = char;
		this.eos = eos;
		this.left = left;
		this.eq = eq;
		this.right = right;
	}
	function insert(root,word,wordindex)
	{
		if(root==null)
		{
			root = new node(word[wordindex],false,null,null,null);		
		}
		if(word[wordindex]<root.data)
		{
			root.left=insert(root.left,word,wordindex);
		}
		else if(word[wordindex]==root.data)
		{
			if(wordindex+1<=word.length-1)
			{
				root.eq =insert(root.eq,word,wordindex+1);
			}
			else 
			{
				root.eos=true;
			}
		}
		else 
		{
			root.right = insert(root.right,word,wordindex);
		}
	return root;	
	}

    function getAll(root,results)
    {
    	//console.log(results);
    	if(root===null)
    	{
    		return;
    	}
    	getAll(root.left,results);
    
    	results+=root.data;

    	if(root.eos)
    	{

    		fillresults(results);
    		//console.log(results);
    		
    	}
    	getAll(root.eq,results);
   
    	results = results.substr(0,results.length-1);
    	
    	getAll(root.right,results);

    }

	function search(root,word,wordindex,results)
	{
		//console.log(root.data);
		//console.log(wordindex);
		if(root===null)
			return;
		if(word[wordindex]==root.data&&wordindex==word.length-1)
		{
			
			results = word;
			//console.log("to call");
			//exact match with word in storage
			if(root.eos)
			{
				fillresults(results);
			}
			//suggestions
			else
			{
				getAll(root.eq,results);	
			}
			
			
		}
		else if(word[wordindex]==root.data&&wordindex!=word.length-1)
		{
			
			search(root.eq,word,wordindex+1,results);
		}
		else if(word[wordindex]<root.data)
		{
			 search(root.left,word,wordindex,results);
		}
		else 
		{
			search(root.right,word,wordindex,results);
		}
		

	}

function mycreate(el,cl,val)
{
	var temp = document.createElement(el);
	temp.className = cl;
	if(val!="")
	temp.innerHTML = val;
	return temp;

}
function createinput(val,cls)
{
	var temp = document.createElement("input");
	temp.placeholder = val;
	temp.className = "addwords "+cls;
	temp.spellcheck = false;
	temp.autocomplete = "off";
	return temp;

}


$(document).ready(function(){

console.log('%cHey Javascript dev/hacker !! The app runs on **LocalStorage**, so don\'t play with it.Your collection of words can vanish with a single function!! Beware !!',"color:red;font-family:\"sansaitalic\";font-size:50px");	
//console.log("hi");
generate();
//$('#messageforclick,#wordexpand').css({"display":"none"});
var id = setInterval(generate,10*1000);

$('#deleteword').hover(function(){
	$('#deletetooltip').css({"visibility":"visible"});
},function(){
	$('#deletetooltip').css({"visibility":"hidden"});
});


if (localStorage.length) {
       for (var i = 0; i < localStorage.length; i++) {
           rootnode = insert(rootnode,localStorage.key(i),0);
       }
}
var sear = $('#searchbar').text();
if(sear=="")
{
	getAll(rootnode,"");
}
$('#deleteword').click(function(){
	var ww = $.trim($('#wewordvalue').text());
	localStorage.removeItem(ww);
	if(JSON.stringify(localStorage).length>(5*1000*1000))
	{
		//console.log("2");
		$('#memoryfull').css({"visibility":"visible"});	
	}
	
	$('#deletetooltip,#deleteword').css({"display":"none"});
	removeondelete(ww);
	delchilds("weresults");
	 rootnode = null;
	      if (localStorage.length) {
	       for (var i = 0; i < localStorage.length; i++) {
	           rootnode = insert(rootnode,localStorage.key(i),0);
	       }
			}
	
	//getAll(root,"");
	$('#messageforclick').css({"display":"block"});
	$('#wewordvalue').text("");
	$('#deleteword,#deletetooltip').css({"display":"none"});


});

//console.log(root);
$('#modal .circle').on("click",function(){
	$('#modal').hide();
	$('#main').show("100");

});
$('#main .circle').on("click",function(){
	$('#main').hide();
	$('#modal').show("100");
	
	
});
inn=0;
$('#searchbar').keyup(function(){
	var query = $.trim($('#searchbar').val());
	//console.log(query)
	//console.log(rootnode);
	//console.log(inn++);
	delchilds("searchresultswrapper");
	if(query=="")
	{
		getAll(rootnode,"");
	}
	else
	{
		search(rootnode,query,0,"");
	}
});

$(document).on('click',".searchresults",wordexpanding);
$(document).on('click',".addbuttons",function(){
	if($(this).hasClass("morepos"))
	{
		var div = mycreate("div","ingestposwrapper","");
		var a = new Array(6);
		a[0] = createinput("noun or verb or adjective or adverb","addpos");
		a[1] = mycreate("span","morepos addbuttons","+");
		a[2] = mycreate("span","morepos removebuttons","&times;");
		a[3] = createinput("meaning","addmeaning");
	
		a[4] = createinput("usage in sentence","addusage");
		
		a[5] = createinput("synonyms","addsynonyms");
		for(var i=0;i<6;i++)
		div.appendChild(a[i]);
		document.getElementById("ingest").appendChild(div);
	}




});
$(document).on('click',".removebuttons",function(){
	$(this).parent().remove();
});
$('#addword').click(function(){
	var mfc = $('#messageforclick').css("display");
	var we = $('#wordexpand').css("display");
	//$('#deleteword,#deletetooltip').css({"display":"inline-block"});
	if(mfc=="block")
	{
		$('#messageforclick').css({"display":"none"});
	
	}
	if(we=="block")
	{
		$('#wordexpand').css({"display":"none"});
	}
	$('#ingest').css({"display":"block"});

});
$('#addwordform').click(function(){
	//console.log(rootnode);
    var word = $('#addingword').val();
    var pos = $('.addpos');
    var meaning = $('.addmeaning');
    //console.log(pos.length);
    for(var i=0;i<pos.length;i++)
    {
    	var vl = $.trim($(pos[i]).val());
    	//console.log(vl);
    	if(vl == "" || (vl != "noun" && vl!="verb" && vl!="adjective" && vl!="adverb"))
    	{
    		$(pos[i]).css({"border-bottom":"1px solid red"});
    	}
    }
    for(var i=0;i<meaning.length;i++)
    {
    	if($(meaning[i]).val() == "")
    	{
    		$(meaning[i]).css({"border-bottom":"1px solid red"});
    	}
    }
    if(word=="")
    {
    	$('#addingword').css({"border-bottom":"1px solid red"});
    }
    var all = $('#ingest input');
    var allok = true;
    for(var i=0;i<all.length;i++)
    {
    	//console.log($(all[i]).css("border-bottom"));
    	if($(all[i]).css("border-bottom")==="1px solid rgb(255, 0, 0)")
    	{
    		allok = false;
    		break;
    	}
    }
    if(allok)
    {
	    
	    	var data = {};
	    	data.word = word;
	    	var results = [];
	    	$('.ingestposwrapper').each(function(){

	    		
	    		var obj = {};
	    		obj.pos = $(this).find(".addpos").val();
	    		var desc = [];
	    		var descobj = {};
	    		var a;
	    		a = $(this).find(".addmeaning").val();
	    		//console.log(a);
	    		if(a!="")
	    		{
	    		descobj.meaning = a;	
	    		}
	    		
	    		a = $(this).find(".addusage").val();
	    		//console.log(a);
	    		if(a!="")
	    		{
	    		descobj.usage = a;	
	    		}
    		
    		a = $(this).find(".addsynonyms").val();
    		//console.log(a);
    		if(a!="")
    		descobj.synonyms = a;
    		desc.push(descobj);
    		obj.desc = desc;
    		results.push(obj);


    	})
    	
    	data.results = results;
    	//console.log(data);
    	//trim data 
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
			//console.log(data);
	    	//put into local storage and reset the form and update the tree and display the contents and on success hide the form and display messageforclick
    	  var availsize = (5*1024*1024) - JSON.stringify(localStorage).length;
	      var entrysize = 1000 + JSON.stringify(data).length;
	      if(availsize > entrysize)
	      {
	      	//console.log("all set");
	      	localStorage.setItem(data.word, JSON.stringify(data));
	      	$('#ingest input').val("");	
	      	$('#messageforclick').css({"display":"block"});
	      	$('#ingest').css({"display":"none"});
	      
	      }
	      if(JSON.stringify(localStorage).length>(5*1000*1000))
	      {
	      	//console.log("3");
	      	$('#memoryfull').css({"visibility":"visible"});
	      }
	      delchilds("searchresultswrapper");
	      rootnode = null;
	      if (localStorage.length) {
	       for (var i = 0; i < localStorage.length; i++) {
	           rootnode = insert(rootnode,localStorage.key(i),0);
	       }
			}
		var sear = $('#searchbar').text();
		if(sear=="")
		{
			getAll(rootnode,"");
		}
	
  }
    


    
	
});
$(document).on('keyup',"#ingest input",function(){

	var val = $.trim($(this).val());
	if(val!="")
	{
		
		$(this).css({"border-bottom":"1px solid #C0C0C0"});
	}
})



});

