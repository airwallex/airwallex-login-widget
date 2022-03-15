import ReactDOM from 'react-dom';
import { App } from './App';
import ReactModal from 'react-modal';

const app = document.getElementById('app');

ReactModal.setAppElement(app);

ReactDOM.render(<App />, app);
