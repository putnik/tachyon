import React from 'react';
import AppDispatcher from './AppDispatcher';

const storage = require('electron-json-storage');

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openPages: [],
    };

    storage.get('openPages', (error, data) => {
      if (error) throw error;

      this.setState({
        openPages: data ? Object.values(data) : [],
      });
    });

    AppDispatcher.register((payload) => {
      if (payload.event === 'pageLoaded') {
        let openPages = this.state.openPages;
        openPages.filter(item => item.title === payload.title);
        openPages = openPages.map((page) => {
          page.active = false;
          return page;
        });
        openPages.push({ title: payload.title, active: true });
        this.setOpenPages(openPages);
      }
    });
  }

  setOpenPages(openPages) {
    this.setState({
      openPages: openPages,
    });
    storage.set('openPages', openPages, (error) => {
      if (error) throw error;
    });
  }

  handleTabClick(e, title) {
    let openPages = this.state.openPages;
    const role = e.target.getAttribute('role');
    if (role === 'button') {
      AppDispatcher.dispatch({
        action: 'closePage',
        title: title.toString(),
      });
      openPages = openPages.filter(page => page.title !== title);
    } else if (role === 'tab') {
      openPages = openPages.map((page) => {
        page.active = (page.title === title);
        return page;
      });
    }
    this.setOpenPages(openPages);
  }

  renderTab(props) {
    return (
      <div key={props.title} role="tab" className={'tab-item' + (props.active ? ' active' : '')} onClick={(e) => this.handleTabClick(e, props.title)}>
        <span role="button" className="icon icon-cancel icon-close-tab" />
        {props.title}
      </div>
    );
  }

  render() {
    const tabs = this.state.openPages.map((tabProps) =>
      this.renderTab(tabProps),
    );
    return (
      <div role="tabpanel" className="tab-group">
        {tabs}
      </div>
    );
  }
}
