let mongoose = require('mongoose')
let useSchema = new mongoose.Schema({
	'userId': String,
	'userName': String,
	'userPwd': String,
	'orderList': Array,
	'cartList': [{
		'productId': String,
		'productName': String,
		'salePrice': String,
		'productImage': String,
		'checked': String,
		'productNum': Number
	}],
	'addressList': [{
		"addressId": String,
		"userName": String,
		"streetName": String,
		"postCode": String,
		"tel": String,
		"isDefault": Boolean
	}]
})

//默认取名字加s 如users
module.exports = mongoose.model("User", useSchema, "users")