import React from 'react';
import AppDispatcher from './AppDispatcher';
import Search from './Search';

const storage = require('electron-json-storage');

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      defaultItems: [
        { icon: 'home', title: 'Заглавная страница' },
        { icon: 'home', title: 'Википедия:Сообщество' },
      ],
      favouriteItems: [],
      recentItems: [],
    };

    storage.get('favoriteItems', (error, data) => {
      if (error) throw error;

      this.setState({
        favouriteItems: data ? Object.values(data) : [],
      });
    });

    storage.get('recentItems', (error, data) => {
      if (error) throw error;

      this.setState({
        recentItems: data ? Object.values(data) : [],
      });
    });

    AppDispatcher.register((payload) => {
      if (payload.event === 'pageLoaded') {
        let recentItems = this.state.recentItems;
        recentItems.filter(item => item.title === payload.title);
        recentItems = recentItems.map((item) => {
          item.active = false;
          return item;
        });
        recentItems.unshift({ icon: 'back-in-time', title: payload.title, active: true });
        recentItems.slice(0, 10);
        this.setState({
          recentItems: recentItems,
        });
        storage.set('recentItems', recentItems, (error) => {
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
      <a href="#" key={props.title} className={'nav-group-item' + (props.active ? ' active' : '')} onClick={(e) => this.handleGroupItemClick(props.title)}>
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
        {this.renderSidebarGroup({ id: 'default', title: '', items: this.state.defaultItems })}
        {this.renderSidebarGroup({ id: 'favorite', title: 'Favorite', items: this.state.favouriteItems })}
        {this.renderSidebarGroup({ id: 'recent', title: 'Recent', items: this.state.recentItems })}
      </div>
    );
  }
}
