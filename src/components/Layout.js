import React from 'react';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';


/*
const Layout = ({ component: Component, ...rest }) => {

  return (
    <>
      <Header />
      <Component {...rest} />
      <Footer />
    </>
  )
};

export default Layout;
*/
class Layout extends React.Component {
  render() {
    return (
      <>
        <Header />
        <NavBar />
        {/*<Component {...props} />*/}
        <Footer />
      </>
    );
  }
}

export default Layout;
