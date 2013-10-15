//site_dev/js/lib/cookie_util.js

define([], 
  function () {
    var CookieUtil = {

      get: function (name) {
        var cookie_name = encodeURIComponent(name) + '=',
            cookie_start = document.cookie.indexOf(cookie_name),
            cookie_value = null;

        if (cookie_start > -1) {
            cookie_end = document.cookie.indexOf(';', cookie_start); 
            if (cookie_end === -1) {
                cookie_end = document.cookie.length;
            }
            cookie_value = decodeURIComponent(document.cookie.
                             substring(cookie_start + cookie_name.length, cookie_end));
        }
        return cookie_value;
      },

      set: function (name, value, expires, path, domain, secure) {
        var cookie_text = encodeURIComponent(name) + '=' + encodeURIComponent(value);

        if (expires instanceof Date) {
            cookie_text = cookie_text + '; expires=' + expires.toGMTString();
        }

        if (path) {
            cookie_text = cookie_text + '; path=' + path;
        }

        if (domain) {
            cookie_text = cookie_text + '; domain=' + domain;
        }

        if (secure) {
            cookie_text = cookie_text + '; secure';
        }

        document.cookie = cookie_text;
      },

      unset: function (name, path, domain, secure) {
        this.set(name, '', new Date(0), path, domain, secure);

      },

    };

    return CookieUtil;
  }
);
