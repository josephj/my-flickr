import React, { Component } from 'react';
import './App.css';
import fetchJsonp from 'fetch-jsonp';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./ServiceWorker.js', {scope: 'flickr/*'});
}

class App extends Component {
  static API_URL = [
    'https://api.flickr.com/services/rest/',
    '?method=flickr.favorites.getPublicList',
    '&api_key=3b99a9655b029a95e0d4d8d980cd74df',
    '&user_id=87715586%40N00&format=json&per_page=30',
  ].join('');
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      count: 0,
      total: 0,
      isFetching: false,
    };
    this.page = 0;
    this.useLiveData = false;
  }
  componentWillMount() {
    this.fetchPhoto(this.page);
  }
  fetchPhoto() {
    this.setState({isFetching: true});
    this.page += 1;
    fetchJsonp(`${App.API_URL}&page=${this.page}`, {
       jsonpCallback: 'jsoncallback',
    })
    .then(response => response.json())
    .then(json => {
      let prevPhotos = this.state.photos;
      let nextPhotos = prevPhotos.concat(json.photos.photo);
      this.setState({
        total: json.photos.total,
        count: nextPhotos.length,
        photos: nextPhotos,
        isFetching: false,
      });
      return Promise.resolve();
    });
  }
  getLivePhoto() {
    return this.fetchPhoto();
  }
  getCachedPhoto() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {

    } else {
      return Promise.reject(Error('No ServiceWorker'));
    }
  }
  render() {
    const {isFetching, photos, total, count} = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>My Flickr Photos</h2>
        </div>
        <div className="App-content">
          <ul>
          {photos.map(photo => {
              const src = `https://farm${photo.farm}.staticflickr.com/
${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
              return (
                <li key={photo.id}>
                  <img src={src} alt={photo.title}/>
                </li>
              );
          })}
          </ul>
        </div>
        {(!isFetching && total - 1 > count) && (
          <a
            className="App-load"
            onClick={this.fetchPhoto.bind(this)}>
            Load More Photo
          </a>
        )}
      </div>
    );
  }
}

export default App;
