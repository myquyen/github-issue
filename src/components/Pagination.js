import React, { Component } from 'react'

export default class Pagination extends Component {
  renderPagination() {
    let pages = [];
    let current = this.props.page;
    let count = this.props.total_count;
    for (let i = 1; i <= count; i++) {
      pages.push(i);
    }

    return pages.map(page => {
      if (page <= current + 3 && page >= current - 3) {
        return (
          <li
            className={page === current ? "active" : null}
            onClick={() => {
              this.props.fetchIssues(page);
            }}
          >
            <a href="#!">{page}</a>
          </li>
        );
      }
    });
  }

  render() {
    return (
      <ul className="pagination container center-align">
          <li
            className="waves-effect"
            onClick={() => this.props.fetchIssues(1)}
          >
            <a href="#!">
              <i className="material-icons">first_page</i>
            </a>
          </li>
          <li className="waves-effect">
            <a
              href="#!"
              onClick={() => {
                if (this.props.page > 1)
                  this.props.fetchIssues(this.props.page - 1);
              }}
            >
              <i className="material-icons">chevron_left</i>
            </a>
          </li>
          {this.renderPagination()}
          <li className="waves-effect">
            <a
              href="#!"
              onClick={() => {
                if (this.props.page < this.props.total_count)
                  this.props.fetchIssues(this.props.page + 1);
              }}
            >
              <i className="material-icons">chevron_right</i>
            </a>
          </li>
          <li
            className="waves-effect"
            onClick={() => {
              this.props.fetchIssues(this.props.total_count);
            }}
          >
            <a href="#!">
              <i className="material-icons">last_page</i>
            </a>
          </li>
        </ul>
    )
  }
}
