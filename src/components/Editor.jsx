import React from 'react';
import AppDispatcher from './AppDispatcher';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    const content = '{{Персона}}';
    this.state = {
      error: null,
      isLoaded: false,
      old_content: content,
      new_content: content,
    };

    this.handleChange = this.handleChange.bind(this);

    const editor = this;
    AppDispatcher.register((payload) => {
      if (payload.action === 'loadPage') {
        editor.loadPage(payload.title);
      }
    });
  }

  loadPage(title) {
    const url = `https://ru.wikipedia.org/w/api.php?action=query&titles=${title}&prop=revisions&rvprop=content&format=json&formatversion=2`;
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          const content = result.query.pages[0].revisions[0].content;
          this.setState({
            isLoaded: true,
            old_content: content,
            new_content: content,
          });
          AppDispatcher.dispatch({
            event: 'pageLoaded',
            title: title.toString(),
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        },
      );
  }

  handleChange(event) {
    this.setState({
      new_content: event.target.value,
    });
  }

  render() {
    const containerStyle = {
      height: '100%',
    };
    const areaStyle = {
      width: '100%',
      height: '99%',
      fontFamily: 'monospace',
    };
    return (
      <div id="editor-container" style={containerStyle}>
        <textarea id="editor-area" style={areaStyle} value={this.state.new_content} onChange={this.handleChange} />
      </div>
    );
  }
}
