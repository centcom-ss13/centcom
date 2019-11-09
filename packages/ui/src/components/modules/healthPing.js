import React from 'react';
import actions from "../../actions";
import { connect } from "react-redux";

class HealthPing extends React.Component {
  constructor(props) {
    super(props);

    this.pinger = setInterval(this.ping.bind(this), 5000);

    this.ping();
  }

  componentWillUnmount() {
    clearInterval(this.pinger);
  }

  ping() {
    this.props.fetch('health', { clear: false });
  }

  render() {
    return null;
  }
}
const mapStateToProps = () => {
  return {}
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthPing);