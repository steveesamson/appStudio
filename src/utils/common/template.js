import stringbuilder from './stringbuilder';

const template = function (tplString, data) {
  const RE = /([^{]*)?(\{(\w+)\})?([^{]*)?/gi;
  var sb = stringbuilder();

  tplString = tplString.trim().replace(/"/g, "'");
  tplString = tplString.replace(/[\n\r]/g, ' ');
  tplString = tplString.replace(/\s+/g, ' ');

  tplString.replace(RE, function ($0, $1, $2, $3, $4) {
    if ($1) {
      sb.append($1);
    }
    if ($3) {
      sb.append(data[$3]);
    }

    if ($4) {
      sb.append($4);
    }

    return;
  });

  return sb.toString();
};

export default template;
