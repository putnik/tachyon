import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <header className="toolbar toolbar-header">
        <div className="toolbar-actions">
          <button className="btn btn-default pull-right">
            {this.state.date.toLocaleTimeString('ru', { timeZone: 'UTC' }) + ' UTC'}
          </button>
        </div>
      </header>
    );
  }
}
