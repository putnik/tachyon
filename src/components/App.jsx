import React from 'react';
import Editor from './Editor';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

export default class App extends React.Component {
  render() {
    return (
      <div className="window">
        <Header />
        <div className="window-content">
          <div className="pane-group">
            <Sidebar />
            <div className="pane">
              <Editor />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
