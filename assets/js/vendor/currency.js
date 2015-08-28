function convert_percent(elem, data_symbol) {
    var amount = elem.data(data_symbol);
    elem.removeClass("positive_change negative_change");
    if (amount >= 0) {
        elem.addClass("positive_change")
    } else {
        elem.addClass("negative_change")
    }
    elem.html(amount + " %")    
}

function format_market_cap(val) {
    return Math.round(val).toLocaleString();
}

function format_fiat(val) {
    if (val >= 1) {
        if (val >= 1000) {
            val = Math.round(val).toLocaleString();
        } else {
            val = val.toFixed(2);
        }
    } else {
        if (val < 0.000001) {
            val = val.toPrecision(2)
        } else {
            val = val.toFixed(6);
        }
    }

    return val;
}

function format_crypto(val) {
    if (val >= 1) {
        val = Math.round(val).toLocaleString();
    } else {
        if (val < 0.00000001) {
            val = val.toPrecision(4)
        } else {
            val = val.toFixed(8);
        }
    }

    return val;
}


function toggle_currency(currency) {
    var currency_uppercase = currency.toUpperCase();
    var currency_lowercase = currency.toLowerCase();
    var currency_symbols = {
        "usd": "$",
        "eur": "€",
        "cny": "¥",
        "gbp": "£",
        "cad": "$",
        "rub": "<img src='/static/img/fiat/ruble.gif'/>",
        "hkd": "$",
        "jpy": "¥",
        "aud": "$",
    };
    $("#currency-switch-button").html(currency_uppercase + " <span class=\"caret\"></span>");

    //Market cap, price, volume conversion
    if (currency_lowercase == "btc") {
        $.each( [$('.market-cap'), $('.price'), $('.volume')], function() {
            selector_type = this.selector
            $.each(this, function( key, value ) {
                amount = $(this).data("btc");
                if (amount != "?") {
                    amount = parseFloat(amount)
                    if (selector_type == ".price") {
                        amount = format_crypto(amount);
                    } else {
                        amount = format_market_cap(amount);
                    }
                }
                $(this).html(amount + " BTC")
            });
        });
    } else {
        foreign_amount = $("#currency-exchange-rates").data(currency_lowercase);
        $.each( [$('.market-cap'), $('.price'), $('.volume')], function() {
            selector_type = this.selector
            $.each(this, function( key, value ) {
                amount = $(this).data("usd");
                if (amount != "?") {
                    amount = parseFloat(amount) / foreign_amount
                    if (selector_type == ".price") {                    
                        amount = format_fiat(amount);
                    } else {
                        amount = format_market_cap(amount);
                    }
                }
                $(this).html(currency_symbols[currency_lowercase] + " " + amount);
            });
        });
       
    }

    //Percent conversion
    data_symbol = currency_lowercase
    if (currency_lowercase != "btc") {
        data_symbol = "usd"
    }
    $.each( [$('.percent-1h'), $('.percent-24h'), $('.percent-7d')], function() {
        $.each(this, function( key, value ) {
            convert_percent($(this),data_symbol)
        });
    });     
}

$(document).ready(function() {    
    if(window.location.hash) {
        hash = window.location.hash.substring(1);
        if (hash == "BTC" || hash == "USD" || hash == "EUR" || hash == "CNY" || hash == "GBP" || hash == "CAD" || hash == "RUB" || hash == "HKD" || hash == "JPY" || hash == "AUD") {
            toggle_currency(hash);
        }
    }

    $(".price-toggle").click(function() {
        var currency = $(this).data('currency');
        toggle_currency(currency)
    });    
});