const errorHandle = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // set the status code
  res.status(err.status || 500);
  console.log(req.headers)
  // 根据请求类型和 Accept 头来决定响应方式
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    // API 请求返回 JSON
    res.json({
      error: res.locals.error,
      message: res.locals.message
    });
  } else if (req.headers.accept.indexOf('html') > -1) {
    // HTML 请求有三种处理方式：
    // 3. 直接发送HTML
    res.send(`
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Error ${err.status || 500}</h1>
          <p>${res.locals.message}</p>
        </body>
      </html>
    `);
  } else {
    // res.redirect('/404');
    res.type('txt').send('Error occurred');
  }
}

module.exports = errorHandle;