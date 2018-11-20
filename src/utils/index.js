const md = {}

md.findKey = (obj, val) => {
  return Object.keys(obj).filter(e => obj[e] === val)[0];
};

export default md;