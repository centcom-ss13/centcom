import React from 'react';
import { Icon, Statistic, Tabs, Row, Col, Skeleton } from "antd";
import { connect } from "react-redux";
import actions from "../../../../actions/index";

class Health extends React.Component {
  getHealthStatistic(value) {
    let icon;

    if (value === 'Online') {
      icon = (<Icon type="check-circle" theme="twoTone" twoToneColor="#22EE22"/>);
    } else if (value === 'Offline') {
      icon = (<Icon type="exclamation-circle" theme="twoTone" twoToneColor="#EE2222"/>);
    } else if (value === 'Unknown') {
      icon = (<Icon type="question-circle" theme="twoTone" twoToneColor="#222222"/>);
    } else if (value === 'Impaired') {
      icon = (<Icon type="warning" theme="twoTone" twoToneColor="#CCCC55"/>);
    } else {
      icon = (<Icon type="stop" theme="twoTone" twoToneColor="#222222"/>);
    }

    return (
      <span>{icon} {value}</span>
    );
  }

  getContent() {
    if (this.props.communityConfig === undefined || this.props.health === undefined) {
      return (<Skeleton active/>);
    }

    const health = Object.entries(this.props.health)
      .map(([service, status]) => ({ [service]: this.getTextFromState(status) }))
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});

    const healthText = this.getHealthText(health);
    return (
      <React.Fragment>
        <Row gutter={20} type="flex" justify="space-between">
          <Col span={10}>
            <Statistic title="SS13 Server" value={healthText('ss13_server')} formatter={this.getHealthStatistic}/>
          </Col>
          <Col span={10}>
            <Statistic title="CentCom Server" value={healthText('backend')} formatter={this.getHealthStatistic}/>
          </Col>
          <Col span={10}>
            <Statistic title="CentCom Static Host" value={healthText('frontend')} formatter={this.getHealthStatistic}/>
          </Col>
          <Col span={10}>
            <Statistic title="Database" value={healthText('mysql')} formatter={this.getHealthStatistic}/>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  getHealthText(health) {
    return (key) => health[key] || 'Unknown';
  }

  getTextFromState(healthState) {
    if (healthState === 'UP') {
      return 'Online';
    } else if (healthState === 'DOWN') {
      return 'Offline';
    } else if (healthState === 'IMPAIRED') {
      return 'Impaired';
    } else {
      return 'Unknown';
    }
  }

  render() {
    return (
      <Tabs.TabPane
        {...this.props}
        className="server-stats-menu-item"
      >
        {this.getContent()}
      </Tabs.TabPane>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    servers: state.app.servers,
    communityConfig: state.app.communityConfig,
    health: state.app.health,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Health);