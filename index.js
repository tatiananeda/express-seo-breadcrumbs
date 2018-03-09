/**
 * @const breadcrumbs
 * @type {Array} of objects of type {name, url}
 */
const breadcrumbs = [];

/**
 * @function exists
 * @param {Object}
 * @returns index of the same object as a new crumb within an array of breadcrumbs
 */
const exists = obj => breadcrumbs.findIndex(crumb => crumb.name === obj.name && crumb.url === obj.url);

/**
 * @function exists
 * @param {Object}
 * @returns index of an object whose url is included into url of the new crumb within an array of breadcrumbs
 */
const isInner = obj => breadcrumbs.findIndex(crumb => obj.url.includes(`${crumb.url}/`));

/**
 * @function addBreadcrumbs getter/setter for breadcrumbs
 * @param {Object}
 */
const addBreadcrumbs = (crumb) => {
  if (!crumb) return breadcrumbs;

  const idx = exists(crumb);
  const idxOuter = isInner(crumb);

  if(breadcrumbs.length === 1) {
    breadcrumbs.push(crumb);
    return;
  }

  if(!~idx && ~idxOuter){
    if(idxOuter !== breadcrumbs.length - 1){
      breadcrumbs.splice(idxOuter + 1, breadcrumbs.length);
    }
    breadcrumbs.push(crumb);
    return;
  }

  if(!~idx && !~idxOuter){
    breadcrumbs.splice(1, breadcrumbs.length);
    breadcrumbs.push(crumb);
    return;
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
