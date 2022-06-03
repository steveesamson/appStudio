import { useStore } from 'utils/store';
export const attachCloseButton = (node, file, mediaType) => {
  const closeButton = document.createElement('button');
  closeButton.classList.add('closeBlotButton');
  closeButton.appendChild(document.createTextNode('Remove'));
  node.appendChild(closeButton);
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Sure you want to remove this?')) {
      node.parentNode.removeChild(node);
      if (file) {
        useStore('core').dropFile({ file, mediaType });
      }
    }
  });
};
export const attachXButton = (node, file, mediaType) => {
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('removeBlot');
  closeButton.innerHTML = `<svg fill='currentColor' viewBox='0 0 24 24' height='16' width='16'><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>`;
  node.appendChild(closeButton);
  closeButton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (confirm('Sure you want to remove this?')) {
      const parent = node.parentNode;
      parent.removeChild(node);
      if (!parent.firstChild) {
        parent.parentNode.removeChild(parent);
      }
      if (file) {
        const { data, error } = useStore('core').dropFile({ file, mediaType });
        console.log(data, error);
      }
    }
  });
};
