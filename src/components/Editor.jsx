import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import AppDispatcher from './AppDispatcher';

require('codemirror/mode/xml/xml');

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    const content = '{{Персона}}';
    this.state = {
      error: null,
      isLoaded: false,
      loadedContent: content,
      currentContent: content,
    };

    this.handleChange = this.handleChange.bind(this);
    this.loadPage = this.loadPage.bind(this);

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
            loadedContent: content,
            currentContent: content,
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

  handleChange(editor, data, value) {
    this.setState({
      currentContent: value,
    });
  }

  render() {
    const containerStyle = {
      height: '100%',
    };
    const editorOptions = {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'xml',
    };
    return (
      <div id="editor-container" style={containerStyle}>
        <CodeMirror
          value={this.state.loadedContent}
          onChange={this.handleChange}
          options={editorOptions}
        />
      </div>
    );
  }
}
