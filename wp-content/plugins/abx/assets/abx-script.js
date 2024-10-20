
(function( $ ) {
	"use strict";
	var $jq = jQuery.noConflict();
  $( ".dragable" ).sortable({
      connectWith: ".dragable",
   });
 	if($('.crypto-table').length > 0 ){
		$('.crypto-table').each(function(i, obj) {
			get_coin_data($(obj));			
		});
	}

  function get_coin_data(obj){
		var symbols = obj.data('symbol');
		var range = obj.data('range');
		var convert = obj.data('convert');
		var dataid = obj.data('dataid');
		var loader = obj.parent().find('.overlay');
		loader.css('visibility', 'visible');
		$.ajax({
		    url: abx.ajax_url,
		    method: 'POST',
		    dataType: 'json',
			data: {
		        action: 'coin_req', 
		        data:{symbols:symbols, range:range, convert:convert, dataid:dataid ,nonce:abx.nonce}
		    },
		    success: function (response) {
  
				if (!response.success) {
					if (response.errors) {
						obj.after('<p class="danger">' + response.errors.join('<br>') + '</p>');
					}
					obj.after('<p class="danger">Oops... something went wrong</p>');
					return;
				} else {
					var coins = response.data;  // Assuming response.data holds the coins array
					var tbody = obj.find('tbody');
					tbody.empty();  // Clear previous data

					coins.forEach(function(coin) {
						var spl = 'sparkline-' + coin.id + '-'+dataid;
						var row = '<tr>' +
						    '<td class="ver-mid"><span class="coin-img"><img src="' + coin.image + '" alt="' + coin.name + '" /></span> <span class="coin-symbol">' +  coin.symbol.toUpperCase() +'</span> <span class="coin-name">' + coin.name + '</span></td>' +
						    '<td class="' + priceStlying(coin.price_change_percentage_24h)+ '">$' + coin.current_price.toLocaleString() + '</td>' +
						    '<td class="' + priceStlying(coin.price_change_percentage_24h) + '">' +  (coin.price_change_percentage_24h > 0 ? '+' : '-') + 
						        coin.price_change_percentage_24h.toFixed(2) + '%</td>' +
						    '<td>' + formatMarketCap(coin.market_cap) + ' </td>' +
						    '<td><span class="'+spl+'"></span></td>' +
						'</tr>';
						
						tbody.append(row);

						// Initialize the sparkline after the row is added
						$jq('.'+spl).sparkline(coin.sparkline_in_7d.price, {
						    type: 'line',
							width: '150px',  // Set width
							height: '50px',  // Set height
							fillColor:coin.price_change_percentage_24h > 0 ? 'rgba(89, 185, 165, 0.2)' : 'rgba(216, 0, 39, 0.2)',
							lineColor: coin.price_change_percentage_24h > 0 ? '#4BA9A8' : '#EA5160', 
							lineWidth: 1.87,  // Line thickness
							// Remove spot markers
							spotColor: false,
							minSpotColor: false,
							maxSpotColor: false,
							highlightSpotColor: false,
							highlightLineColor: false
						});
					});
				}
			},
		    error: function (error) {
		        console.log('Error:', error);
		    },
			complete: function(data) {
				loader.css('visibility', 'hidden');
			}
		});
	}

	function formatMarketCap(number) {	
		let millionValue = number / 1000000;	
		return '$' + millionValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + 'M';
	}

	function priceStlying(changes){
		if(changes > 0 ){
			return 'positive';
		}else if(changes < 0){
			return 'negative';
		}else{
			return '';
	    }
	}

})(jQuery); 
