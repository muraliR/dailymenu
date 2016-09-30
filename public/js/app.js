App.controller('home', function (page) {

    var loadingGifImg = page.querySelector(".loader");
    var resultSection = page.querySelector('.result-section');
    var resultPlaceholder = page.querySelector('.results-placeholder')

    $(page).delegate('#search_input','keypress',function(e){
        $(resultPlaceholder).addClass("hidden");
        if(e.which == 13) {
            var query = $('#search_input').val();
            $.ajax({
                url : '/api/search',
                type : 'GET',
                data : { search_query : query },
                beforeSend: function(){
                    $(loadingGifImg).removeClass("hidden");
                    $(resultSection).addClass("hidden");
                },
                success : function(data){
                    $(loadingGifImg).addClass("hidden");
                    $(resultSection).removeClass("hidden");
                    response_data = JSON.parse(data);
                    if(response_data["success"]){
                        loadResults(page,response_data["restaurants"]);
                    } else {
                        alert(data["message"]);
                    }
                }
            });
        }
    });
});

try {
    App.restore();
} catch (err) {
    App.load('home');
}
function loadResults(page,restaurants){
    $(page).find('.no-results-found').hide();
    var $template = $(page).find('.restaurant').remove();
    var $restaurants_results = $(page).find('.restaurants-results');
    console.log(restaurants.length);
    if(restaurants.length != 0){
        restaurants.forEach(function (restaurantObj) {
            restaurantData = restaurantObj.restaurant;
            var $restaurant = $template.clone(true);
            $restaurant.find('.img-thumb').attr("src",restaurantData.thumb).show();
            $restaurant.find('.restaurant-name').text(restaurantData.name);
            $restaurant.find('.restaurant-address').text(restaurantData.location.address);
            $restaurant.find('.menu-redirection-href').attr("data-app-target",restaurantData.menu_url);
            $restaurant.find('.restaurant-locality').text(restaurantData.location.locality + ', ' + restaurantData.location.city);
            $restaurant.find('.directions').attr("data-app-target", "geo:" + restaurantData.location.latitude + "," + restaurantData.location.longitude + "?q=" + restaurantData.location.latitude + "," + restaurantData.location.longitude + "(" + restaurantData.name + " " + restaurantData.location.locality + ")").attr("target", "_blank");
            
            $restaurants_results.append($restaurant);
        });    
    } else {
        $(page).find('.no-results-found').show();
    }
    
    $(page).delegate('.map-redirection','click',function(){
        var target = $(this).find('.directions').attr('data-app-target');
        window.open(target, "_self");
    })

    $(page).delegate('.menu-redirection','click',function(){
        var target = $(this).find('div.menu-redirection-href').attr('data-app-target');
        window.open(target, "_self");
    })
}