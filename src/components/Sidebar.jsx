import React from 'react';
import AppDispatcher from './AppDispatcher';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      defaultItems: [
        { icon: 'home', title: 'Заглавная страница' },
      ],
      favouriteItems: [
        { icon: 'bookmark', title: 'Electron' },
        { icon: 'bookmark', title: 'WebStorm' },
      ],
      recentItems: [
        { icon: 'back-in-time', title: 'Антикварианизм' },
        { icon: 'back-in-time', title: 'Ваан' },
        { icon: 'back-in-time', title: 'Чернявский, Василий Тимофеевич' },
      ],
    };

    const editor = this;
    AppDispatcher.register((payload) => {
      if (payload.event === 'pageLoaded') {
        let recentItems = this.state.recentItems;
        recentItems.filter(item => item.title === payload.title);
        recentItems = recentItems.map((item) => {
          item.active = false;
          return item;
        });
        recentItems.unshift({ icon: 'back-in-time', title: payload.title, active: true });
        this.setState({
          recentItems: recentItems,
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
        <nav className="nav-group">
          <h5 className="nav-group-title">
            <input className="form-control" type="text" placeholder="Введите название статьи" />
          </h5>
        </nav>
        {this.renderSidebarGroup({ id: 'default', title: '', items: this.state.defaultItems })}
        {this.renderSidebarGroup({ id: 'favorite', title: 'Favorite', items: this.state.favouriteItems })}
        {this.renderSidebarGroup({ id: 'recent', title: 'Recent', items: this.state.recentItems })}
      </div>
    );
  }
}
