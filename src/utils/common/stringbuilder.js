const stringbuilder = function (initialString) {
  const content = [];
  initialString && content.push(initialString);

  return {
    append(text) {
      content.push(text);
      this.length = content.length;
      return this;
    },
    length() {
      return content.length;
    },
    toString() {
      return content.join('');
    },
    clear() {
      content.splice(0, content.length);
      return this;
    },
  };
};

export default stringbuilder;
