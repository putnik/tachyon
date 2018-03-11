import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <nav className="nav-group">
        <h5 className="nav-group-item">
          <input className="form-control" type="search" placeholder="Введите название статьи" />
        </h5>
      </nav>
    );
  }
}
