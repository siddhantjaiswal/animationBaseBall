import { connect } from 'react-redux';

import Home from '../scenes/animationDemo';
import getComments from '../actions/actionGetComments';

const mapStateToProps = state => ({
  comments: state.comments.data || [],
  commentsLoading: state.isLoading || false,
});

const mapDispatchToProps = dispatch => ({
  getCommentsFunction: () => dispatch(getComments()),
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

export default HomeContainer;
