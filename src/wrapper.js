import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ErrorPage from './components/Error';
const HomeContainer = lazy(() => import('./containers/HomeContainer'));
const HomeContainer2 = lazy(() => import('./scenes/animationDemo/skybox'));
const HomeContainer3 = lazy(() => import('./scenes/Home'));


class wrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  // }

  render() {
    const { error } = this.props;
    console.log('errorrr', error)

    return ( 
    <>
      <ErrorPage error={true} />
        <Router>
            <Suspense fallback={<>Loading...</>}>
                <Switch>
                    <Route exact path="/" component={HomeContainer} />
                    <Route exact path="/model" component={HomeContainer2} />
                    <Route exact path="/location" component={HomeContainer3} />

                    
                </Switch>
            </Suspense>
        </Router>
     </>
    );
  }
}

wrapper.defaultProps = {
};
wrapper.propTypes = {
  error: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    error: state.comments.error
  }
}

const wrapperContainer = connect(
  mapStateToProps
)(wrapper)

export default wrapperContainer;
