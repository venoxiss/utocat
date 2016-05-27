lib = module.exportss = {
	request : require('request'),
	Promise : require('promise'),
	crypto : require('crypto'),

	createNotary : function(publickey, privatekey, contents , formats){
		var url = 'https://sandbox.blockchainiz.io/api/v1/notary';
		var nonce = Date.now();
		var retour = '';
		var rawBody = {
			format: formats,
			content: contents
		};
		var hash = crypto.createHmac('SHA512', privatekey)
		.update(nonce + url + JSON.stringify(rawBody))
		.digest('hex');
		request({
			url: url,
			headers: {
				'Content-Type': 'application/json',
				'x-Api-Key': publickey,
				'x-Api-Signature': hash,
				'x-Api-Nonce': nonce
			},
			method: 'post',
			json: true,
			body: rawBody,
		},
		function(err, res2, body2) {
			if(err === null){
				retour = {
					txid : body2.txid,
					content: rawBody.content
				}
			}else{
				retour = err ;
			}
		})
		return retour;
	},

	verifNotary : function(res){
		var nonce = Date.now();
		var urli= 'https://sandbox.blockchainiz.io/api/v1/notary/'+res.txid+ '?format=ascii';
		var retour;

		request({
			json: true,
		  url: urli,
		},
		function(err, res2, body2) {
		  if(err === null){
			  if(body2.data === res.content){
					retour = true;
			  }else{
				  retour = false;
			  }
		  }else{
			  retour = err;
		  }
		})
		return retour;
	},
};


var request = require('request');
var Promise = require('promise')
var crypto = require('crypto');

var publickey = 'F6klOgEzbieT_BWMfwqu9y-yqs5UAQAA';
var privatekey = 'Q72Bmg3OkEn7G6dq2XQmYT1knvfmkhUlqVVaoMclhSyb-1fQaeYXDs22sLwuzYfgOyAWFcGQgE0o2FrCkhYPzMpPHFbFjq7DhUxJaENWww8NjeA1IRa0Vy6yqs5UAQAA';

var useragent = require('useragent');
useragent(true);




var bonus = function(){
	new Promise(function (resolve, reject){
	var nonce = Date.now();
	var url = 'https://sandbox.blockchainiz.io/api/v1/contract/ethereum/solidity';
		var retour = '';
		var rawBody = {
			source: "contract Test { }"
		};

		var hash = crypto.createHmac('SHA512', privatekey)
		.update(nonce + url + JSON.stringify(rawBody))
		.digest('hex');

		request({
		  url: url,
		  headers: {
			'Content-Type': 'application/json',
			'x-Api-Key': publickey,
			'x-Api-Signature': hash,
			'x-Api-Nonce': nonce,
			'user-agent': JSON.stringify(process.versions)
		 },
		 body: rawBody,
		 method: 'post',
		 json: true,

		},
		function(err, res2, body2) {
			console.log(body2);


		  /*if(err === null){
			  var retour = {
				  txid : body2.txid,
				  content: rawBody.content
			  }
			  resolve(retour);
		  }else{
			  reject(err);
		  }*/
		})
	})
};
	/*

	.then(function (res){
		var nonce = Date.now();
		var urli= 'https://sandbox.blockchainiz.io/api/v1/notary/'+res.txid+ '?format=ascii';


		request({
		  url: urli,
		},
		function(err, res2, body2) {
			//Ici il y avais un probleme le body2 n'est pas reconue comme un objet ou je mis suis mal prit j'ai donc fais une petite manip pas tes jolie mais fonctionnel
		  var lebidouillage = {
			  data : body2.toString().split(',')[0].split(':')[1].replace('"','').replace('"','')
		  }
		  if(err === null){
			  if(lebidouillage.data === res.content){
				  console.log('la verif est ok');
			  }else{
				  console.log('la verif n\'est pas ok');
			  }
		  }else{
			  console.log(err);
		  }
		})
	});
};*/

module.exports.bonus = bonus;
