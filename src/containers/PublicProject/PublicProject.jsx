import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserProject from '../UserProject/UserProject';
import History from '../History/History';
import Loading from '../../components/common/Loading/Loading.jsx';
import { getUsersProjectList } from '../../actions/project';

@connect((state) => ({
  user: state.user.info,
  userProject: state.project.usersProjectList,
  usersProjectList: state.project.usersProjectList,
}), { getUsersProjectList })

export default class PublicProject extends Component {
  state = {
    isShowLoading: false,
  }
  componentWillMount() {
    if (!this.props.params.id && this.props.user.login) {
      this.setState({ isShowLoading: true });
      this.props.getUsersProjectList().then(() => {
        this.setState({ isShowLoading: false });
      }).catch(() => {});
    }
  }


  renderContent(id) {
    if (!id) return null;
    let content;
    const isBelong = this.props.userProject.some(v => v.id === +id);
    if (this.props.user.login && isBelong) {
      content = <UserProject projectId={id} />;
    } else {
      content = <History projectId={id} isHidden />;
    }
    return content;
  }

  render() {
    let projectId = '';
    if (this.props.usersProjectList.length) {
      projectId = this.props.usersProjectList[0].id;
    }
    const id = this.props.params.id || projectId;
    const content = this.renderContent(String(id));
    return (
      <div>
        {content}
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}

PublicProject.propTypes = {
  params: PropTypes.object,
  getUsersProjectList: PropTypes.func,
  user: PropTypes.object,
  userProject: PropTypes.array,
  usersProjectList: PropTypes.array,
};
