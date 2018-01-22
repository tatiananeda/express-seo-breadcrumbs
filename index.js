/**
 * @const breadcrumbs
 * @type {Array} of objects of type {name, url}
 */
const breadcrumbs = [];

/**
 * variables to detect current route and current subroute
 * in order to clear breadcrumbs when user moves to another section of site
 */
let currentRoute, currentSubroute;

/**
 * @function exists
 * @param {Object}
 * @returns index of object within an array of breadcrumbs
 */
const exists = (obj) => breadcrumbs.findIndex(crumb => crumb.name === obj.name && crumb.url === obj.url);

/**
 * @function addBreadcrumbs getter/setter for breadcrumbs
 * @param {Object}
 */
const addBreadcrumbs = (crumb) => {
  if (!crumb) return breadcrumbs;

  const idx = exists(crumb);

  if (~idx) {

    if (idx !== 0) {
      breadcrumbs.splice(idx + 1);
    }

  } else {

    if (breadcrumbs.length === 1) {
      breadcrumbs.push(crumb);
      currentRoute = crumb.url.split('/')[1];
      return;
    }

    if (breadcrumbs.length === 2 && crumb.url.includes(currentRoute)) {
      breadcrumbs.push(crumb);
      currentSubroute = crumb.url.split('/')[2];
      return;
    }

    if (!crumb.url.includes(currentRoute)) {
      breadcrumbs.splice(1);
      breadcrumbs.push(crumb);
      currentRoute = crumb.url.split('/')[1];
      return;
    }

    if (!crumb.url.includes(currentSubroute)) {
      breadcrumbs.splice(2);
      breadcrumbs.push(crumb);
      currentSubroute = crumb.url.split('/')[2];
      return;
    }

    breadcrumbs.push(crumb);
  }
};

/**
 * @function setHome sets home page location
 * @param {Object}
 */
const setHome = ({name = 'Home', url = '/'}) => breadcrumbs.push({name, url});

/**
 * @function init attaches method to req object
 * @return {Function}
 */
const init = function () {
  return function (req, res, next) {
    req.breadcrumbs = addBreadcrumbs;
    next();
  };
};

module.exports = {
  setHome,
  init
};
