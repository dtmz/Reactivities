import { useEffect } from "react";
import { withRouter } from "react-router-dom";

const ScrollToTop = ({children, location: { pathname }}: any) => {
  //const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}

export default withRouter(ScrollToTop);