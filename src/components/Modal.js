import { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal({ children, modalRoot }) {
  const el = document.createElement('div');

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  });

  return ReactDOM.createPortal(
    children,
    el,
  );
}

export default Modal;
