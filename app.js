const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
let currUser = 0;



app.post('/app/user', (req, res)=>{
	console.log(req.body);
	let sql = 'select * from userdetails u where u.username='+mysql.escape(req.body.username);
	con.query(sql, function(err,result,fields){
		if(err)throw err;
		if(result.length>0){
			res.json({"status":"Account Already present"});
		} else {
			let mx = 0;
			sql = 'select max(userid) as id from userdetails u ';
			con.query(sql,function(err,result,fields){
				console.log("result: ", result[0].id);
				mx=result[0].id+1;
				console.log("mx: ",mx);
				console.log("req: ",req.body);
				sql = "insert into userdetails (username,password,userid) values('"+
				req.body.username+"','"+req.body.password+"',"+mx+")";
				console.log("sq: ",sql);
				con.query(sql,function(err,result,fields){
					console.log("res: ", result);
					res.json({"status":"Account Created"});
				});
			})
		}
	})
})

app.post('/app/user/auth', (req, res)=>{
	console.log(req.body);
	let sql = 'select * from userdetails where username='+mysql.escape(req.body.username);
	con.query(sql,function(err,result,fields){
		if(err)throw err;
		if(result.length>0){
			if(result[0].password==req.body.password){
				currUser = result[0].userid;
				res.json({'status':'success','userid':result[0].userid});
			} else {
				console.log(': ', result[0].password);
				res.json({'status':'failure', 'userid':0});
			}
		} else {
			res.json({'status':'failure','userid':'0'});
		}
	})
});

app.get('/app/sites/list/:userid', (req, res)=>{
	if(req.params.userid==currUser){
		let sql = 'select * from saveddetails s where s.userid='+req.params.userid;
		con.query(sql,function(err,result,fields){
			if(err)throw err;
			const ret = [];
			for(let i = 0 ; i < result.length ; i ++ )ret.push(result[i]);
			res.json({'list':ret});
		})
	} else {
		console.log("not loggedin ");
		res.json({'list':[]});
	}
})

app.post('/app/sites/:userid', (req,res)=>{
	if(currUser!=req.params.userid){
		console.log("currUser:",currUser);
		console.log(":; ", req.params.userid);
		res.json({"status":"failure"});
	} else {
		let sql = "select password from userdetails where userid="+currUser;
		con.query(sql,function(err,result,fields){
			let currPass = result[0].password;
			console.log("currPass: ", currPass);
			sql =  "insert into saveddetails values("+currUser+",'"
			+req.body.username+"',MD5('"+req.body.password+"'),'"+req.body.website+"')";
			con.query(sql,function(err,result,fields){
				res.json({"status":"success"});
			})
		})
	}

})


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "newuser",
  password: "Homibhabha@15",
  database: "newdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});