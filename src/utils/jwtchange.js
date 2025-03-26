const jwt = require('jsonwebtoken');
var jwtChange = function (token) {
	var tokenData = jwt.verify(token, 'ZZLSL', (error, decoded) => {
	    if (error) {
	        //error.message
	        return 'errortoken'
	    }
	    return(decoded);
	});
	return tokenData
}
 
module.exports = jwtChange;