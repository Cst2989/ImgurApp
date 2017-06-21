import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import TouchableImage from './TouchableImage';
import Album from './Album';
import Spinner from './Spinner';
import { inject, observer } from 'mobx-react/native';

@inject('store') @observer
class ImgurCarousel extends Component {
    render() {
        const { store } = this.props;

        if (!store.currentImage) {
            return <Spinner/>;
        }

        if (store.currentImage.is_album) {
            return (
                <Album albumID={store.currentImage.id} />
            );
        }else{
            return (
                <TouchableImage image={store.currentImage} />
            );
        }
    }
}

export default ImgurCarousel;
