import React from 'react';
import PropTypes from 'prop-types';
import CommentsList from './CommentsList';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    const { comments } = this.props;
    this.state = {
      comments,
      loading: false,
      location: false,
      latitude: '',
      longitude: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.comments !== nextProps.comments) {
      return { comments: nextProps.comments };
    }
    return null;
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(
      successPosition => {
        console.log('Position:----->>>>', successPosition);
        this.setState({
          location: true,
          latitude: successPosition.coords.latitude,
          longitude: successPosition.coords.longitude
        })
      },
      errorPosition => {
        console.log('error:---->>>>', errorPosition)
      }
    )
  }

  render() {
    const { comments, loading, location, latitude, longitude } = this.state;

    if (loading) {
      return (<>Loading...</>);
    }
    if (location) {
      return (
        <div>
          <div>
            latitude:-> <br />
            {longitude}
          </div>
          <div>
            latitude:-> <br />
            {latitude}
          </div>
        </div>);
    }
    return (
      <div>
        <div>
          Allow Location to see this page.
        </div>
      </div>);
  }
}

Home.defaultProps = {
  comments: [{}],
};
Home.propTypes = {
  comments: PropTypes.array,
  getCommentsFunction: PropTypes.func.isRequired,
  commentsLoading: PropTypes.bool.isRequired,
};

export default Home;
