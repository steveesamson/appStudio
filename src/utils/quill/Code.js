import Parchment from 'parchment';
import Quill from 'quill';

const Container = Quill.import('blots/container');
// const Block = Quill.import('blots/block');
const Inline = Quill.import('blots/inline');
// const Break = Quill.import('blots/break');
// const Cursor = Quill.import('blots/cursor');
// const TextBlot = Quill.import('blots/text');

const ATTRIBUTES = ['id', 'data-lang'];

class Code extends Inline {
  static formats(domNode) {
    return domNode.tagName === this.tagName ? undefined : super.formats(domNode);
  }

  format(name, value) {
    if (name === CodeBlock.blotName && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
  }

  remove() {
    if (this.prev == null && this.next == null) {
      this.parent.remove();
    } else {
      super.remove();
    }
  }

  replaceWith(name, value) {
    this.parent.isolate(this.offset(this.parent), this.length());
    if (name === this.parent.statics.blotName) {
      this.parent.replaceWith(name, value);
      return this;
    } else {
      this.parent.unwrap();
      return super.replaceWith(name, value);
    }
  }
}
Code.blotName = 'code';
Code.className = 'hljs';
Code.tagName = 'CODE';

class CodeBlock extends Container {
  static create(value) {
    // let tagName = value === 'ordered' ? 'OL' : 'UL';
    let node = super.create();
    const { id, language } = value;
    node.setAttribute('id', id);
    node.setAttribute('data-lang', language);

    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  constructor(domNode) {
    super(domNode);
    const codeEventHandler = (e) => {
      if (e.target.parentNode !== domNode) return;
      // let format = this.statics.formats(domNode);
      let blot = Parchment.find(e.target);
      const language = domNode.getAttribute('data-lang');
      blot.format('code', { language });
      // if (format === 'checked') {
      //   blot.format('list', 'unchecked');
      // } else if (format === 'unchecked') {
      //   blot.format('list', 'checked');
      // }
    };

    domNode.addEventListener('touchstart', codeEventHandler);
    domNode.addEventListener('mousedown', codeEventHandler);
  }

  format(name, value) {
    if (this.children.length > 0) {
      this.children.tail.format(name, value);
    }
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]: this.statics.formats(this.domNode) };
  }

  insertBefore(blot, ref) {
    if (blot instanceof Code) {
      super.insertBefore(blot, ref);
    } else {
      let index = ref == null ? this.length() : ref.offset(this);
      let after = this.split(index);
      after.parent.insertBefore(blot, after);
    }
  }

  optimize(context) {
    super.optimize(context);
    let next = this.next;
    if (
      next != null &&
      next.prev === this &&
      next.statics.blotName === this.statics.blotName &&
      next.domNode.tagName === this.domNode.tagName
    ) {
      next.moveChildren(this);
      next.remove();
    }
  }

  replace(target) {
    if (target.statics.blotName !== this.statics.blotName) {
      let item = Parchment.create(this.statics.defaultChild);
      target.moveChildren(item);
      this.appendChild(item);
    }
    super.replace(target);
  }
  static value(domNode) {
    return {
      id: domNode.getAttribute('id'),
      language: domNode.getAttribute('data-lang'),
    };
  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.scope = Parchment.Scope.BLOCK_BLOT;
CodeBlock.tagName = 'PRE';
CodeBlock.defaultChild = 'code';
CodeBlock.allowedChildren = [Code];

Quill.register('formats/code', Code);
export { CodeBlock as default };
