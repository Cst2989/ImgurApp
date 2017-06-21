import { observable, action, computed } from 'mobx';
import { PORTRAIT, CLIENT_ID } from './Constants';

import fetch from 'better-fetch';

fetch.setDefaultHeaders({
    Authorization: `Client-ID ${CLIENT_ID}`
});
const IMGUR_URL = 'https://api.imgur.com/3/';

class Store {
    @observable orientation = PORTRAIT;

    @observable images = [];
    @observable index = 0;
    @observable galleryPage = 0;
    @observable albums = new observable.map();
    @observable screenSize = {
        width: null,
        height: null
    };

    @action changeOrientation(orientation) {
        this.orientation = orientation;
    }

    @action prevImage() {
        this.index = this.index - 1;

        if (this.index < 1) {
            this.index = 0;
        }
    }

    @computed get currentImage() {
        return this.images.length ? this.images[this.index] : null;
    }

    @action nextImage() {
        this.index = this.index + 1;

        if (this.index > this.images.length) {
            this.galleryPage = this.galleryPage+1;
            this.fetchImages();
        }
    }


    @action updateScreenSize(width, height) {
        this.screenSize.width = width;
        this.screenSize.height = height;
    }

    @action fetchImages() {
        fetch(`${IMGUR_URL}gallery/hot/viral/${this.galleryPage}`)
          .then(fetch.throwErrors)
          .then(res => res.json())
          .then(json => {
              json.data.forEach(img => this.images.push(img));
          })
          .catch(err => console.log('ERROR', err.message));
    }

    @action fetchAlbum(id) {
        if (!this.albums.has(id)) {
            fetch(`${IMGUR_URL}album/${id}`)
              .then(fetch.throwErrors)
              .then(res => res.json())
              .then(json => {
                  this.albums.set(json.data.id, json.data);
              })
              .catch(err => console.log('ERROR', err.message, err));
        }
    }
}

export default new Store();
