import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Carousel, Container, FlatList, QuickView, Text,
} from '@components';
import { ActivityIndicator, Dimensions } from 'react-native';
import {
  applyArraySelector,
  applyObjectSelector,
  parseArraySelector,
  parseObjectSelector,
} from '@utils/selector';
import { TQuery } from '@utils/redux';
import { jobGetListCompany } from '../../redux/slice';
import {
  jobDetailSelector,
  jobListCompanySelector,
} from '../../redux/selector';
import renderJobs from '../Shared/renderJobs';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  list: any;
  getList: any;
  detail: any;
}
class RecruitmentScreen extends PureComponent<Props, any> {
  componentDidMount() {
    const {
      detail: { data, loading },
      getList,
    } = this.props;
    console.log('data', data);

    const payload: TQuery = {
      s: { 'user.profile.name': data?.user?.profile?.name },
    };

    getList(payload);
  }

  // loadMoreData = () => {
  //   const { getList } = this.props;
  //   const { page } = this.state;
  //   this.setState({ page: page + 1 });

  //   const payload: TQuery = {
  //     s: { 'user.profile.name': data.user.profile.name },
  //     limit: 9,
  //     page,
  //   };
  //   getList(payload);
  // };

  render() {
    const {
      list: { data, metadata },
    } = this.props;

    return (
      <Container>
        <QuickView>
          <QuickView
            row
            justifyContent="space-between"
            paddingHorizontal={15}
            marginTop={20}
          >
            <Text color="#000" fontSize={20} bold>
              Opening Jobs
            </Text>
            <Text color="#000">
              {metadata?.count}
              {' '}
              Jobs
            </Text>
          </QuickView>
          <FlatList
            data={data}
            renderItem={renderJobs}
            // onEndReached={this.loadMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => {
              const { list } = this.props;
              if (list.loading) {
                return (
                  <QuickView style={{ flex: 1, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ff6a00" />
                  </QuickView>
                );
              }
              return <></>;
            }}
          />
        </QuickView>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  list: parseArraySelector(applyArraySelector(jobListCompanySelector, state)),
  detail: parseObjectSelector(applyObjectSelector(jobDetailSelector, state)),
});

const mapDispatchToProps = (dispatch: any) => ({
  getList: (query?: TQuery) => dispatch(jobGetListCompany({ query })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecruitmentScreen as any);
