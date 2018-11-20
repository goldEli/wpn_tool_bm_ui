/**
 * create by miaoyu 2018/6/5
 * status: 0 成功 1 失败 2 重定向
 */

const urls = {
  queryAllGoods: "/goods/queryAll",
  addGoods: "/goods/add",
  delGoods: "/goods/del",
  updateGoods: "/goods/update",
  login: "/users/login",
};

const handleFetch = function(options) {
  const { url, success, param } = options;
  fetch(url, {
    body: JSON.stringify(param || {}), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json"
    },
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // *client, no-referrer
    credentials: "include" // with cookie
  })
    .then(res => {
      if (res.status === 200) {
        return res.text();
      } else {
        console.error(res.status + ":" + res.statusText);
      }
    })
    .then(res => {
      if (!res) return
      if (typeof res === 'string') {
        res = JSON.parse(res)
      }
      switch (res.status) {
        case 0:
          if (success) {
            success(res.data);
          }
          break;
        case 1:
          alert(res.msg);
          break;
        case 2:
          window.location.hash = res.data.url;
          break;
        default:
          break;
      }
    });
};

const md = (function() {
  const o = {};
  for (let key in urls) {
    const url = urls[key];
    o[key] = function(options) {
      handleFetch({ ...options, url });
    };
  }
  return o;
})();

export default md;
