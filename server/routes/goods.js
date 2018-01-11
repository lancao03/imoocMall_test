var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

var goodSchema = new mongoose.Schema({
	name: String,
	price: Number
})

//链接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall')

mongoose.connection.on('connected', function() {
	console.log('mongodb connected  success')
})

mongoose.connection.on('erro', function() {
	console.log('mongodb connected fail')
})

mongoose.connection.on('disconnected', function() {
	console.log('mongodb connected disconnected')
})

//查询商品数据 价格筛选
router.get('/list', function(req, res, next) {
	let page = parseInt(req.param('page'))
	let pageSize = parseInt(req.param('pageSize'))
	let priceLevel = req.param('priceLevel')
	let sort = req.param('sort')
	//1升序 -1 降序

	let skip = (page - 1) * pageSize
	let params = {}
	let priceGt = '',
		priceLte = ''
	if(priceLevel != 'all') {
		switch(priceLevel) {
			case '0':
				{
					priceGt = 0
					priceLte = 100
					break
				}
			case '1':
				{
					priceGt = 100
					priceLte = 500
					break
				}
			case '2':
				{
					priceGt = 500
					priceLte = 1000
					break
				}
			case '3':
				{
					priceGt = 1000
					priceLte = 1500
					break
				}
			case '4':
				{
					priceGt = 1500
					priceLte = 5000
					break
				}
		}
		params = {
			salePrice: {
				$gt: priceGt,
				$lte: priceLte
			}
		}
	}

	let goodsModel = Goods.find(params).skip(skip).limit(pageSize) //find查找所有的数据 skip跳过多少条数据 limit显示多少条数据
	goodsModel.sort({
		'salePrice': sort
	})
	goodsModel.exec((err, doc) => {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: {
					count: doc.length,
					list: doc
				}
			})
		}
	})
	//	res.send('hello good list')
})

//加入购物车 二级路由前面不需要加goods
//加入到购物车
router.post('/addCart', function (req,res,next) {
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:'1',
            msg:err.message
        })
    }else{
        console.log('userDoc:'+userDoc);
        if(userDoc){
          var goodsItem = '';
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:'1',
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            Goods.findOne({productId:productId}, function (err1,doc) {
              if(err1){
                res.json({
                  status:'1',
                  msg:err1.message
                })
              }else{
                if(doc){
                  doc.productNum = 1;
                  doc.checked = 1;
                  userDoc.cartList.push(doc);
                  userDoc.save(function (err2,doc2) {
                    if(err2){
                      res.json({
                        status:'1',
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});

module.exports = router