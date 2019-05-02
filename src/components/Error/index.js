import React from 'react';

const ErrorPage = (props) => {
  const { error } = props;
if(error) {
  return (
    <div></div>
  );
}
return (
  <div></div>
);
};

ErrorPage.defaultProps = {
};
ErrorPage.propTypes = {
};

export default ErrorPage;
