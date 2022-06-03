import Quill from 'quill';
import _ext from 'utils/common/getFileExtension';
import basename from 'utils/common/getPathBaseName';
import { attachXButton } from './closeButton';
import { icon } from './fileIcons';

let BlockEmbed = Quill.import('blots/block/embed');
let Link = Quill.import('formats/link');

const ATTRIBUTES = ['source', 'id'];

class Document extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    const { id, source } = value;
    node.setAttribute('id', id);
    node.setAttribute('data-source', source.join(','));
    // node.classList.add('docList');

    // const fileItems =
    source.forEach((src) => {
      let file, ext, href;
      if (src.indexOf('||') > 0) {
        const [path, name] = src.split('||');
        file = name;
        ext = name ? _ext(name) : '';
        href = path;
      } else {
        ext = src ? _ext(src) : '';
        file = src;
        href = src;
      }
      const anchor = document.createElement('a');
      anchor.setAttribute('href', href);
      anchor.setAttribute('title', basename(file));
      anchor.classList.add('fileItem');
      anchor.classList.add('clickable');
      anchor.innerHTML = `
        <em>${icon(ext)}</em>
        <span class="caption" spellcheck="false">${basename(file)}</span>
        `;
      attachXButton(anchor, href, 'doc');
      node.appendChild(anchor);
    });

    // <div class='docList'>
    // {#each data.source as file, i}
    // <DocumentItem {file}/>
    // {/each}
    // </div>

    /*
    return `<a class="fileItem clickable" href='${path}' title='${basename(file)}'>
              <em>${icon(ext)}</em>
              <span class="caption">${basename(file)}</span>
             </a>`;
    <a class="fileItem clickable" {href} title={basename(file)}>
    <em>
        <Icon type={`${ext}-file`} size={18} />
    </em>
    <span class="caption">{basename(file)}</span>
    </a>
     node.innerHTML = fileItems.join('');
     attachXButton(node, source, 'doc');
    */

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

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return {
      source: (domNode.getAttribute('data-source') || '').split(','),
      id: domNode.getAttribute('id'),
    };
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
  deleteAt() {
    return false;
  }
}
Document.blotName = 'document';
Document.tagName = 'DIV';
Document.className = 'docList';

Quill.register(Document);
