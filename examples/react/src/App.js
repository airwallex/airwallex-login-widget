import { LoginWidget } from '@airwallex/login-widget';
import { useState } from 'react';
import ReactModal from 'react-modal';
import classes from './App.module.css';
import Button from './components/Button';
import MFAWidget from './components/MFAWidget';

LoginWidget.init({ env: 'staging' });

export function App() {
  const [modalIsOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Authenticate</Button>

      <ReactModal
        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.55)' } }}
        className={classes.modal}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <MFAWidget
          onCancel={closeModal}
          onAuthSuccess={(ev) => {
            closeModal();
            console.log(`Auth Success: `, ev);
          }}
        />
      </ReactModal>
    </>
  );
}
