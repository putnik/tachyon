import React from 'react';
import AppDispatcher from './AppDispatcher';
import Search from './Search';

const storage = require('electron-json-storage');
const shortid = require('shortid');

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      defaultPages: [
        { icon: 'home', title: 'Заглавная страница' },
        { icon: 'home', title: 'Википедия:Сообщество' },
      ],
      favoritePages: [],
      recentPages: [],
    };

    storage.get('favoritePages', (error, data) => {
      if (error) throw error;

      this.setState({
        favoritePages: data ? Object.values(data) : [],
      });
    });

    storage.get('recentPages', (error, data) => {
      if (error) throw error;

      this.setState({
        recentPages: data ? Object.values(data) : [],
      });
    });

    AppDispatcher.register((payload) => {
      if (payload.event === 'pageLoaded') {
        let recentPages = this.state.recentPages;
        recentPages = recentPages.filter(item => item.title !== payload.title);
        recentPages = recentPages.map((page) => {
          page.active = false;
          return page;
        });
        recentPages.unshift({ icon: 'back-in-time', title: payload.title, active: true });
        recentPages.slice(0, 10);
        this.setState({
          recentPages: recentPages,
        });
        storage.set('recentPages', recentPages, (error) => {
          if (error) throw error;
        });
      }
    });
  }

  handleGroupItemClick(title) {
    AppDispatcher.dispatch({
      action: 'loadPage',
      title: title.toString(),
    });
  }

  renderSidebarGroupItem(props) {
    return (
      <a href="#" key={shortid.generate()} className={'nav-group-item' + (props.active ? ' active' : '')} onClick={(e) => this.handleGroupItemClick(props.title)}>
        <span className={'icon icon-' + props.icon} />
        {props.title}
      </a>
    );
  }

  renderSidebarGroup(props) {
    const items = props.items;
    const listItems = items.map((itemProps) =>
      this.renderSidebarGroupItem(itemProps)
    );
    return (
      <nav className="nav-group" id={'sidebar-' + props.id}>
        <h5 className="nav-group-title">
          <span className={'icon icon-' + props.icon} />
          {props.title}
        </h5>
        {listItems}
      </nav>
    );
  }

  render() {
    return (
      <div className="pane pane-sm sidebar">
        <Search />
        {this.renderSidebarGroup({ id: 'default', title: '', items: this.state.defaultPages })}
        {this.renderSidebarGroup({ id: 'favorite', title: 'Favorite', items: this.state.favoritePages })}
        {this.renderSidebarGroup({ id: 'recent', title: 'Recent', items: this.state.recentPages })}
      </div>
    );
  }
}
