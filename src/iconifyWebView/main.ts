import './style.css';

const vscode = acquireVsCodeApi();

window.addEventListener('message', (event) => {
  const message = event.data; // The json data that the extension sent
  switch (message.type) {
    case 'xxx': {
      vscode.postMessage('after-xx');
      break;
    }
  }
});

document.body.innerHTML = '<p>Hello!</p>';
