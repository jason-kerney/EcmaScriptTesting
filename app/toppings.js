'use strict';
function toppings () {
    let t = {};

    function buildToppingCategory(name, price) {
        if(!(name in t)) {
            let value = 'None';
            t[name] = {
                'light' : function () {
                    value = 'Light';
                },
                'regular' : function () {
                    value = 'Regular';
                },
                'heavy' : function () {
                    value = 'Heavy';
                },
                'half' : function () {
                    if((value.length > 0) && !(value.includes('Half')) && !(value.includes('None'))) {
                        value += ' - Half';
                    }
                },
                'none' : function() {
                    value = 'None';
                },
                'getTopping' : function () {
                    return `${name} ${value} $${t[name].getAmmount()}`;
                },
                'getAmmount' : function () {
                    if (value.includes('Light')) {
                        return price * .5;
                    } else if (value.includes('Regular')) {
                        return price;
                    } else if (value.includes('Heavy')) {
                        return price * 2;
                    } else {
                        return 0;
                    }
                },
                'hasAny' : function() {
                    return !(value.includes('None'));
                }
            };
        }
    }

    return {
        'toppings' : t,
        buildToppingCategory: buildToppingCategory
    };
}

module.exports = toppings;
