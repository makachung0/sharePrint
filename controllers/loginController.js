//Handle all sub-function in the login page
var fs = require('fs');

module.exports = function(req, res){
	var queryName = req.body.username;
    var queryPassword = req.body.password;

    
    if (isAdmin(queryName, queryPassword)) {
        return res.send('admin');
    } else isUser(queryName, queryPassword);
    

    function isAdmin(name, password){
    	if (name == 'admin' && password == 'maintain') return 1;
    	else return 0;
    }

    function isUser(name, password){
    	fs.readFile(__dirname + '/../account.json', function(err, data){
    		if(err) throw err;
    		var dataObject = JSON.parse(data.toString());
    		for (var i = 0; i < dataObject.record.length; i++) {

                if (dataObject.record[i].username == queryName && dataObject.record[i].password == queryPassword) {
                    res.send('ok');
                    var boolean = 1;
                }
            }

            if (!boolean) {
                res.send('fail');
            }
        
    	})
    }
}