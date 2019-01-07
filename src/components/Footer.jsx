import React from 'react';
import AppDispatcher from './AppDispatcher';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    AppDispatcher.register((payload) => {
      if (payload.event === 'pageLoaded') {
        this.setState({
          text: `Загружена страница: ${payload.title}`,
        });
      }
    });
  }

  render() {
    return (
      <header className="toolbar toolbar-footer">
        <h1 className="title">{this.state.text}</h1>
      </header>
    );
  }
}
