var express = require('express');
var router = express.Router();
var User = require('../models/user')
require('./../util/util')

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

//报错信息公共函数
function errJSON(err) {
	if(!err) {
		return {
			status: '1',
			msg: '',
			result: ''
		}
	} else {
		return {
			status: '1',
			msg: err.message,
			result: ''
		}
	}
}

//登录
router.post('/login', function(req, res, next) {
	var param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	};
	User.findOne(param, function(err, doc) {
		if(err) {
			res.json(errJSON(err));
		} else {
			if(doc) {
				//存在cookie里
				res.cookie('userId', doc.userId, {
					path: '/',
					maxAge: 1000 * 60 * 60
				});
				res.cookie('userName', doc.userName, {
					path: '/',
					maxAge: 1000 * 60 * 60
				})
				//req.session.user=doc
				res.json({
					status: '0',
					msg: '',
					result: {
						userName: doc.userName
					}
				});
			} else {
				res.json({
					status: '2',
					msg: '',
					results: '用户名不存在'
				});
			}
		}
	})
})

//登出接口
router.post('/logout', function(req, res, next) {
	res.cookie('userId', '', {
		path: '/',
		maxAge: -1
	});
	res.cookie('userName', '', {
		path: '/',
		maxAge: -1
	})

	res.json({
		status: '0',
		msg: '',
		result: {}
	});
});

//用户校验
router.get('/checkLogin', function(req, res, next) {
	if(req.cookies.userId) {
		res.json({
			status: '0',
			msg: '',
			result: req.cookies.userName || ''
		})
	} else {
		res.json({
			status: '1',
			msg: '未登录',
			result: ''
		})
	}
})

//查询当前用户的购物车数据
router.get('/cartList', function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			if(doc) {
				res.json({
					status: '0',
					msg: '',
					result: doc.cartList
				})
			}
		}
	});
});

//购物车删除
router.post('/cart/del', function(req, res, next) {
	var userId = req.cookies.userId,
		productId = req.body.productId;
	User.update({
		userId: userId
	}, {
		$pull: {
			'cartList': {
				'productId': productId
			}
		}
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: '删除成功'
			});
		}
	});
});

//修改商品数据
router.post('/cartEdit', function(req, res, next) {
	var userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum,
		checked = req.body.checked

	User.update({
		'userId': userId,
		'cartList.productId': productId
	}, {
		'cartList.$.productNum': productNum,
		'cartList.$.checked': checked
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'success'
			})
		}
	})
});

//批量修改购物车全选状态
router.post('/editCheckAll', function(req, res, next) {
	var userId = req.cookies.userId,
		checkAll = req.body.checkAll ? '1' : '0';
	User.findOne({
		userId: userId
	}, function(err, user) {
		if(err) {
			res.json(errJSON(err))
		} else {
			if(user) {
				user.cartList.forEach((item) => {
					item.checked = checkAll;
				});
				user.save(function(err1, doc) {
					if(err1) {
						res.json(errJSON(err1))
					} else {
						res.json({
							status: '0',
							msg: '',
							result: 'success'
						})
					}
				})
			}
		}

	})
})

//查询用户地址接口
router.get('/addressList', function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json(errJSON(err));
		} else {
			res.json({
				status: '0',
				msg: '',
				result: doc.addressList
			});
		}
	})
});

//设置默认地址接口
router.post("/setDefault", function(req, res, next) {
	var userId = req.cookies.userId,
		addressId = req.body.addressId;
	if(!addressId) {
		res.json({
			status: '1003',
			msg: 'addressId is null',
			result: ''
		});
	} else {
		User.findOne({
			userId: userId
		}, function(err, doc) {
			if(err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				});
			} else {
				var addressList = doc.addressList;
				addressList.forEach((item) => {
					if(item.addressId == addressId) {
						item.isDefault = true;
					} else {
						item.isDefault = false;
					}
				});

				doc.save(function(err1, doc1) {
					if(err) {
						res.json({
							status: '1',
							msg: err.message,
							result: ''
						});
					} else {
						res.json({
							status: '0',
							msg: '',
							result: ''
						});
					}
				})
			}
		});
	}
});

//删除地址接口
router.post('/delAddress', function(req, res, next) {
	var userId = req.cookies.userId,
		addressId = req.body.addressId;
	User.update({
		userId: userId
	}, {
		$pull: {
			'addressList': {
				'addressId': addressId
			}
		}
	}, function(err, doc) {
		if(err) {
			res.json(errJSON(err));
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'success'
			});
		}
	});
});

//提交订单
router.post('/payMent', function(req, res, next) {
	var userId = req.cookies.userId,
		orderTotal = req.body.orderTotal,
		addressId = req.body.addressId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json(errJSON(err));
		} else {
			var address = '',
				goodsList = [];
			//获取当前用户的地址信息
			doc.addressList.forEach((item) => {
				if(addressId == item.addressId) {
					address = item
				}
			});

			//获取用户购物车的购买商品
			doc.cartList.filter((item) => {
				if(item.checked == '1') {
					goodsList.push(item)
				}
			});
			var r1 = Math.floor(Math.random() * 10);
			var r2 = Math.floor(Math.random() * 10);

			var platform = "622"; //平台码
			var sysDate = new Date().Format('yyyyMMddhhmmss');
			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
			var orderId = platform + r1 + sysDate + r2;

			var order = {
				orderId: orderId,
				orderTotal: orderTotal,
				addressInfo: address,
				goodsList: goodsList,
				orderStatus: '1',
				createDate: createDate
			};

			doc.orderList.push(order);

			doc.save(function(err1, doc1) {
				if(err1) {
					res.json(errJSON(err1))
				} else {
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: order.orderId,
							orderTotal: order.orderTotal
						}
					});
				}
			});

		}
	});
});

//根据订单Id查询订单信息
router.get('/orderDetail', function(req, res, next) {
	var userId = req.cookies.userId,
		orderId = req.query.orderId,
		orderTotal;
	User.findOne({
		userId: userId
	}, function(err, userInfo) {
		if(err) {
			res.json(errJSON(err));
		} else {
			var orderList = userInfo.orderList;
			if(orderList.length > 0) {
				orderList.forEach((item) => {
					if(item.orderId == orderId) {
						orderTotal = item.orderTotal
					}
				});
				if(orderTotal > 0) {
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					});
				} else {
					res.json({
						status: '12002',
						msg: '无此订单',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					});
				}
			} else {
				res.json({
					status: '12001',
					msg: '当前用户没有创建订单',
					result: ''
				});
			}

		}
	});

});

//查询购物车数量
router.get('/getCartCount', function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, userInfo) {
		if(err) {
			res.json(errJSON(err));
		} else {
			var cartList = userInfo.cartList;
			var cartCount = 0;
			cartList.map((item) => {
				cartCount += parseInt(item.productNum);
			});
			res.json({
				status: '0',
				msg: '',
				result: cartCount
			});
		}
	});
});
module.exports = router;