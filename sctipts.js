$( "#inp1" ).autocomplete({
	source: function( request, response ) {
		$.ajax({
			url: "https://en.wikipedia.org/w/api.php",
			dataType: "jsonp",
          	data: {
           		"action": "opensearch",
            	"format": "json",
            	"search": request.term
          	},
          	success: function( data ) {
            	response( data[1] );
          	}
        });
	},
	minLength: 3,
    select: function( event, ui ) {
    	$(".mainContainer").animate({
			'margin-top': '20px'
		}, 1200, 'easeOutBounce')
       getWikiArticles(ui.item.label);
	},
});

function getWikiArticles() {
	hideArticles();
	$.ajax({
		url: "https://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: {
			"format": "json",
            "action": "query",
			"generator": "search",
			"prop": "pageimages|extracts",
			"pilimit":"max",
			"exintro": "2",
			"explaintext": "2",
			"exsentences": "2",
			"exlimit": "max",
			"gsrsearch": $("form #inp1").val()
		},
		success: function(apiResponse) {
			var obj = apiResponse.query.pages;
			var arr = Object.keys(obj).map(function (key) {return obj[key]});
			arr.forEach(function() {
			});
			for(var i = 0; i<arr.length; i++) {
				$(".articleList #art"+i).children().attr("href", "https://en.wikipedia.org/?curid="+arr[i].pageid);
				$(".articleList #art"+i+" .artDesc .artTitle").html(arr[i].title);
				$(".articleList #art"+i+" .artDesc .artExtract").html(arr[i].extract);
				if(arr[i].thumbnail) {
					$(".articleList #art"+i+" .artImgContainer .artImg").html("<img src=\""+arr[i].thumbnail.source+"\">");
				} else {
					$(".articleList #art"+i+" .artImgContainer .artImg").html("<i class=\"fa fa-camera-retro fa-3x\" aria-hidden=\"true\"></i>");
				}
			}
			animateArticles(arr.length);
		}
	})
}

function hideArticles() {
	$.each($(".articleList .art"), function() {
		$(".articleList .art")
			.css({
				'opacity': '0.0',
				'display': 'none'
			})
	});
}

function animateArticles(articlesQuantity) {
	var i=0;
	var delayValue = 1300;
	while(i < articlesQuantity) {	
		$(".articleList #art"+i).css({"display":"block"});
		$(".articleList #art"+i).delay(delayValue).animate({
			"opacity":"1.0"	
		}, "medium");
		delayValue=delayValue+250;
		i++;
	}
};

var currentWidth = $(window).width();

function widthCheck() {
	currentWidth = $(window).width();
}

$(window).resize(widthCheck);

$(document).ready(function() {
	
	hideArticles();
	wow = new WOW({
		mobile: false
	})
	wow.init();

	$(".inputContainer form").click(function(e){
		$("form #inp1").addClass("forClickLabel");
		if(currentWidth > 470) {
			$("form #inp1").css({ 'width': '420px'})
		} else {
			$("form #inp1").css({ 'width': '260px'})	
		}
		e.stopPropagation();
	});
		
	$("body").click(function(e){
		$("form #inp1").css({ 'width': '150px'})
	});
		
	$("label").click(function(e) {
		if($("form #inp1").val() !== "" ) {
			getWikiArticles();
			$(".mainContainer").animate({
				'margin-top': '20px'
			}, 1200, 'easeOutBounce')
		}
	})
	
	$("body").keypress(function(e) {
		if(e.keyCode === 13) {
			if($("form #inp1").val() !== "" ) {
				$(".ui-autocomplete").css("display", "none");
				e.preventDefault();
				getWikiArticles();
				$(".mainContainer").animate({
					'margin-top': '20px'
				}, 1200, 'easeOutBounce')
			}
		} 
	});

	$(".randomButton").click(function() {
		window.open("https://en.wikipedia.org/wiki/Special:Random");	
	})
	
	$(".articleList .art a").hover(function() {
		$(this.children[0]).css({"margin-left": "-5px"});

	}, function() {
		$(this.children[0]).css({"margin-left": "0px"})
	})
	
	$(".button").css({
		"backgroundColor": "#505053",
		"color": "white"
	})
});